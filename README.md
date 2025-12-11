# 🏗️ Construction Mini ERP & Finance System

A full-stack Enterprise Resource Planning (ERP) prototype designed specifically for the construction industry. This system manages project lifecycles, handles financial transactions (Invoices & General Ledger), and uses logic-based AI to provide risk insights and cash flow forecasting.

## 🚀 Key Features

### 1. Core ERP Module
* **User Management:** Secure Authentication (Login/Register) using JWT.
* **Dashboard:** Real-time KPI cards and visual charts (Bar & Doughnut) for project status and budgets.
* **Admin Panel:** System-wide Audit Logs to track user actions.

### 2. Finance Module
* **Invoicing:** Create Accounts Payable (AP) and Accounts Receivable (AR) invoices.
* **Automated General Ledger:** Creating an 'AR' invoice automatically posts a Debit to *Accounts Receivable* and a Credit to *Income* in the General Ledger.
* **Financial Tables:** View transaction history and invoice statuses.

### 3. AI Insights (Logic-Based)
* **Predictive Risk Score:** Analyzes Project Budget vs. Actual Spent. If spending exceeds 80% of the budget prematurely, it flags the project as "High Risk".
* **Cash Flow Forecast:** Calculates a moving average of the last 3 months of income to predict next month's cash flow trend.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Axios, Chart.js, CSS Modules.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL (Relational Schema).
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt.

---

## 📂 Project Structure

```text
/mini-erp-project
├── /client           # React Frontend (Vite)
│   ├── /src
│   │   ├── /components  # Reusable UI (Navbar, Cards, Layout)
│   │   ├── /pages       # Dashboard, Finance, Login, Admin
│   │   └── /services    # API Connection (Axios)
│
├── /server           # Node.js Backend
│   ├── /config       # Database Connection
│   ├── /controllers  # Logic (Auth, Finance, AI, Admin)
│   ├── /routes       # API Endpoints
│   └── index.js      # Server Entry Point
│
└── README.md         # Documentation


⚙️ Setup & Installation Guide
Follow these steps to run the project locally.

Prerequisites
Node.js (v16 or higher)

MySQL Server (Workbench recommended)

Git

Step 1: Database Setup
Open MySQL Workbench.

Create a new database named construction_erp.

Run the SQL scripts provided in the assignment (creating tables for users, projects, invoices, accounts, journal_entries, etc.).

Optional: Insert dummy data to see charts immediately.

Step 2: Backend Setup
Navigate to the server folder:

Bash

cd server
Install dependencies:

Bash

npm install
Create a .env file in the /server folder with your credentials:

Code snippet

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_erp
JWT_SECRET=my_super_secret_key
PORT=5000
Start the server:

Bash

npm start
(You should see: "Connected to MySQL Database Successfully")

Step 3: Frontend Setup
Open a new terminal and navigate to the client folder:

Bash

cd client
Install dependencies (including Chart.js):

Bash

npm install
Start the React app:

Bash

npm run dev
Open your browser to http://localhost:5173.

📡 API Documentation
Authentication
POST /api/auth/register - Create a new user.

POST /api/auth/login - Authenticate and receive JWT.

Projects & Dashboard
GET /api/v1/projects - Fetch all projects and status.

GET /api/v1/insights/:id - Get AI Risk Score for a specific project.

Finance
GET /api/v1/invoices - List all invoices.

POST /api/v1/invoices - Create invoice (Triggers Auto-Ledger Entry).

GET /api/v1/finance/forecast - Get AI Cash Flow prediction.

Admin
GET /api/v1/admin/logs - Fetch system audit logs.

🧪 How to Test the Logic
Test AI Forecast:

Create 3 invoices with type 'AR' (Income) in the Finance tab.

The "AI Cash Flow Prediction" card will update with the average.

Test Auto-Ledger:

Create a new Invoice (Type: AR).

Check the MySQL journal_entries and transactions tables. You will see automatic debit/credit entries created for that invoice.

Test Charts:

Add projects with different budgets in the Database.

The Dashboard Bar Chart will visualize the budget comparison.