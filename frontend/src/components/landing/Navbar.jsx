"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Aperture, Menu, X, ArrowRight, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRoleDashboardPath } from "@/lib/utils/roleRouting";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Initialize theme state from DOM class
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("momentgrid_theme", "light");
        setTheme("light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("momentgrid_theme", "dark");
        setTheme("dark");
      }
    }
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Reviews", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-surface-0/85 backdrop-blur-md border-b border-borderColor shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#121111] via-[#1D262B] to-[#234F60] flex items-center justify-center shadow-md border border-brand-primary/40 group-hover:shadow-glow transition-all duration-300">
            <Aperture className="w-5 h-5 text-brand-primary group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-textPalette-primary transition-colors duration-300">
            Moment<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary font-extrabold">Grid</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-textPalette-secondary hover:text-brand-primary transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-surface-2 border border-borderColor text-textPalette-primary hover:border-brand-primary/50 hover:text-brand-primary transition-all duration-300 shadow-sm flex items-center justify-center focus:outline-none"
            aria-label="Toggle Dark / Light Mode"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-brand-primary transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-textPalette-primary hover:text-brand-primary transition-colors" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getRoleDashboardPath(user.role)}>
                <Button variant="gold" className="font-semibold gap-1.5 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Go to {user.role === 'photographer' ? 'Artist Portal' : user.role === 'client' ? 'VIP Portal' : 'Studio Portal'}
                </Button>
              </Link>
              <Button variant="ghost" onClick={logout} className="font-semibold text-textPalette-secondary hover:text-red-500">
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-semibold text-textPalette-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gold" className="font-semibold gap-1.5 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Start Free Trial
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Theme Toggle & Hamburger */}
        <div className="flex items-center gap-2.5 sm:hidden">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-surface-2 border border-borderColor text-textPalette-primary hover:text-brand-primary transition-all duration-300 focus:outline-none"
            aria-label="Toggle Dark / Light Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-brand-primary" />
            ) : (
              <Moon className="w-5 h-5 text-textPalette-primary" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-surface-2 border border-borderColor text-textPalette-primary hover:bg-surface-3 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-brand-primary" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bg-surface-0 border-b border-borderColor shadow-xl animate-fade-in p-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-textPalette-primary hover:text-brand-primary px-3 py-2 rounded-lg hover:bg-surface-1 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-borderColor flex flex-col gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href={getRoleDashboardPath(user.role)} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gold" className="w-full justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Go to {user.role === 'photographer' ? 'Artist Portal' : user.role === 'client' ? 'VIP Portal' : 'Studio Portal'}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center text-red-500 border-red-500/30">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gold" className="w-full justify-center gap-2">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
