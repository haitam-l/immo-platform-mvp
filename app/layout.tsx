import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ImmoConnect',
  description: 'Plateforme immobilière achat, vente et location',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="header">
          <a className="logo" href="/">ImmoConnect</a>
          <nav>
            <a href="/">Rechercher</a>
            <a href="/#carte">Carte</a>
            <a className="nav-cta" href="/publier">Publier</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Connexion</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
