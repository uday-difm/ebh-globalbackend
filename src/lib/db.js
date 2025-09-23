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

/**
 * Executes a SQL query using the connection pool.
 * @param {string} sql - The SQL query string.
 * @param {Array} [values] - An array of values to be escaped and inserted into the query.
 * @returns {Promise<any>} The query result.
 */
export async function query(sql, values) {
  try {
    const [rows] = await db.execute(sql, values);
    return rows;
  } catch (err) {
    console.error('SQL Query Error:', err);
    throw err;
  }
}

export default db;