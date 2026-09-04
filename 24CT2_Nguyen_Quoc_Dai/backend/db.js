const sql = require("mssql/msnodesqlv8");

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "DigitalSkillMarketplace",
  driver: "ODBC Driver 18 for SQL Server",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("Kết nối SQL Server thành công!");
    return pool;
  } catch (error) {
    console.log("Kết nối SQL Server thất bại!");
    console.log(error.message);
    throw error;
  }
}

module.exports = { sql, connectDB };
