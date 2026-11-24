import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
 clearSession,
 getStoredUser,
 getToken,
 saveSession,
 type AuthUser,
} from "./authStorage";

type AuthContextValue = {
 user: AuthUser | null;
 token: string | null;
 isAuthenticated: boolean;
 login: (token: string, user: AuthUser) => void;
 updateUser: (user: AuthUser) => void;
 logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
 const [token, setToken] = useState<string | null>(() => getToken());
 const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

 const value = useMemo<AuthContextValue>(
 () => ({
 user,
 token,
 isAuthenticated: Boolean(token && user),
 login: (nextToken, nextUser) => {
 saveSession(nextToken, nextUser);
 setToken(nextToken);
 setUser(nextUser);
 },
 updateUser: (nextUser) => {
 const current = getToken();
 if (current) saveSession(current, nextUser);
 setUser(nextUser);
 },
 logout: () => {
 clearSession();
 setToken(null);
 setUser(null);
 },
 }),
 [token, user],
 );

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
 const ctx = useContext(AuthContext);
 if (!ctx) {
 throw new Error("useAuth must be used within AuthProvider");
 }
 return ctx;
}
