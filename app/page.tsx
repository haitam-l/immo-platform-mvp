import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/ListingCard';
import ListingsMapClient from '@/components/ListingsMapClient';

export default async function Home({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const params = searchParams || {};
  const where: any = { status: 'ACTIVE' };
  if (params.city) where.city = { contains: params.city, mode: 'insensitive' };
  if (params.transactionType) where.transactionType = params.transactionType;
  if (params.propertyType) where.propertyType = params.propertyType;
  if (params.minPrice || params.maxPrice) where.price = {
    gte: params.minPrice ? Number(params.minPrice) : undefined,
    lte: params.maxPrice ? Number(params.maxPrice) : undefined,
  };

  const listings = await prisma.listing.findMany({
    where,
    include: { photos: true },
    orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
    take: 40,
  });

  return (
    <>
      <section className="hero">
        <span className="eyebrow">Immobilier simple, clair et moderne</span>
        <h1>Trouvez votre prochain logement en quelques clics.</h1>
        <p className="lead">Achetez, vendez ou louez un bien avec annonces vérifiées, photos, filtres avancés et carte interactive.</p>
        <form className="filters">
          <select name="transactionType" defaultValue={params.transactionType || ''}>
            <option value="">Achat ou location</option>
            <option value="VENTE">Vente</option>
            <option value="LOCATION">Location</option>
          </select>
          <input name="city" placeholder="Ville ou quartier" defaultValue={params.city || ''} />
          <select name="propertyType" defaultValue={params.propertyType || ''}>
            <option value="">Type de bien</option>
            <option value="APPARTEMENT">Appartement</option>
            <option value="MAISON">Maison</option>
            <option value="TERRAIN">Terrain</option>
            <option value="BUREAU">Bureau</option>
            <option value="LOCAL_COMMERCIAL">Local commercial</option>
            <option value="VILLA">Villa</option>
            <option value="STUDIO">Studio</option>
          </select>
          <input name="minPrice" inputMode="numeric" placeholder="Prix min" defaultValue={params.minPrice || ''} />
          <input name="maxPrice" inputMode="numeric" placeholder="Prix max" defaultValue={params.maxPrice || ''} />
          <button>Rechercher</button>
        </form>
        <div className="quick-stats">
          <div className="stat"><strong>{listings.length}</strong><span>annonces disponibles</span></div>
          <div className="stat"><strong>Carte</strong><span>recherche géolocalisée</span></div>
          <div className="stat"><strong>Premium</strong><span>mise en avant des biens</span></div>
        </div>
      </section>

      <ListingsMapClient listings={listings.map((l) => ({ id: l.id, title: l.title, price: l.price, latitude: l.latitude, longitude: l.longitude }))} />

      <section>
        <h2>Annonces récentes</h2>
        {listings.length === 0 ? <div className="empty">Aucune annonce ne correspond encore à cette recherche.</div> : (
          <div className="grid">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </section>
    </>
  );
}
