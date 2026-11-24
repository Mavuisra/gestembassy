import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout() {
 const location = useLocation();
 const [pageLoading, setPageLoading] = useState(false);

 useEffect(() => {
 setPageLoading(true);
 window.scrollTo(0, 0);
 const t = window.setTimeout(() => setPageLoading(false), 450);
 return () => window.clearTimeout(t);
 }, [location.pathname, location.search]);

 return (
 <div className="flex min-h-screen flex-col bg-white">
 <Header />
 <main id="main-content" className="relative flex-1" tabIndex={-1}>
 {pageLoading ? (
 <div className="page-loader" role="status" aria-label="Chargement">
 <span className="page-spinner" />
 </div>
 ) : null}
 <div className={pageLoading ? "pointer-events-none opacity-40" : ""}>
 <Outlet />
 </div>
 </main>
 <Footer />
 </div>
 );
}
