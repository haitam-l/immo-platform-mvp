import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toggleFavorite } from '@/lib/services';

export async function POST(_: Request, { params }: { params: { listingId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  const { listingId } = params;
  return NextResponse.json(await toggleFavorite(session.id, listingId));
}
