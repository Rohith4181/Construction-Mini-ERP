import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [logs, setLogs] = useState([]); 
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@construction.com', role: 'Project Manager', status: 'Active' },
  ]);

  useEffect(() => {
    if (activeTab === 'logs') {
      const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
          // Calls the real backend API
          const res = await api.get('/v1/admin/logs'); 
          setLogs(res.data);
        } catch (error) {
          console.error("Error fetching logs", error);
        } finally {
          setLoadingLogs(false);
        }
      };
      fetchLogs();
    }
  }, [activeTab]);

  return (
    <Layout>
      <h2 className="page-title">System Administration</h2>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📜 Audit Logs
        </button>
      </div>

      {activeTab === 'users' && (
        <Card title="System Users & Roles">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td><span className="status-dot active"></span>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card title="System Audit Logs">
          {loadingLogs ? <p>Loading logs...</p> : (
            <ul className="audit-list">
              {logs.length === 0 ? (
                <p style={{ padding: '1rem', color: '#666' }}>No audit logs found.</p>
              ) : (
                logs.map((log) => (
                  <li key={log.id} className="audit-item">
                    <div className="log-icon">ℹ️</div>
                    <div className="log-details">
                      <span className="log-action">{log.action}</span>
                      <span className="log-user">
                        {log.details} <span style={{fontSize:'0.8em', color:'#999'}}>(User ID: {log.user_id})</span>
                      </span>
                    </div>
                    <span className="log-time">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </Card>
      )}
    </Layout>
  );
};

// 👇 THIS IS THE MISSING LINE THAT CAUSED THE ERROR
export default Admin;