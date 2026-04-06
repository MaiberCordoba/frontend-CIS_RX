import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current no-underline"
          rel="noopener noreferrer"
          target=""
        >
          <span className="text-muted">Derechos reservador</span>
          <p className="text-accent">CIS RX</p>
        </a>
      </footer>
    </div>
  );
}
