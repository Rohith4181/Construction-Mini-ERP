// server/controllers/adminController.js
const db = require('../config/db');

// @desc Get Audit Logs
// @route GET /api/v1/admin/logs
exports.getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.execute(`
            SELECT a.*, u.username 
            FROM audit_logs a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to insert log (Use this in other controllers)
exports.logAction = async (userId, action, details) => {
    await db.execute(
        'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
        [userId, action, details]
    );
};