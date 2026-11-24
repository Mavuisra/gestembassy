export type StaffUser = {
 id: number;
 email: string;
 display_name: string;
 role: string;
 is_staff: true;
};

const TOKEN_KEY = "ambadrcor_staff_token";
const USER_KEY = "ambadrcor_staff_user";

export function getStaffToken(): string | null {
 return localStorage.getItem(TOKEN_KEY);
}

export function getStoredStaff(): StaffUser | null {
 const raw = localStorage.getItem(USER_KEY);
 if (!raw) return null;
 try {
 return JSON.parse(raw) as StaffUser;
 } catch {
 return null;
 }
}

export function saveStaffSession(token: string, user: StaffUser): void {
 localStorage.setItem(TOKEN_KEY, token);
 localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStaffSession(): void {
 localStorage.removeItem(TOKEN_KEY);
 localStorage.removeItem(USER_KEY);
}
