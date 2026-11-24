import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Mail, Menu, Phone, Search, UserRound, X } from "lucide-react";
import { apiAuthGet } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { EMBASSY } from "../content/embassy";
import { setLocale } from "../i18n";

const navItems = [
 { to: "/", key: "home" },
 { to: "/ambassade", key: "about" },
 { to: "/services", key: "services" },
 { to: "/visas", key: "visas" },
 { to: "/investir", key: "invest" },
 { to: "/tourisme", key: "tourism" },
 { to: "/bourses", key: "scholarships" },
 { to: "/actualites", key: "news" },
 { to: "/assistance", key: "assistance" },
 { to: "/contact", key: "contact" },
] as const;

export function Header() {
 const { t, i18n } = useTranslation();
 const { isAuthenticated, token } = useAuth();
 const [menuOpen, setMenuOpen] = useState(false);
 const [searchOpen, setSearchOpen] = useState(false);
 const [unread, setUnread] = useState(0);

 useEffect(() => {
 document.body.style.overflow = menuOpen ? "hidden" : "";
 return () => {
 document.body.style.overflow = "";
 };
 }, [menuOpen]);

 useEffect(() => {
 if (!isAuthenticated || !token) {
 setUnread(0);
 return;
 }
 apiAuthGet<{ unread_count: number }>("/account/notifications/unread-count/", token)
 .then((data) => setUnread(data.unread_count))
 .catch(() => setUnread(0));
 }, [isAuthenticated, token]);

 return (
 <header className="sticky top-0 z-50 border-b border-line bg-white">
 <a href="#main-content" className="sr-only">
 {t("a11y.skipToContent")}
 </a>

 <div className="border-b border-line">
 <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2.5">
 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-navy">
 <a href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`} className="topbar-link inline-flex items-center gap-2">
 <img
 src="/drapeau-rdc.svg"
 alt=""
 className="h-3.5 w-auto shrink-0 border border-line shadow-sm"
 width={21}
 height={14}
 />
 <Phone size={14} aria-hidden />
 {EMBASSY.phone}
 </a>
 <span className="hidden text-line sm:inline" aria-hidden>
 |
 </span>
 <a href={`mailto:${EMBASSY.email}`} className="topbar-link hidden items-center gap-1.5 sm:inline-flex">
 <Mail size={14} aria-hidden />
 {EMBASSY.email}
 </a>
 </div>
 <div className="flex items-center gap-1" role="group" aria-label="Language">
 {(["fr", "en", "ko"] as const).map((lng, idx) => (
 <span key={lng} className="inline-flex items-center">
 {idx > 0 ? <span className="mx-1.5 text-muted/40">|</span> : null}
 <button
 type="button"
 onClick={() => setLocale(lng)}
 className={`text-xs font-semibold uppercase tracking-wide ${
 i18n.language.startsWith(lng) ? "text-navy" : "text-muted hover:text-navy"
 }`}
 >
 {lng === "ko" ? "KR" : lng.toUpperCase()}
 </button>
 </span>
 ))}
 </div>
 </div>
 </div>

 <div className="container-page flex items-center justify-between gap-4 py-3 md:py-4">
 <Link to="/" className="flex min-w-0 items-center gap-3">
 <img src="/embleme-rdc.png" alt="" className="h-12 w-auto object-contain md:h-14" />
 <div className="min-w-0">
 <p className="truncate text-[13px] font-bold leading-snug text-navy md:text-[15px]">
 {t("brand.embassyLine1")}
 </p>
 <p className="truncate text-[12px] text-muted md:text-[13px]">{t("brand.embassyLine2")}</p>
 </div>
 </Link>

 <div className="flex shrink-0 items-center gap-2">
 {isAuthenticated ? (
 <Link
 to="/compte/notifications"
 className="header-tool-btn relative"
 aria-label={t("notifications.title")}
 >
 <Bell size={16} />
 <span className="hidden sm:inline">{t("notifications.title")}</span>
 {unread > 0 ? (
 <span className="absolute -right-1 -top-1 inline-flex min-w-[1.1rem] items-center justify-center bg-rdc-red px-1 text-[10px] font-bold text-white">
 {unread > 9 ? "9+" : unread}
 </span>
 ) : null}
 </Link>
 ) : null}
 <Link
 to={isAuthenticated ? "/compte" : "/compte/connexion"}
 className="header-tool-btn"
 aria-label={isAuthenticated ? t("nav.account") : t("nav.login")}
 >
 <UserRound size={16} />
 <span className="hidden sm:inline">{isAuthenticated ? t("nav.account") : t("nav.login")}</span>
 </Link>
 <button
 type="button"
 className="header-tool-btn"
 aria-label={t("a11y.search")}
 aria-expanded={searchOpen}
 onClick={() => setSearchOpen((v) => !v)}
 >
 <Search size={16} />
 <span className="hidden sm:inline">{t("a11y.search")}</span>
 </button>
 <button
 type="button"
 className="header-tool-btn px-2.5"
 aria-label={menuOpen ? "Close menu" : "Open menu"}
 aria-expanded={menuOpen}
 onClick={() => setMenuOpen(true)}
 >
 <Menu size={20} />
 </button>
 </div>
 </div>

 {searchOpen ? (
 <div className="border-t border-line bg-white">
 <div className="container-page py-3">
 <label className="sr-only" htmlFor="site-search">
 {t("a11y.search")}
 </label>
 <input
 id="site-search"
 type="search"
 placeholder={t("a11y.searchPlaceholder")}
 className="w-full border border-line px-4 py-2.5 text-sm outline-none focus:border-navy"
 />
 </div>
 </div>
 ) : null}

 {menuOpen ? (
 <div className="mission-menu" role="dialog" aria-modal="true" aria-label="Menu">
 <button
 type="button"
 className="absolute inset-0 cursor-default"
 aria-label="Close"
 onClick={() => setMenuOpen(false)}
 />
 <div className="mission-menu-panel">
 <div className="mb-4 flex items-center justify-between">
 <p className="text-sm font-bold uppercase tracking-wide text-navy">{t("brand.short")}</p>
 <button type="button" className="header-tool-btn px-2" onClick={() => setMenuOpen(false)}>
 <X size={18} />
 </button>
 </div>
 <nav>
 {navItems.map((item) => (
 <NavLink
 key={item.key}
 to={item.to}
 end={item.to === "/"}
 onClick={() => setMenuOpen(false)}
 >
 {t(`nav.${item.key}`)}
 </NavLink>
 ))}
 </nav>
 </div>
 </div>
 ) : null}
 </header>
 );
}
