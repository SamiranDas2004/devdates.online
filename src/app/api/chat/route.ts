// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Handle the post request for chat
  return NextResponse.json({ message: 'Chat endpoint' });
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}