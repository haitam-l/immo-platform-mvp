export default function PublishPage() {
  return (
    <section>
      <div className="hero" style={{ marginBottom: 24 }}>
        <span className="eyebrow">Nouvelle annonce</span>
        <h1>Publier un bien immobilier</h1>
        <p>Ajoutez les informations principales, les équipements, la localisation et vos photos. L’annonce sera envoyée en validation.</p>
      </div>
      <form className="form" action="/api/listings" method="post">
        <h2 style={{ marginTop: 0 }}>Informations du bien</h2>
        <div className="form-grid">
          <input name="title" placeholder="Titre de l'annonce" required />
          <select name="transactionType"><option value="VENTE">Vente</option><option value="LOCATION">Location</option></select>
          <select name="propertyType"><option value="APPARTEMENT">Appartement</option><option value="MAISON">Maison</option><option value="TERRAIN">Terrain</option><option value="BUREAU">Bureau</option><option value="LOCAL_COMMERCIAL">Local commercial</option><option value="VILLA">Villa</option><option value="STUDIO">Studio</option></select>
          <input name="price" type="number" placeholder="Prix" required />
          <textarea className="full" name="description" placeholder="Description détaillée" rows={6} required />
          <input name="charges" type="number" placeholder="Charges, optionnel" />
          <input name="deposit" type="number" placeholder="Caution, optionnel" />
          <input name="surface" type="number" placeholder="Surface en m²" required />
          <input name="rooms" type="number" placeholder="Nombre de pièces" />
          <input name="bedrooms" type="number" placeholder="Nombre de chambres" />
          <input name="bathrooms" type="number" placeholder="Salles de bain" />
          <input name="floor" type="number" placeholder="Étage" />
        </div>
        <h2>Équipements</h2>
        <div className="check-grid">
          <label className="check"><input type="checkbox" name="hasParking" value="true" /> Parking</label>
          <label className="check"><input type="checkbox" name="hasElevator" value="true" /> Ascenseur</label>
          <label className="check"><input type="checkbox" name="hasGarden" value="true" /> Jardin</label>
          <label className="check"><input type="checkbox" name="hasTerrace" value="true" /> Terrasse</label>
          <label className="check"><input type="checkbox" name="furnished" value="true" /> Meublé</label>
        </div>
        <h2>Localisation et photos</h2>
        <div className="form-grid">
          <input name="city" placeholder="Ville" required />
          <input name="district" placeholder="Quartier" />
          <input className="full" name="address" placeholder="Adresse" />
          <input name="latitude" placeholder="Latitude pour la carte" />
          <input name="longitude" placeholder="Longitude pour la carte" />
          <input className="full" name="photoUrls" placeholder="URL photo principale Cloudinary/S3" />
          <input name="photoUrls" placeholder="URL photo 2" />
          <input name="photoUrls" placeholder="URL photo 3" />
        </div>
        <p className="empty">Le service upload est prêt : POST /api/upload avec un champ fichier nommé <strong>photos</strong>. Tu peux brancher ensuite un composant drag & drop sur cette route.</p>
        <button>Envoyer pour validation</button>
      </form>
    </section>
  );
}
