import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Adjust the import path as necessary

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const sqlCurrentDay = `
    SELECT 
      DATE(created_at) AS period, 
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count, 
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS total_count,
      (SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS correct_percentage
    FROM quiz_analytics
    WHERE userId = ?
    AND DATE(created_at) = CURDATE()
    GROUP BY DATE(created_at)
  `;

  const sqlCurrentWeek = `
    SELECT 
      YEARWEEK(created_at, 1) AS period, 
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count, 
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS total_count,
      (SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS correct_percentage
    FROM quiz_analytics
    WHERE userId = ?
    AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
    GROUP BY YEARWEEK(created_at, 1)
  `;

  const sqlCurrentMonth = `
    SELECT 
      DATE_FORMAT(created_at, "%Y-%m") AS period, 
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count, 
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS total_count,
      (SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS correct_percentage
    FROM quiz_analytics
    WHERE userId = ?
    AND YEAR(created_at) = ?
    AND MONTH(created_at) = ?
    GROUP BY DATE_FORMAT(created_at, "%Y-%m")
  `;

  const sqlCurrentYear = `
    SELECT 
      YEAR(created_at) AS period, 
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct_count, 
      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS total_count,
      (SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS correct_percentage
    FROM quiz_analytics
    WHERE userId = ?
    AND YEAR(created_at) = ?
    GROUP BY YEAR(created_at)
  `;

  try {
    const [dayResult] = await db.query(sqlCurrentDay, [userId]);
    const [weekResult] = await db.query(sqlCurrentWeek, [userId]);
    const [monthResult] = await db.query(sqlCurrentMonth, [userId, currentYear, currentMonth]);
    const [yearResult] = await db.query(sqlCurrentYear, [userId, currentYear]);

    const response = {
      currentDay: dayResult,
      currentWeek: weekResult,
      currentMonth: monthResult,
      currentYear: yearResult
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Quiz analysis error:', err);
    return NextResponse.json({ error: 'Error fetching quiz analysis' }, { status: 500 });
  }
}
