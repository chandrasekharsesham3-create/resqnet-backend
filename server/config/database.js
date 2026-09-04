const { Pool } = require("pg");

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
    : new Pool({
        host: "localhost",
        port: 5432,
        database: "resqnet",
        user: "postgres",
        password: process.env.POSTGRES_PASSWORD
    });

module.exports = pool;