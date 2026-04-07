import Link from "next/link";
import { BRAND } from "@/lib/branding";

const FOOTER_SECTIONS = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "/funcionalidades" },
      { label: "Planos", href: "/planos" },
      { label: "Segurança", href: "/seguranca" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de Ajuda", href: `mailto:${BRAND.contactEmail}` },
      { label: "FAQ", href: "/faq" },
      { label: "Contato", href: `mailto:${BRAND.contactEmail}` },
    ],
  },
  {
    title: "Jurídico",
    links: [
      { label: "Termos de Uso", href: "/termos-de-uso" },
      { label: "Privacidade", href: "/politica-de-privacidade" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-surface-low">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-primary rounded flex items-center justify-center text-on-primary text-xs font-bold">
                M
              </span>
              <span className="font-headline text-lg font-semibold text-primary">
                {BRAND.name}
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed max-w-[240px]">
              Excelência em documentação clínica para APS. Tecnologia pensada por médicos para médicos.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-on-surface-muted">
            &copy; {new Date().getFullYear()} {BRAND.name}. Em conformidade com a LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}
