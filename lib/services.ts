import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { signSession, SessionUser } from './auth';
import { listingSchema, loginSchema, messageSchema, registerSchema } from './validators';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function registerUser(input: unknown) {
  const data = registerSchema.parse(input);
  const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (exists) throw new Error('Un compte existe déjà avec cet email.');
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      phone: data.phone || null,
      city: data.city || null,
      role: data.role,
    },
  });
  const session: SessionUser = { id: user.id, email: user.email, role: user.role };
  return { user: session, token: signSession(session) };
}

export async function loginUser(input: unknown) {
  const data = loginSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user) throw new Error('Identifiants incorrects.');
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new Error('Identifiants incorrects.');
  const session: SessionUser = { id: user.id, email: user.email, role: user.role };
  return { user: session, token: signSession(session) };
}

export async function createListing(ownerId: string, input: unknown) {
  const data = listingSchema.parse(input);
  const { photoUrls, ...listingData } = data;
  return prisma.listing.create({
    data: {
      ...listingData,
      ownerId,
      status: 'PENDING',
      photos: { create: photoUrls.map((url, position) => ({ url, position, isMain: position === 0 })) },
    },
    include: { photos: true, owner: true },
  });
}

export async function updateListing(ownerId: string, listingId: string, input: unknown) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.ownerId !== ownerId) throw new Error('Annonce introuvable ou accès refusé.');
  const data = listingSchema.partial().parse(input);
  return prisma.listing.update({ where: { id: listingId }, data: { ...data, status: 'PENDING' } });
}

export async function moderateListing(admin: SessionUser, listingId: string, status: 'ACTIVE' | 'REJECTED' | 'ARCHIVED') {
  if (admin.role !== 'ADMIN') throw new Error('Accès administrateur requis.');
  return prisma.listing.update({ where: { id: listingId }, data: { status } });
}

export async function toggleFavorite(userId: string, listingId: string) {
  const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorite: false };
  }
  await prisma.favorite.create({ data: { userId, listingId } });
  return { favorite: true };
}

export async function sendMessage(senderId: string, input: unknown) {
  const data = messageSchema.parse(input);
  if (senderId === data.receiverId) throw new Error('Impossible de vous envoyer un message à vous-même.');
  return prisma.message.create({ data: { ...data, senderId } });
}

export async function uploadPhoto(file: File) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('Cloudinary n’est pas configuré dans .env.');
  if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.');
  if (file.size > 6 * 1024 * 1024) throw new Error('Image trop lourde : maximum 6 Mo.');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'immoconnect', resource_type: 'image' }, (error, result) => {
      if (error || !result) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
  });
}

export async function createPremiumCheckoutSession(userId: string, listingId: string) {
  const Stripe = (await import('stripe')).default;
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_PREMIUM_LISTING) {
    throw new Error('Stripe n’est pas configuré dans .env.');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.ownerId !== userId) throw new Error('Annonce introuvable ou accès refusé.');
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_PREMIUM_LISTING, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?premium=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?premium=cancel`,
    metadata: { userId, listingId, type: 'premium_listing' },
  });
}
