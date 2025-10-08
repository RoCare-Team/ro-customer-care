// lib/db.js
import mysql from "mysql2/promise";

let pool;

export async function getDBConnection() {
  if (!pool) {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,  // maximum simultaneous connections
        queueLimit: 0,        // unlimited waiting queries
    });
  }
  return pool;
}
