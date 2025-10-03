import { NextResponse } from 'next/server';
import db from '../../../../../lib/db'; // Make sure db is a configured MySQL connection

// Convert db.query to return a Promise for async/await
const queryDb = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID in request' }, { status: 400 });
  }

  const sql = `
    SELECT 
      qa.quizId, 
      qa.choose_option, 
      qa.created_at, 
      q.question, 
      q.options, 
      q.correctAnswer, 
      q.explanation 
    FROM quiz_analytics qa
    JOIN quizzes q ON qa.quizId = q._id
    WHERE qa.userId = ?
    ORDER BY qa.created_at DESC
  `;

  try {
    const results = await queryDb(sql, [id]);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    // console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz analytics' }, { status: 500 });
  }
}
