import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
 LayoutDashboard,
 FolderOpen,
 CalendarDays,
 AlertTriangle,
 Users,
 Newspaper,
 BarChart3,
 FileText,
 Settings,
 Menu,
 X,
 LogOut,
 Bell,
 ChevronDown,
 ChevronRight,
} from "lucide-react";
import { useStaffAuth } from "../auth/StaffAuthContext";

type NavLeaf = { to: string; label: string };
type NavItem =
 | { kind: "link"; to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }
 | { kind: "group"; id: string; label: string; icon: typeof FolderOpen; children: NavLeaf[] };

const navItems: NavItem[] = [
 { kind: "link", to: "/backoffice", label: "Tableau de bord", icon: LayoutDashboard, end: true },
 {
 kind: "group",
 id: "demandes",
 label: "Demandes",
 icon: FolderOpen,
 children: [
 { to: "/backoffice/demandes", label: "Toutes les demandes" },
 { to: "/backoffice/demandes?type=visa", label: "Visas" },
 { to: "/backoffice/demandes?type=passport", label: "Passeports" },
 { to: "/backoffice/demandes?type=civil", label: "État civil" },
 { to: "/backoffice/demandes?type=consular", label: "Consulaire" },
 ],
 },
 { kind: "link", to: "/backoffice/rendez-vous", label: "Rendez-vous", icon: CalendarDays },
 { kind: "link", to: "/backoffice/incidents", label: "Incidents", icon: AlertTriangle },
 { kind: "link", to: "/backoffice/usagers", label: "Utilisateurs", icon: Users },
 {
 kind: "group",
 id: "contenus",
 label: "Contenus",
 icon: Newspaper,
 children: [
 { to: "/backoffice/actualites", label: "Actualités" },
 { to: "/backoffice/faq", label: "FAQ" },
 ],
 },
 { kind: "link", to: "/backoffice/documents", label: "Documents", icon: FileText },
 { kind: "link", to: "/backoffice/stats", label: "Statistiques", icon: BarChart3 },
 {
 kind: "group",
 id: "parametres",
 label: "Paramètres",
 icon: Settings,
 children: [
 { to: "/backoffice/equipe", label: "Équipe" },
 { to: "/backoffice/audit", label: "Audit" },
 ],
 },
];

const crumbsMap: { match: RegExp; label: string }[] = [
 { match: /^\/backoffice\/?$/, label: "Tableau de bord" },
 { match: /^\/backoffice\/demandes/, label: "Demandes" },
 { match: /^\/backoffice\/rendez-vous/, label: "Rendez-vous" },
 { match: /^\/backoffice\/incidents/, label: "Incidents" },
 { match: /^\/backoffice\/usagers/, label: "Utilisateurs" },
 { match: /^\/backoffice\/actualites/, label: "Actualités" },
 { match: /^\/backoffice\/faq/, label: "FAQ" },
 { match: /^\/backoffice\/documents/, label: "Documents" },
 { match: /^\/backoffice\/stats/, label: "Statistiques" },
 { match: /^\/backoffice\/equipe/, label: "Équipe" },
 { match: /^\/backoffice\/audit/, label: "Audit" },
];

function crumbLabel(pathname: string): string {
 return crumbsMap.find((c) => c.match.test(pathname))?.label ?? "Back office";
}

function groupOpenByPath(pathname: string, id: string): boolean {
 if (id === "demandes") return pathname.includes("/demandes");
 if (id === "contenus") return pathname.includes("/actualites") || pathname.includes("/faq");
 if (id === "parametres") return pathname.includes("/equipe") || pathname.includes("/audit");
 return false;
}

export function BackofficeLayout() {
 const { isStaffAuthenticated, user, logout } = useStaffAuth();
 const location = useLocation();
 const [mobileOpen, setMobileOpen] = useState(false);
 const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
 const [pageLoading, setPageLoading] = useState(false);
 const crumb = useMemo(() => crumbLabel(location.pathname), [location.pathname]);

 useEffect(() => {
 setPageLoading(true);
 setMobileOpen(false);
 const t = window.setTimeout(() => setPageLoading(false), 450);
 return () => window.clearTimeout(t);
 }, [location.pathname, location.search]);

 if (!isStaffAuthenticated) {
 return <Navigate to="/backoffice/login" replace />;
 }

 function toggleGroup(id: string) {
 setOpenGroups((prev) => ({
 ...prev,
 [id]: !(prev[id] ?? groupOpenByPath(location.pathname, id)),
 }));
 }

 function isGroupOpen(id: string) {
 if (id in openGroups) return openGroups[id];
 return groupOpenByPath(location.pathname, id);
 }

 const nav = (
 <div className="flex h-full flex-col">
 <div className="mb-5 flex items-center gap-3 px-1">
 <img src="/embleme-rdc.png" alt="" className="h-10 w-auto object-contain" />
 <div className="min-w-0">
 <p className="truncate text-sm font-extrabold leading-tight text-white">Ambassade RDC</p>
 <p className="truncate text-[11px] text-blue-soft/70">République de Corée</p>
 </div>
 </div>

 <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
 {navItems.map((item) => {
 if (item.kind === "link") {
 const Icon = item.icon;
 return (
 <NavLink
 key={item.to}
 to={item.to}
 end={item.end}
 onClick={() => setMobileOpen(false)}
 className={({ isActive }) =>
 `bo-nav-item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold ${
 isActive ? "bo-nav-item-active" : ""
 }`
 }
 >
 <Icon size={17} strokeWidth={2.2} />
 {item.label}
 </NavLink>
 );
 }

 const Icon = item.icon;
 const open = isGroupOpen(item.id);
 const childActive = item.children.some((c) =>
 location.pathname.startsWith(c.to.split("?")[0]),
 );
 return (
 <div key={item.id}>
 <button
 type="button"
 onClick={() => toggleGroup(item.id)}
 className={`bo-nav-item flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold ${
 childActive ? "text-white" : ""
 }`}
 >
 <Icon size={17} strokeWidth={2.2} />
 <span className="flex-1">{item.label}</span>
 {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
 </button>
 {open ? (
 <div className="mb-1 ml-4 space-y-0.5 border-l border-white/15 pl-3">
 {item.children.map((child) => (
 <NavLink
 key={child.to}
 to={child.to}
 onClick={() => setMobileOpen(false)}
 className={() => {
 const pathOnly = child.to.split("?")[0];
 const active =
 location.pathname === pathOnly &&
 (child.to.includes("?")
 ? location.search === `?${child.to.split("?")[1]}`
 : !location.search || location.search === "");
 return `block px-2 py-1.5 text-[13px] font-medium ${
 active ? "text-white" : "text-blue-soft/70 hover:text-white"
 }`;
 }}
 >
 {child.label}
 </NavLink>
 ))}
 </div>
 ) : null}
 </div>
 );
 })}

 <button
 type="button"
 onClick={logout}
 className="bo-nav-item mt-3 flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gold"
 >
 <LogOut size={17} />
 Déconnexion
 </button>
 </nav>

 <div className="mt-4 border-t border-white/10 pt-4">
 <div className="flex items-center gap-2 px-1">
 <img src="/drapeau-rdc.svg" alt="" className="h-5 w-auto border border-white/20" />
 <p className="text-[11px] font-semibold leading-snug text-blue-soft/80">
 RDC · Unité · Travail · Progrès
 </p>
 </div>
 </div>
 </div>
 );

 return (
 <div className="bo-shell flex min-h-screen bg-[#eef3f9]">
 <aside className="bo-sidebar hidden w-[260px] shrink-0 flex-col p-4 text-white md:flex">{nav}</aside>

 {mobileOpen ? (
 <div className="fixed inset-0 z-50 flex md:hidden">
 <button
 type="button"
 className="absolute inset-0 bg-navy/50"
 aria-label="Fermer"
 onClick={() => setMobileOpen(false)}
 />
 <aside className="bo-sidebar relative z-10 flex h-full w-[280px] flex-col p-4 text-white shadow-2xl">
 <button
 type="button"
 className="mb-3 self-end text-white/80"
 onClick={() => setMobileOpen(false)}
 aria-label="Fermer"
 >
 <X size={20} />
 </button>
 {nav}
 </aside>
 </div>
 ) : null}

 <div className="flex min-w-0 flex-1 flex-col">
 <header className="bo-topbar flex items-center justify-between gap-4 px-4 py-3 text-white md:px-6">
 <div className="flex min-w-0 items-center gap-3">
 <button
 type="button"
 className="bo-icon-btn md:hidden"
 onClick={() => setMobileOpen(true)}
 aria-label="Menu"
 >
 <Menu size={18} />
 </button>
 <img src="/embleme-rdc.png" alt="" className="hidden h-9 w-auto object-contain sm:block" />
 <div className="min-w-0">
 <p className="truncate text-sm font-bold">Ambassade de la RDC Séoul</p>
 <p className="truncate text-[11px] text-blue-soft/80">
 Back office <span className="mx-1 opacity-60">·</span> {crumb}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <Link to="/backoffice/incidents" className="bo-icon-btn relative" aria-label="Alertes">
 <Bell size={18} />
 </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="bo-avatar flex h-9 w-9 items-center justify-center text-xs font-bold text-navy">
                {(user?.display_name || user?.email || "A").slice(0, 1).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{user?.display_name || user?.email}</p>
                <p className="text-[11px] uppercase tracking-wide text-blue-soft/80">{user?.role}</p>
              </div>
            </div>
 </div>
 </header>

 <main className="relative flex-1 p-4 md:p-6 lg:p-7">
 {pageLoading ? (
 <div className="bo-page-loader" role="status" aria-label="Chargement">
 <span className="bo-page-spinner" />
 </div>
 ) : null}
 <div className={pageLoading ? "pointer-events-none opacity-40" : ""}>
 <Outlet />
 </div>
 </main>
 </div>
 </div>
 );
}
