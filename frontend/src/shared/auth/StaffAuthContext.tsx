import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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
