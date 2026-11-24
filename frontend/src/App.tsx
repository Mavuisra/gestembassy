import { AuthProvider } from "./shared/auth/AuthContext";
import { StaffAuthProvider } from "./shared/auth/StaffAuthContext";
import { AppRouter } from "./app/router";

export default function App() {
 return (
 <AuthProvider>
 <StaffAuthProvider>
 <AppRouter />
 </StaffAuthProvider>
 </AuthProvider>
 );
}
