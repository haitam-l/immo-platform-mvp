import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  (await cookies()).delete('immo_token');
  return NextResponse.redirect(new URL('/', request.url), 303);
}
