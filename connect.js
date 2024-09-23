import mysql from "mysql2";
import fs from "fs";
import "dotenv/config";

export const db = mysql.createConnection({
  // host: "localhost",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // user: "root",
  user: process.env.DB_USER,
  // password: "mypass",
  password: process.env.DB_PASSWORD,
  // database: "microblog",
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(process.env.CA_PATH),
  },
});
