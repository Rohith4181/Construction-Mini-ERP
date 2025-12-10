// server/controllers/financeController.js
const db = require('../config/db');

// ... (Keep existing getInvoices and createInvoice logic above) ...

// ==========================================
// 1. RESTORED INVOICE LOGIC
// ==========================================

exports.getInvoices = async (req, res) => {
    try {
        const [invoices] = await db.execute(`
            SELECT i.*, p.name as project_name 
            FROM invoices i 
            LEFT JOIN projects p ON i.project_id = p.id 
            ORDER BY i.created_at DESC
        `);
        res.json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createInvoice = async (req, res) => {
    const { invoice_number, type, project_id, amount, due_date } = req.body;
    
    // Get connection for transaction
    const connection = await db.getConnection(); 

    try {
        await connection.beginTransaction();

        // 1. Create the Invoice
        const [invResult] = await connection.execute(
            'INSERT INTO invoices (invoice_number, type, project_id, amount, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [invoice_number, type, project_id, amount, due_date, 'Pending']
        );

        // 2. AUTOMATIC LEDGER ENTRY
        if (type === 'AR') {
             // Create Journal Header
            const [journal] = await connection.execute(
                'INSERT INTO journal_entries (date, description, reference_id) VALUES (NOW(), ?, ?)',
                [`Auto-generated for Invoice ${invoice_number}`, invResult.insertId]
            );
            
            // Debit 'Accounts Receivable' (ID 2)
            await connection.execute(
                'INSERT INTO transactions (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, 0)',
                [journal.insertId, 2, amount]
            );

            // Credit 'Construction Income' (ID 4)
            await connection.execute(
                'INSERT INTO transactions (journal_entry_id, account_id, debit, credit) VALUES (?, ?, 0, ?)',
                [journal.insertId, 4, amount]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Invoice & Ledger Entry Created Successfully' });

    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    } finally {
        connection.release();
    }
};

// ==========================================
// 2. FIXED AI FORECAST LOGIC
// ==========================================

// @desc    Get Cash Flow Forecast (AI Logic)
// @route   GET /api/v1/finance/forecast
exports.getCashFlowForecast = async (req, res) => {
    try {
        // --- THE FIX IS IN THIS QUERY ---
        // We changed 'ORDER BY created_at' to 'ORDER BY MAX(created_at)'
        // This satisfies the ONLY_FULL_GROUP_BY rule.
        const [history] = await db.execute(`
            SELECT MONTH(created_at) as month, SUM(amount) as total 
            FROM invoices 
            WHERE type = 'AR' 
            GROUP BY MONTH(created_at)
            ORDER BY MAX(created_at) DESC LIMIT 3
        `);

        if (history.length === 0) {
            return res.json({ 
                forecast_amount: 0, 
                trend: "Neutral", 
                logic: "Not enough data to predict" 
            });
        }

        const totalLast3Months = history.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
        const nextMonthForecast = totalLast3Months / history.length;

        let trend = "Stable";
        if (history.length > 1 && parseFloat(history[0].total) > parseFloat(history[1].total)) {
            trend = "Upward 📈";
        } else if (history.length > 1) {
            trend = "Downward 📉";
        }

        res.json({
            forecast_amount: nextMonthForecast.toFixed(2),
            trend: trend,
            logic: "Based on 3-month moving average of Invoices"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating forecast' });
    }
};

// @desc    Create Journal Entry (General Ledger)
// @route   POST /api/v1/finance/journal
exports.createJournalEntry = async (req, res) => {
    const { description, debits, credits, currency, exchange_rate } = req.body;
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [header] = await connection.execute(
            'INSERT INTO journal_entries (date, description) VALUES (NOW(), ?)',
            [description]
        );
        const journalId = header.insertId;
        const rate = parseFloat(exchange_rate) || 1.0;

        // Process Debits
        if(debits) {
            for (let item of debits) {
                await connection.execute(
                    'INSERT INTO transactions (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, 0)',
                    [journalId, item.account_id, item.amount * rate]
                );
            }
        }

        // Process Credits
        if(credits) {
            for (let item of credits) {
                await connection.execute(
                    'INSERT INTO transactions (journal_entry_id, account_id, debit, credit) VALUES (?, ?, 0, ?)',
                    [journalId, item.account_id, item.amount * rate]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Journal Entry Created' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Transaction Failed' });
    } finally {
        connection.release();
    }
};