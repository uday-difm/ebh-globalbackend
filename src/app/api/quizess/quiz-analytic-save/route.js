// app/api/quiz-analytics/route.js
import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, quizId, correct, choose_option, time_taken } = body;

    const sql = `
      INSERT INTO quiz_analytics (userId, quizId, correct, choose_option, time_taken)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [userId, quizId, correct, choose_option, time_taken];

    await db.query(sql, values);

    return NextResponse.json({ message: 'Quiz analytic added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving quiz analytic:', error);
    return NextResponse.json({ error: 'Failed to add quiz' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
