import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { boPost } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import type { StaffUser } from "../../shared/auth/staffStorage";
import { fieldClass } from "./ui";

type LoginResponse = { token: string; user: StaffUser };

function Spinner({ className = "" }: { className?: string }) {
 return (
 <span
 className={`inline-block h-5 w-5 border-2 border-current border-t-transparent ${className}`}
 style={{ animation: "bo-spin 0.7s linear infinite" }}
 aria-hidden
 />
 );
}

export function StaffLoginPage() {
 const { login, isStaffAuthenticated } = useStaffAuth();
 const navigate = useNavigate();
 const [booting, setBooting] = useState(true);
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 const t = window.setTimeout(() => setBooting(false), 700);
 return () => window.clearTimeout(t);
 }, []);

 if (isStaffAuthenticated) return <Navigate to="/backoffice" replace />;

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setLoading(true);
 setError("");
 const form = new FormData(event.currentTarget);
 try {
 const data = await boPost<LoginResponse>("/auth/login/", {
 email: form.get("email"),
 password: form.get("password"),
 });
 login(data.token, data.user);
 navigate("/backoffice", { replace: true });
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur de connexion");
 } finally {
 setLoading(false);
 }
 }

 if (booting) {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white">
 <img src="/embleme-rdc.png" alt="" className="h-16 w-auto object-contain" />
 <span
 className="h-9 w-9 border-2 border-navy border-t-transparent"
 style={{ animation: "bo-spin 0.7s linear infinite" }}
 role="status"
 aria-label="Chargement"
 />
 </div>
 );
 }

 return (
 <div className="flex min-h-screen items-center justify-center bg-white p-4">
 <form onSubmit={onSubmit} className="relative w-full max-w-sm border border-line bg-white p-6" noValidate>
 {loading ? (
 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90">
 <span
 className="h-8 w-8 border-2 border-navy border-t-transparent"
 style={{ animation: "bo-spin 0.7s linear infinite" }}
 role="status"
 aria-label="Connexion"
 />
 </div>
 ) : null}
 <div className="flex flex-col items-center text-center">
 <img src="/embleme-rdc.png" alt="Emblème RDC" className="h-16 w-auto object-contain" />
          <h1 className="mt-4 text-xl font-extrabold text-navy">Back office</h1>
 </div>
 <label className="mt-6 block text-sm font-semibold text-navy">
 E-mail
 <input name="email" type="email" required autoComplete="username" className={fieldClass} disabled={loading} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 Mot de passe
 <input
 name="password"
 type="password"
 required
 autoComplete="current-password"
 className={fieldClass}
 disabled={loading}
 />
 </label>
 {error ? <p className="mt-3 text-sm text-rdc-red">{error}</p> : null}
 <button type="submit" disabled={loading} className="btn-navy mt-5 inline-flex w-full items-center justify-center gap-2 disabled:opacity-60">
 {loading ? <Spinner className="text-white" /> : null}
 {loading ? "Connexion…" : "Se connecter"}
 </button>
 </form>
 </div>
 );
}
