import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// const connection = new Pool({
//   host: "localhost",
//   port: 4001,
//   user: "hugo",
//   password: "1234",
//   database: "postgres_boardcamp_db",
// });

export default connection;
