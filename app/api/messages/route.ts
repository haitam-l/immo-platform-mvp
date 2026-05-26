import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendMessage } from '@/lib/services';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  try {
    const form = await request.formData();
    await sendMessage(session.id, Object.fromEntries(form));
    return NextResponse.redirect(new URL('/dashboard?message=sent', request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur message' }, { status: 400 });
  }
}
