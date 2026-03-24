export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CIS RX",
  description: "Sistema de Gestión inventarial y Cierres de Caja",
  navItems: [
    {
      label: "Cajas",
      href: "/",
    },
    {
      label: "Estudios",
      href: "/docs",
    },
    {
      label: "Inventario",
      href: "/pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Cajas",
      href: "/",
    },
    {
      label: "Estudios",
      href: "/dashboard",
    },
    {
      label: "Inventario",
      href: "/projects",
    },
    {
      label: "Cerrar sesion",
      href: "/projects",
    },
  ],
  links: {
  },
};
