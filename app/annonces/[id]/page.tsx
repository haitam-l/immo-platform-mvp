import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const listing = await prisma.listing.findUnique({ where: { id }, include: { photos: true, owner: true } });
  if (!listing) notFound();
  const mainPhoto = listing.photos[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&auto=format&fit=crop';
  return (
    <article className="detail">
      <div>
        <div className="gallery"><img src={mainPhoto} alt={listing.title} /></div>
        {listing.photos.length > 1 && (
          <div className="grid">
            {listing.photos.slice(1).map((p) => <img key={p.id} src={p.url} alt={listing.title} style={{ width: '100%', height: 230, objectFit: 'cover', borderRadius: 22 }} />)}
          </div>
        )}
        <section className="panel" style={{ marginTop: 24 }}>
          <span className={listing.transactionType === 'LOCATION' ? 'badge green' : 'badge'}>{listing.transactionType === 'LOCATION' ? 'Location' : 'Vente'}</span>
          <h1 style={{ fontSize: 'clamp(34px,5vw,54px)' }}>{listing.title}</h1>
          <p className="lead">{listing.city}{listing.district ? ` · ${listing.district}` : ''}</p>
          <div className="features">
            <span className="feature">{listing.surface} m²</span>
            <span className="feature">{listing.rooms || 0} pièces</span>
            <span className="feature">{listing.bedrooms || 0} chambres</span>
            <span className="feature">{listing.bathrooms || 0} salles de bain</span>
          </div>
          <h2>Description</h2>
          <p style={{ lineHeight: 1.8, color: '#374151' }}>{listing.description}</p>
        </section>
      </div>
      <aside className="side-panel">
        <div className="price">{Number(listing.price).toLocaleString('fr-FR')} €{listing.transactionType === 'LOCATION' ? ' / mois' : ''}</div>
        <p className="lead" style={{ fontSize: 16 }}>Contact annonceur :<br /><strong>{listing.owner.email}</strong>{listing.owner.phone ? <><br />{listing.owner.phone}</> : null}</p>
        <form className="form" action="/api/messages" method="post" style={{ boxShadow: 'none', padding: 0, border: 0 }}>
          <input type="hidden" name="receiverId" value={listing.ownerId} />
          <input type="hidden" name="listingId" value={listing.id} />
          <input name="subject" defaultValue={`Demande pour ${listing.title}`} />
          <textarea name="body" rows={5} placeholder="Votre message" required />
          <button>Envoyer un message</button>
        </form>
        <form action={`/api/favorites/${listing.id}`} method="post" style={{ marginTop: 12 }}>
          <button className="button secondary" style={{ width: '100%' }}>Ajouter / retirer des favoris</button>
        </form>
      </aside>
    </article>
  );
}
