const { neon, neonConfig } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");


const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

module.exports = { db, sql };
