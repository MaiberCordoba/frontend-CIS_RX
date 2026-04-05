export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CIS RX",
  description: "Sistema de Gestión inventarial y Cierres de Caja",
  navItems: [
    {
      label: "Arqueo",
      href: "/arqueo",
    },
    {
      label: "Estudios",
      href: "/estudios",
    },
    {
      label: "Inventario",
      href: "/pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Arqueo",
      href: "/arqueo",
    },
    {
      label: "Estudios",
      href: "/estudios",
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
