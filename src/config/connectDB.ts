//const mysql = require('mysql2/promise');
import mysql from "mysql2/promise";

// const connection = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'lawra',
// });
const connection = mysql.createPool({
  host: "localhost",
  user: "99bigdaddy",
  password: "99bigdaddy",
  database: "99bigdaddy",
});

async function testConnection() {
  try {
    const [rows, fields] = await connection.query("SELECT 1 + 1 AS solution");
    console.log("Database connection successful. Test query result:", rows[0].solution); // Should log: 2
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

export default connection;
