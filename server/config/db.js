// server/config/db.js
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

// explicitly point to the .env file in the server root folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("🔍 Debug: Trying to connect with User:", process.env.DB_USER);

// Create a connection pool using the credentials from .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check if connection works
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database Successfully');
        connection.release();
    }
});

// Export the promise-based pool
module.exports = pool.promise();