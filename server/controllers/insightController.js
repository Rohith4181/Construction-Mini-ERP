const db = require('../config/db');

exports.calculateRisk = async (req, res) => {
    const { id } = req.params; // Project ID

    try {
        // 1. Fetch Project Budget
        const [projectRows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
        if (projectRows.length === 0) return res.status(404).json({ message: "Project not found" });
        const project = projectRows[0];

        // 2. Fetch Actual Spent (Sum of AP Invoices)
        const [expenseRows] = await db.execute(
            "SELECT SUM(amount) as spent FROM invoices WHERE project_id = ? AND type = 'AP'", 
            [id]
        );
        const spent = parseFloat(expenseRows[0].spent) || 0;

        // 3. AI Logic: Risk Calculation
        let riskScore = 0;
        const budget = parseFloat(project.budget);
        
        // Rule 1: Budget Usage (If spent > 80% of budget, high risk)
        const percentUsed = (spent / budget) * 100;
        if (percentUsed > 100) riskScore += 50; // Over budget!
        else if (percentUsed > 80) riskScore += 30; // Near limit

        // Determine Level
        let riskLevel = "Low";
        if (riskScore >= 50) riskLevel = "Critical";
        else if (riskScore >= 30) riskLevel = "High";
        else if (riskScore > 10) riskLevel = "Medium";

        res.json({
            project_id: project.id,
            project_name: project.name,
            budget: budget,
            spent: spent,
            risk_score: riskScore,
            risk_level: riskLevel
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating risk' });
    }
};