'use client';

import dynamic from 'next/dynamic';

const ListingsMap = dynamic(() => import('@/components/ListingsMap'), {
  ssr: false,
  loading: () => <section className="map-shell"><div className="map-header"><strong>Chargement de la carte…</strong></div></section>,
});

export default function ListingsMapClient({ listings }: { listings: any[] }) {
  return <ListingsMap listings={listings} />;
}
