// File: /pages/api/quiz/fetchDaysAndTotalQuestion.js

import { NextResponse } from 'next/server';
import db from '../../../../../lib/db'; // Make sure this points to your actual DB utility

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const sql = `
    SELECT 
      DAY(created_at) AS day,
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count,
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count
    FROM quiz_analytics
    WHERE userId = ?
    AND YEAR(created_at) = ?
    AND MONTH(created_at) = ?
    GROUP BY DAY(created_at)
    ORDER BY DAY(created_at)
  `;

  const sqlTotal = `
    SELECT 
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correctQuestion,
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrongQuestion
    FROM quiz_analytics
    WHERE userId = ?
  `;

  try {
    const [dailyResults] = await db.query(sql, [id, currentYear, currentMonth]);
    const [totalResults] = await db.query(sqlTotal, [id]);

    const totalResult = [
      Number(totalResults[0]?.correctQuestion || 0),
      Number(totalResults[0]?.wrongQuestion || 0),
    ];

    return NextResponse.json({ dailyResults, totalResult }, { status: 200 });
  } catch (err) {
    console.error('Database query error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
