import { NextResponse } from 'next/server';

// In-memory store for IP play status (for demonstration only)
const playedIPs = new Set();

export async function GET(req) {
  // For demo, return empty or played status
  return NextResponse.json([{ played: false }], { status: 200 });
}

export async function POST(req) {
  try {
    // In real app, save IP play status to DB
    // Here, just add a dummy IP to the set
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    playedIPs.add(ip);

    return NextResponse.json({ message: 'IP play status saved' }, { status: 200 });
  } catch (error) {
    console.error('Error saving IP play status:', error);
    return NextResponse.json({ error: 'Failed to save IP play status' }, { status: 400 });
  }
}
