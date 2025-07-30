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