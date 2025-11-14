import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from './Spinner'; // This path is already correct

const MyProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext); // Ensure user is available
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user) return;

      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }

        // This endpoint should return projects for the logged-in user
        // We must include the token in the headers for protected routes.
        const res = await axios.get(`${API_URL}/api/projects/my-projects`, { headers: { Authorization: `Bearer ${token}` } });
        // Ensure that we always set an array to the state
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to fetch your projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [user, API_URL]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="my-projects-list">
      <h3>My Submitted Projects</h3>
      {projects.length === 0 ? (
        <p>You have not submitted any projects yet.</p>
      ) : (
        <ul className="list-group">
          {projects.map((project) => (
            <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/projects/${project._id}`}>{project.title}</Link>
              <span className={`badge bg-${project.status === 'approved' ? 'success' : project.status === 'rejected' ? 'danger' : 'secondary'}`}>{project.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProjectsList;