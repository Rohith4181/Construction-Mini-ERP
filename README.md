# 🏗️ Construction Mini ERP & Finance System

A full-stack Enterprise Resource Planning (ERP) prototype designed for the construction industry. This system manages project lifecycles, handles complex financial transactions (Invoices & General Ledger), and uses logic-based AI to provide risk insights and cash flow forecasting.

**Status:** Completed Prototype
**Role:** Full Stack Developer Assignment

---

## 🚀 Key Features Implemented

### 1. Core ERP Module
* **Role-Based Access:** Secure Authentication (Login/Register) using **JWT & Bcrypt**.
* **Interactive Dashboard:** Real-time KPI cards and visual charts (Bar & Doughnut) using **Chart.js**.
* **Admin Audit System:** Tracks user actions to a database log for security and compliance.

### 2. Finance Module (Advanced Logic)
* **Invoicing System:** Manage Accounts Payable (AP) and Accounts Receivable (AR).
* **Automated General Ledger:** Implemented double-entry accounting logic. When an invoice is created, the system uses **SQL Transactions** to automatically post Debit/Credit entries to the Journal and Ledger tables, ensuring data integrity.
* **Financial Reporting:** Real-time view of invoices and transaction statuses.

### 3. AI Insights (Backend Logic)
* **Predictive Risk Score:** Algorithm that compares 'Actual Spent' vs 'Project Budget'. If spending velocity is too high (>80% of budget), it flags the project as **High Risk**.
* **Cash Flow Forecast:** Uses a moving average algorithm on historical data (last 3 months) to predict the next month's cash flow trend.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Axios, Chart.js, CSS Modules.
* **Backend:** Node.js, Express.js (REST API), MVC Architecture.
* **Database:** MySQL (Relational Schema with Foreign Keys).
* **Security:** JSON Web Tokens (JWT), Password Hashing, CORS.

---

## 📂 Project Structure

```text
/mini-erp-project
├── /client           # React Frontend
│   ├── /src
│   │   ├── /components  # Reusable UI (Navbar, Cards, Layout)
│   │   ├── /pages       # Dashboard, Finance, Login, Admin
│   │   └── /services    # Axios Configuration
│
├── /server           # Node.js Backend
│   ├── /config       # Database Connection (MySQL)
│   ├── /controllers  # Business Logic (Finance, AI, Auth)
│   ├── /routes       # API Endpoints
│   └── index.js      # Server Entry Point

⚙️ Setup & Installation
Follow these steps to run the application locally.

Step 1: Database Setup
Open MySQL Workbench.

Create a database named construction_erp.

Run the provided SQL script to generate the required tables (users, projects, invoices, journal_entries, audit_logs, etc.).

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
JWT_SECRET=secret_key
PORT=5000
Start the server:

Bash

node index.js
(You should see "Connected to MySQL Database Successfully")

Step 3: Frontend Setup
Open a new terminal and navigate to the client folder:

Bash

cd client
Install dependencies:

Bash

npm install
Start the React app:

Bash

npm run dev
Open your browser at http://localhost:5173.

🧪 Testing the Logic (Demo Flow)
To verify the complex requirements, follow this flow:

Test AI Forecast:

Go to Finance. If you see a "Prediction Card" at the top, the AI is successfully calculating the moving average of past data.

Test Auto-Ledger (Backend Requirement):

Create a new Invoice (Type: AR).

Check the MySQL journal_entries table. You will see an automatic entry linking the invoice to the General Ledger.

Test Risk Analysis:

The Dashboard charts update dynamically based on the project budget data vs actuals.

👤 Rohith
Developed as a Full Stack assessment to demonstrate proficiency in React, Node.js, and SQL Database design.
