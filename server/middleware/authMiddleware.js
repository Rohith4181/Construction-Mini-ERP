// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // 1. Get token from header
    const tokenHeader = req.header('Authorization');

    // 2. Check if no token provided
    if (!tokenHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 3. Clean the token (Remove "Bearer " prefix if sent by frontend)
        const token = tokenHeader.replace('Bearer ', '');

        // 4. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Add user info to request object so controllers can use it
        req.user = decoded;
        
        next(); // Move to the next step (the actual controller)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};