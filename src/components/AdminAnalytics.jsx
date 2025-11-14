import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authorized to view stats.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/projects/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  const statusChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Project Statuses',
        data: [
          stats?.approvedProjects || 0,
          stats?.pendingProjects || 0,
          stats?.rejectedProjects || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const categoryChartData = {
    labels: stats?.categoryStats?.map(c => c._id) || [],
    datasets: [
      {
        label: 'Projects by Category',
        data: stats?.categoryStats?.map(c => c.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="analytics-container">
      <h3>Project Statistics</h3>
      {stats ? (
        <>
          <div className="stats-grid">
            <div className="stat-card"><h4>{stats.totalProjects}</h4><p>Total Projects</p></div>
            <div className="stat-card"><h4>{stats.approvedProjects}</h4><p>Approved</p></div>
            <div className="stat-card"><h4>{stats.pendingProjects}</h4><p>Pending</p></div>
            <div className="stat-card"><h4>{stats.rejectedProjects}</h4><p>Rejected</p></div>
          </div>
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Project Status Distribution</h4>
              <Bar options={chartOptions} data={statusChartData} />
            </div>
            <div className="chart-container" style={{ maxWidth: '400px', margin: 'auto' }}>
              <h4>Projects by Category</h4>
              <Doughnut options={chartOptions} data={categoryChartData} />
            </div>
          </div>
        </>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default AdminAnalytics;