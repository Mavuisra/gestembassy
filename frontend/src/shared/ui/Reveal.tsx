import type { ElementType, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type Props = {
 children: ReactNode;
 className?: string;
 delay?: 1 | 2 | 3 | 4 | 5 | 6;
 as?: "div" | "section" | "article" | "li";
};

export function Reveal({ children, className = "", delay, as = "div" }: Props) {
 const ref = useReveal<HTMLElement>();
 const delayClass = delay ? `reveal-delay-${delay}` : "";
 const classes = `reveal ${delayClass} ${className}`.trim();
 const Tag = as as ElementType;

 return (
 <Tag ref={ref} className={classes}>
 {children}
 </Tag>
 );
}
