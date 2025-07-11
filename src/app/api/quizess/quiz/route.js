// app/api/quiz/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const sql = `SELECT * FROM quizzes`;

  try {
    // Directly await the query since db is a promise-based client
    const [results] = await db.query(sql);

    const quizzes = results.map((quiz) => ({
      _id: quiz._id,
      question: quiz.question,
      options: typeof quiz.options === 'string' ? JSON.parse(quiz.options) : quiz.options,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
    }));

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Error in fetching quizzes' }, { status: 400 });
  }
}
