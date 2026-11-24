import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { Reveal } from "./Reveal";

type Crumb = { label: string; to?: string };

type Props = {
 eyebrow?: string;
 title: string;
 subtitle?: string;
 crumbs?: Crumb[];
 children: ReactNode;
 narrow?: boolean;
};

/** Enveloppe commune à toutes les pages intérieures. */
export function PageShell({
 eyebrow,
 title,
 subtitle,
 crumbs,
 children,
 narrow = false,
}: Props) {
 return (
 <>
 <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} crumbs={crumbs} />
 <Reveal as="section" className="bg-white py-10 md:py-14">
 <div className={`container-page ${narrow ? "max-w-3xl" : ""}`}>{children}</div>
 </Reveal>
 </>
 );
}
