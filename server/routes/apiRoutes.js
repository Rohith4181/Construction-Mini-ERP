const express = require('express');
const router = express.Router(); // <--- This was likely missing!
const authMiddleware = require('../middleware/authMiddleware');

// Import Controllers
const financeController = require('../controllers/financeController');
const insightController = require('../controllers/insightController');
const adminController = require('../controllers/adminController');

// We also need a Project Controller logic, usually defined here or imported
// For simplicity, I will assume you might have basic project routes here. 
// If you have a separate projectController, import it above.
const db = require('../config/db'); 

// ==========================================
// 1. PROJECT ROUTES
// ==========================================
router.get('/projects', authMiddleware, async (req, res) => {
    try {
        const [projects] = await db.execute('SELECT * FROM projects');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/projects', authMiddleware, async (req, res) => {
    const { name, budget, description, end_date } = req.body;
    try {
        await db.execute(
            'INSERT INTO projects (name, budget, description, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [name, budget, description, end_date, 'Active']
        );
        res.status(201).json({ message: 'Project Created' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating project' });
    }
});

// ==========================================
// 2. FINANCE ROUTES
// ==========================================
// Basic Invoice Routes
router.get('/invoices', authMiddleware, financeController.getInvoices);
router.post('/invoices', authMiddleware, financeController.createInvoice);

// NEW: Advanced Finance (Forecast & Journal)
router.get('/finance/forecast', authMiddleware, financeController.getCashFlowForecast);
router.post('/finance/journal', authMiddleware, financeController.createJournalEntry);

// ==========================================
// 3. AI INSIGHTS ROUTES
// ==========================================
router.get('/insights/:id', authMiddleware, insightController.calculateRisk);

// ==========================================
// 4. ADMIN ROUTES
// ==========================================
router.get('/admin/logs', authMiddleware, adminController.getAuditLogs);

module.exports = router;