import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createListing } from '@/lib/services';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const where: any = { status: 'ACTIVE' };
  if (searchParams.get('city')) where.city = { contains: searchParams.get('city')!, mode: 'insensitive' };
  if (searchParams.get('transactionType')) where.transactionType = searchParams.get('transactionType')!;
  if (searchParams.get('propertyType')) where.propertyType = searchParams.get('propertyType')!;
  if (searchParams.get('minPrice') || searchParams.get('maxPrice')) where.price = {
    gte: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    lte: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  };
  const listings = await prisma.listing.findMany({ where, include: { photos: true }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 });
  try {
    const form = await request.formData();
    const photoUrls = form.getAll('photoUrls').map(String).filter(Boolean);
    const listing = await createListing(session.id, { ...Object.fromEntries(form), photoUrls });
    return NextResponse.redirect(new URL(`/annonces/${listing.id}`, request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur annonce' }, { status: 400 });
  }
}
