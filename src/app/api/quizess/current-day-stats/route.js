import { NextResponse } from 'next/server';
import { getQuizStatsForPeriod } from '../../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  const stats = await getQuizStatsForPeriod(userId, 'day');
  return NextResponse.json(stats);
} 