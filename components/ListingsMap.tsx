'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function ListingsMap({ listings }: { listings: any[] }) {
  const valid = listings.filter((l) => l.latitude && l.longitude);
  const center: [number, number] = valid[0] ? [Number(valid[0].latitude), Number(valid[0].longitude)] : [48.8566, 2.3522];

  return (
    <section id="carte" className="map-shell">
      <div className="map-header">
        <div>
          <strong>Carte interactive</strong>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{valid.length} bien(s) positionné(s)</p>
        </div>
        <span className="badge">OpenStreetMap</span>
      </div>
      <MapContainer className="map" center={center} zoom={valid.length ? 12 : 5} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {valid.map((l) => (
          <Marker key={l.id} position={[Number(l.latitude), Number(l.longitude)]}>
            <Popup>
              <strong>{l.title}</strong><br />
              {Number(l.price).toLocaleString('fr-FR')} €<br />
              <a href={`/annonces/${l.id}`}>Voir l’annonce</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}
