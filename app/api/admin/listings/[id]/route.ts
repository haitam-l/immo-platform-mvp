import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { moderateListing } from '@/lib/services';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  try {
    const body = await request.json();
    const { id } = params;
    return NextResponse.json(await moderateListing(session, id, body.status));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur modération' }, { status: 400 });
  }
}
