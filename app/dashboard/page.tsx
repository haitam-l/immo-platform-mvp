import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return <div className="hero"><span className="eyebrow">Accès privé</span><h1>Connexion requise</h1><p>Connectez-vous pour gérer vos annonces, messages et favoris.</p><a className="button" href="/login">Se connecter</a></div>;
  const [listings, messages, favorites] = await Promise.all([
    prisma.listing.findMany({ where: { ownerId: session.id }, include: { photos: true }, orderBy: { createdAt: 'desc' } }),
    prisma.message.findMany({ where: { receiverId: session.id }, include: { sender: true }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.favorite.findMany({ where: { userId: session.id }, include: { listing: true }, orderBy: { id: 'desc' } }),
  ]);
  return (
    <section>
      <div className="hero">
        <span className="eyebrow">Bienvenue</span>
        <h1>Tableau de bord</h1>
        <p>Gérez vos annonces, vos conversations et les biens sauvegardés depuis un espace clair.</p>
        <div className="dashboard-grid">
          <div className="stat"><strong>{listings.length}</strong><span>annonce(s)</span></div>
          <div className="stat"><strong>{messages.length}</strong><span>message(s)</span></div>
          <div className="stat"><strong>{favorites.length}</strong><span>favori(s)</span></div>
        </div>
        <div className="actions" style={{ marginTop: 22 }}>
          <a className="button" href="/publier">Publier une annonce</a>
          <form action="/api/auth/logout" method="post"><button className="button secondary">Se déconnecter</button></form>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Mes annonces</h2>
        {listings.length === 0 ? <div className="empty">Vous n’avez pas encore publié d’annonce.</div> : listings.map(l => (
          <div className="list-row" key={l.id}>
            <div><strong><a href={`/annonces/${l.id}`}>{l.title}</a></strong><br /><span style={{ color: '#6b7280' }}>{l.status} · {Number(l.price).toLocaleString('fr-FR')} €</span></div>
            {l.isPremium ? <span className="badge">Premium</span> : <form action={`/api/payments/premium/${l.id}`} method="post"><button>Booster</button></form>}
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Messages reçus</h2>
        {messages.length === 0 ? <div className="empty">Aucun message pour le moment.</div> : messages.map(m => (
          <div className="list-row" key={m.id}>
            <div><strong>{m.subject || 'Message'}</strong><br /><span style={{ color: '#6b7280' }}>De {m.sender.email}</span><p>{m.body}</p></div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Favoris</h2>
        {favorites.length === 0 ? <div className="empty">Aucun favori sauvegardé.</div> : favorites.map(f => (
          <div className="list-row" key={f.id}><a href={`/annonces/${f.listingId}`}>{f.listing.title}</a></div>
        ))}
      </div>
    </section>
  );
}
