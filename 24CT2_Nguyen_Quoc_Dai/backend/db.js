require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

async function connectDB() {
  try {
    await pool.query("SELECT 1");

    console.log(
      "Kết nối Supabase PostgreSQL thành công!"
    );

    return pool;
  } catch (error) {
    console.log(
      "Kết nối Supabase PostgreSQL thất bại!"
    );

    console.log(error.message);

    throw error;
  }
}

module.exports = {
  pool,
  connectDB,
};