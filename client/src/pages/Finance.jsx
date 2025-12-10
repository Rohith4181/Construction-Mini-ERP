// client/src/pages/Finance.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import './Finance.css';

const Finance = () => {
  const [invoices, setInvoices] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    invoice_number: '', amount: '', project_id: '', type: 'AP', due_date: ''
  });

  const fetchData = async () => {
    try {
      // 1. Fetch Invoices (Correct Path)
      const invRes = await api.get('/v1/invoices');
      setInvoices(invRes.data);

      // 2. Fetch AI Cash Flow Forecast (UPDATED PATH)
      try {
        // ADDED '/v1' HERE TO MATCH SERVER
        const forecastRes = await api.get('/v1/finance/forecast'); 
        setForecast(forecastRes.data);
      } catch (err) {
        console.warn("Forecast data not available yet");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching finance data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      // ADDED '/v1' HERE TO MATCH SERVER
      await api.post('/v1/invoices', formData);
      alert('Invoice Created!');
      setShowForm(false);
      fetchData(); 
      setFormData({ invoice_number: '', amount: '', project_id: '', type: 'AP', due_date: '' });
    } catch (err) {
      alert('Error creating invoice');
    }
  };

  return (
    <Layout>
      <div className="finance-header">
        <h2 className="page-title">Finance & AI Insights</h2>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Invoice'}
        </button>
      </div>

      {/* AI FORECAST CARD */}
      {forecast && (
        <div style={{ marginBottom: '2rem' }}>
          <Card title="🤖 AI Cash Flow Prediction">
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Predicted Next Month Income</p>
                <h2 style={{ color: '#2563eb', fontSize: '2rem', margin: '0.5rem 0' }}>
                  ${Number(forecast.forecast_amount).toLocaleString()}
                </h2>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Trend Analysis</p>
                <span style={{ 
                  backgroundColor: '#d1fae5', color: '#065f46', 
                  padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' 
                }}>
                  📈 {forecast.trend}
                </span>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#999' }}>
                  {forecast.logic}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Invoice Form */}
      {showForm && (
        <Card className="invoice-form-card">
          <h3>New Invoice</h3>
          <form className="invoice-form" onSubmit={handleCreateInvoice}>
            <input type="text" placeholder="Invoice # (e.g. INV-101)" required 
              value={formData.invoice_number} onChange={e => setFormData({...formData, invoice_number: e.target.value})} />
            <input type="number" placeholder="Amount ($)" required 
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            <input type="number" placeholder="Project ID" required 
              value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="AP">Accounts Payable (Expense)</option>
              <option value="AR">Accounts Receivable (Income)</option>
            </select>
            <input type="date" required 
              value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
            <button type="submit" className="save-btn">Save Invoice</button>
          </form>
        </Card>
      )}

      {/* Invoices List */}
      <Card title="Recent Invoices">
        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? <tr><td colSpan="5">No invoices found.</td></tr> : invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.invoice_number}</td>
                    <td><span className={`type-badge ${inv.type}`}>{inv.type}</span></td>
                    <td className="amount">${Number(inv.amount).toLocaleString()}</td>
                    <td>{inv.status}</td>
                    <td>{new Date(inv.due_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default Finance;