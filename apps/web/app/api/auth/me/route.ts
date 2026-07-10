import { NextRequest, NextResponse } from 'next/server';

const AUTH_API_URL = process.env.AUTH_API_URL ?? 'https://auth.benfluxgroup.com';

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? '';
  try {
    const res = await fetch(`${AUTH_API_URL}/auth/me`, {
      headers: { cookie },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json(null, { status: 401 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
