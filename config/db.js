const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to ensure the database exists
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    const query = `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``;
    await connection.query(query);
    console.log(`Database "${process.env.DB_NAME}" is ready.`);
    connection.release();
  } catch (error) {
    console.error("Error initializing the database:", error);
    throw error;
  }
};

module.exports = { pool, initializeDatabase };
