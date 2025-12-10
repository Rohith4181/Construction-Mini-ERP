import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import './Dashboard.css';

// --- 1. IMPORT CHART LIBRARIES ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// --- 2. REGISTER CHART COMPONENTS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for KPIs
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBudget: 0,
    activeProjects: 0
  });

  // State for Chart Data
  const [budgetChartData, setBudgetChartData] = useState(null);
  const [statusChartData, setStatusChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/v1/projects'); // Fetch Projects
        const projectData = res.data;
        
        setProjects(projectData);

        // --- CALCULATE KPI STATS ---
        const totalBudget = projectData.reduce((sum, p) => sum + Number(p.budget), 0);
        const activeCount = projectData.filter(p => p.status === 'Active').length;
        const pendingCount = projectData.filter(p => p.status === 'Pending').length;
        const completedCount = projectData.filter(p => p.status === 'Completed').length;

        setStats({
          totalProjects: projectData.length,
          totalBudget: totalBudget,
          activeProjects: activeCount
        });

        // --- PREPARE BAR CHART DATA (Budgets) ---
        setBudgetChartData({
          labels: projectData.map(p => p.name), // Project Names
          datasets: [
            {
              label: 'Project Budget ($)',
              data: projectData.map(p => p.budget), // Budget Amounts
              backgroundColor: '#2563eb', // Blue Bars
            },
          ],
        });

        // --- PREPARE DOUGHNUT CHART DATA (Status) ---
        setStatusChartData({
          labels: ['Active', 'Pending', 'Completed'],
          datasets: [
            {
              label: '# of Projects',
              data: [activeCount, pendingCount, completedCount],
              backgroundColor: [
                '#10b981', // Green (Active)
                '#f59e0b', // Yellow (Pending)
                '#6b7280', // Grey (Completed)
              ],
              borderColor: ['#ffffff', '#ffffff', '#ffffff'],
              borderWidth: 2,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-screen">Loading Dashboard & Charts...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="page-title">Dashboard Overview</h2>

      {/* 1. KPI Cards Row */}
      <div className="dashboard-stats-grid">
        <Card title="Total Budget" className="stat-card">
          ${stats.totalBudget.toLocaleString()}
        </Card>
        <Card title="Total Projects" className="stat-card">
          {stats.totalProjects}
        </Card>
        <Card title="Active Projects" className="stat-card">
          {stats.activeProjects}
        </Card>
      </div>

      {/* 2. CHARTS SECTION (NEW) */}
      <div className="charts-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Budget Bar Chart */}
        {budgetChartData && (
          <Card title="💰 Budgets by Project">
            <div style={{ height: '300px' }}>
              <Bar 
                data={budgetChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }} 
              />
            </div>
          </Card>
        )}

        {/* Status Doughnut Chart */}
        {statusChartData && (
          <Card title="📊 Project Status Distribution">
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Doughnut 
                data={statusChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </Card>
        )}
      </div>

      <h3 className="section-title">Recent Projects</h3>

      {/* 3. Projects List */}
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects found. Use the Admin or SQL to add data.</p>
        ) : (
          projects.map((project) => (
            <Card key={project.id} title={project.name}>
              <div className="project-details">
                <span className={`status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
                <p>{project.description}</p>
                <div className="project-meta">
                  <strong>Budget:</strong> ${Number(project.budget).toLocaleString()}
                </div>
                <div className="project-meta">
                  <strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;