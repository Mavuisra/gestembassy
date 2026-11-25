import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  boGet,
  STAFF_AUTH_EXPIRED_EVENT,
  StaffSessionExpiredError,
} from "../api/backofficeClient";
import {
  clearStaffSession,
  getStaffToken,
  getStoredStaff,
  saveStaffSession,
  type StaffUser,
} from "./staffStorage";

type StaffAuthContextValue = {
  user: StaffUser | null;
  token: string | null;
  isStaffAuthenticated: boolean;
  login: (token: string, user: StaffUser) => void;
  logout: () => void;
};

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStaffToken());
  const [user, setUser] = useState<StaffUser | null>(() => getStoredStaff());

  // Après cold start Render / reset SQLite, l'ancien token local devient invalide → 401.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    boGet<StaffUser>("/me/", token)
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        saveStaffSession(token, me);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof StaffSessionExpiredError || getStaffToken() === null) {
          setToken(null);
          setUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    function onExpired() {
      setToken(null);
      setUser(null);
    }
    window.addEventListener(STAFF_AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(STAFF_AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo<StaffAuthContextValue>(
    () => ({
      user,
      token,
      isStaffAuthenticated: Boolean(token && user),
      login: (nextToken, nextUser) => {
        saveStaffSession(nextToken, nextUser);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        clearStaffSession();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth(): StaffAuthContextValue {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
