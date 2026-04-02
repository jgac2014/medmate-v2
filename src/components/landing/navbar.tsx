"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/branding";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Funcionalidades", href: "/funcionalidades" },
  { label: "Planos", href: "/planos" },
  { label: "Segurança", href: "/seguranca" },
  { label: "FAQ", href: "/faq" },
];

export function LandingNavbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-lowest/90 backdrop-blur-md border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary text-sm font-bold">
            M
          </span>
          <span className="font-headline text-xl font-semibold text-primary">
            {BRAND.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                pathname === link.href
                  ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/consulta"
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-sm transition-all shadow-sm"
            >
              Ir para o consultório
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-primary hover:bg-surface-container-low font-medium text-sm rounded transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95"
              >
                Começar teste grátis
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-on-surface transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-on-surface transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-on-surface transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-lowest border-t border-outline-variant/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-[15px] ${
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-outline-variant/10 space-y-2">
            {isLoggedIn ? (
              <Link
                href="/consulta"
                className="block text-center px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm"
              >
                Ir para o consultório
              </Link>
            ) : (
              <>
                <Link href="/login" className="block text-center py-2 text-on-surface-variant text-sm">
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm"
                >
                  Começar teste grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
