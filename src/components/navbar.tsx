// src/components/navbar.tsx
"use client";

import { useState } from "react";
import { Button, Link } from "@heroui/react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { ActionButton } from "./global/ActionButton";
import { LogOut, UserIcon } from "lucide-react";
import { PerfilModal } from "@/modules/Users/components/PerfilModal";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const [isPerfilOpen, setIsPerfilOpen] = useState(false);

  // Filtrar elementos del menú según el rol
  const filteredNavItems = siteConfig.navItems.filter((item) => {
    if (item.label === "Usuarios") {
      return user?.rol === "Jefe";
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <a className="flex items-center gap-1" href="/">
            <p className="text-xl font-black tracking-tighter transition-colors">
              <span className="text-[#1565AE]">CIS</span> 
              <span className="text-slate-700 dark:text-slate-300 ml-1">RX</span>
            </p>
          </a>
          <ul className="hidden lg:flex gap-4 ml-2">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <a
                  className={clsx(
                    "text-foreground hover:text-accent transition-colors",
                    "data-[active=true]:text-accent data-[active=true]:font-medium",
                  )}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>


        

        <div className="hidden sm:flex items-center gap-2">
          {isAuthenticated && user && (
          <div className="flex items-center gap-2 mr-2">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={() => setIsPerfilOpen(true)}
              aria-label="Mi perfil"
            >
              <UserIcon size={16} />
            </Button>
            <span className="text-sm hidden md:inline">
              {user.username || `Usuario #${user.id}`}
            </span>
            <span className="text-xs text-muted hidden md:inline ml-1">
              ({user.rol})
            </span>
          </div>
        )}
          <ThemeSwitch />
          <div className="hidden md:flex">
            <ActionButton size="sm" variant="primary" onPress={handleLogout} icon={<LogOut size={18} />}>
              Salir
            </ActionButton>
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <ThemeSwitch />
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-separator sm:hidden">
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {/* Información del usuario */}
            {isAuthenticated && user && (
              <li className="py-2 border-b border-separator">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.username || `Usuario #${user.id}`}
                  </span>
                  <span className="text-xs text-muted">({user.rol})</span>
                </div>
              </li>
            )}
      
            {/* 👇 NUEVO: Botón "Mi Perfil" para móvil */}
            {isAuthenticated && user && (
              <li>
                <button
                  onClick={() => {
                    setIsPerfilOpen(true);
                    setIsMenuOpen(false); // Cierra el menú al abrir el modal
                  }}
                  className="flex items-center gap-2 w-full py-2 text-foreground text-lg"
                >
                  <UserIcon size={18} />
                  Mi Perfil
                </button>
              </li>
            )}
      
            {/* Enlaces del menú */}
            {filteredNavItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  className={clsx(
                    "block py-2 text-lg no-underline",
                    index === 2
                      ? "text-accent"
                      : index === filteredNavItems.length - 1
                      ? "text-danger"
                      : "text-foreground",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
      
            {/* Botón de logout */}
            <li className="mt-2 pt-2 border-t border-separator">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2 text-danger text-lg"
              >
                <LogOut size={18} />
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}

      <PerfilModal isOpen={isPerfilOpen} onOpenChange={setIsPerfilOpen} />

    </nav>
  );
};