import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1).max(80).optional().or(z.literal('')),
  lastName: z.string().min(1).max(80).optional().or(z.literal('')),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  role: z.enum(['PARTICULIER', 'AGENCE']).default('PARTICULIER'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const listingSchema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(5000),
  transactionType: z.enum(['VENTE', 'LOCATION']),
  propertyType: z.enum(['APPARTEMENT', 'MAISON', 'TERRAIN', 'BUREAU', 'LOCAL_COMMERCIAL', 'VILLA', 'STUDIO']),
  price: z.coerce.number().int().positive(),
  charges: z.coerce.number().int().nonnegative().optional().nullable(),
  deposit: z.coerce.number().int().nonnegative().optional().nullable(),
  surface: z.coerce.number().int().positive(),
  rooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bathrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  floor: z.coerce.number().int().optional().nullable(),
  city: z.string().min(2).max(100),
  district: z.string().max(100).optional().nullable(),
  address: z.string().max(220).optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  hasElevator: z.coerce.boolean().default(false),
  hasParking: z.coerce.boolean().default(false),
  hasGarden: z.coerce.boolean().default(false),
  hasBalcony: z.coerce.boolean().default(false),
  hasTerrace: z.coerce.boolean().default(false),
  hasPool: z.coerce.boolean().default(false),
  furnished: z.coerce.boolean().default(false),
  photoUrls: z.array(z.string().url()).max(12).optional().default([]),
});

export const messageSchema = z.object({
  listingId: z.string().optional(),
  receiverId: z.string(),
  subject: z.string().max(140).optional(),
  body: z.string().min(2).max(3000),
});
