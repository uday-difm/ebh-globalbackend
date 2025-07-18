import mysql from "mysql2";

// This prevents multiple connection pools from being created during hot-reloading in development.
// It checks if a pool already exists in the global scope, and reuses it if it does.

const getPool = () => {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 15, // Increased limit slightly for safety
      queueLimit: 0
    }).promise();
  }
  return global.mysqlPool;
};

const db = getPool();

export default db;

// period: 'day' | 'month' | 'year'
export async function getQuizStatsForPeriod(userId, period) {
  let dateCondition = '';
  if (period === 'day') {
    dateCondition = 'AND DATE(created_at) = CURDATE()';
  } else if (period === 'month') {
    dateCondition = 'AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())';
  } else if (period === 'year') {
    dateCondition = 'AND YEAR(created_at) = YEAR(CURDATE())';
  }
  const sql = `SELECT 
    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct,
    SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS wrong,
    COUNT(*) AS total
    FROM quiz_analytics
    WHERE userId = ? ${dateCondition}`;
  const [rows] = await db.query(sql, [userId]);
  const correct = rows[0].correct || 0;
  const wrong = rows[0].wrong || 0;
  const total = rows[0].total || 0;
  const percent = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
  return { correct, wrong, total, percent };
}
