import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadPhoto } from '@/lib/services';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  try {
    const form = await request.formData();
    const files = form.getAll('photos').filter((f): f is File => f instanceof File);
    const uploaded = await Promise.all(files.slice(0, 12).map(uploadPhoto));
    return NextResponse.json({ photos: uploaded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur upload' }, { status: 400 });
  }
}
