export default function ListingCard({ listing }: { listing: any }) {
  const mainPhoto = listing.photos?.find((p: any) => p.isMain)?.url || listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop';
  const transaction = listing.transactionType === 'LOCATION' ? 'Location' : 'Vente';
  return (
    <a className="card" href={`/annonces/${listing.id}`}>
      <div className="card-img">
        <img src={mainPhoto} alt={listing.title} />
        <div className="card-price">{Number(listing.price).toLocaleString('fr-FR')} €{listing.transactionType === 'LOCATION' ? ' / mois' : ''}</div>
      </div>
      <div className="card-body">
        <span className={listing.transactionType === 'LOCATION' ? 'badge green' : 'badge'}>{transaction}</span>
        <h3>{listing.title}</h3>
        <p className="card-meta">{listing.city}{listing.district ? ` · ${listing.district}` : ''}</p>
        <div className="features">
          <span className="feature">{listing.surface} m²</span>
          <span className="feature">{listing.rooms || 0} pièces</span>
          <span className="feature">{listing.bedrooms || 0} chambres</span>
        </div>
      </div>
    </a>
  );
}
