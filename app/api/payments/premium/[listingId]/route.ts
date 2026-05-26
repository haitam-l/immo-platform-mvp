import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createPremiumCheckoutSession } from '@/lib/services';

export async function POST(_: Request, { params }: { params: { listingId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  try {
    const { listingId } = params;
    const checkout = await createPremiumCheckoutSession(session.id, listingId);
    return NextResponse.json({ url: checkout.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur paiement' }, { status: 400 });
  }
}
