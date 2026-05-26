import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/services';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const { token } = await registerUser(Object.fromEntries(form));
    await setSessionCookie(token);
    return NextResponse.redirect(new URL('/dashboard', request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur inscription' }, { status: 400 });
  }
}
