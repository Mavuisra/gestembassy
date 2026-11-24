import { Link } from "react-router-dom";

type Crumb = { label: string; to?: string };

type Props = {
 eyebrow?: string;
 title: string;
 subtitle?: string;
 crumbs?: Crumb[];
};

/** Bandeau intérieur style Mission (navy, typo Inter). */
export function PageHero({ eyebrow, title, subtitle, crumbs }: Props) {
 return (
 <section className="border-b border-line bg-navy text-white">
 <div className="container-page py-10 md:py-14">
 {crumbs && crumbs.length > 0 ? (
 <nav aria-label="Fil d'Ariane" className="mb-4 flex flex-wrap gap-2 text-xs text-white/55">
 {crumbs.map((c, i) => (
 <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
 {i > 0 ? <span aria-hidden>/</span> : null}
 {c.to ? (
 <Link to={c.to} className="hover:text-white">
 {c.label}
 </Link>
 ) : (
 <span className="text-white/90">{c.label}</span>
 )}
 </span>
 ))}
 </nav>
 ) : null}
 {eyebrow ? (
 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
 {eyebrow}
 </p>
 ) : null}
 <h1 className="max-w-3xl text-2xl font-extrabold text-white md:text-4xl">{title}</h1>
 {subtitle ? (
 <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
 {subtitle}
 </p>
 ) : null}
 </div>
 </section>
 );
}
