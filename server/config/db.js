const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log("🔍 Debug: Trying to connect to DB at:", process.env.DB_HOST);

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // <--- CRITICAL: Must use the variable!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // <--- CRITICAL: Required for Aiven Cloud
    }
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