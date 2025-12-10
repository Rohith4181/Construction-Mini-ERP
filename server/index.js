const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Test DB connection

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

// MOUNT ROUTES
// This is the CRITICAL part. Make sure it matches exactly:
app.use('/api/auth', authRoutes);
app.use('/api/v1', apiRoutes);  // <--- Must be /api/v1

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));