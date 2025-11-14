import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import RejectionModal from './RejectionModal';
import AuthContext from '../context/AuthContext';

const PendingProjectsList = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchPendingProjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        // Include token to fetch pending projects
        const res = await axios.get(`${API_URL}/api/projects?status=pending`, { headers: { Authorization: `Bearer ${token}` } });
        // Ensure that we always set an array to the state
        setPendingProjects(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending projects.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPendingProjects();
  }, [user]);

  const handleUpdateStatus = async (projectId, status, comment = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to perform this action.');
        return;
      }

      // This was the bug. It should check for 'approve'.
      const action = status === 'approve' ? 'approve' : 'reject';
      
      // Prepare the data payload. Only send a comment when rejecting.
      const requestData = action === 'reject' ? { comment } : {};

      // Include token to update project status
      await axios.put(`${API_URL}/api/projects/${projectId}/${action}`, requestData, { headers: { Authorization: `Bearer ${token}` } });

      // To update the UI instantly, we remove the processed project from the list.
      setPendingProjects(pendingProjects.filter((p) => p._id !== projectId));
    } catch (err) {
      // Provide more specific feedback from the API if available
      const errorMessage = err.response?.data?.message || 'Failed to update project status. Please try again.';
      setError(errorMessage);
      console.error('Failed to update project status:', err.response || err);
    }
  };

  const openRejectionModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleRejectSubmit = (comment) => {
    handleUpdateStatus(selectedProjectId, 'reject', comment);
    setIsModalOpen(false);
    setSelectedProjectId(null);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="pending-projects-container">
      {isModalOpen && (
        <RejectionModal onSubmit={handleRejectSubmit} onClose={() => setIsModalOpen(false)} />
      )}
      <h3>Projects Awaiting Review</h3>
      {pendingProjects.length === 0 ? (
        <p>There are no projects currently awaiting review.</p>
      ) : (
        pendingProjects.map((project) => (
          <div key={project._id} className="project-card">
            <h4>
              <Link to={`/projects/${project._id}`}>{project.title}</Link>
            </h4>
            <p>
              {(project.description || '').substring(0, 150)}...
            </p>
            <Link to={`/projects/${project._id}`} className="btn btn-secondary">View Details</Link>
            <div className="action-buttons">
              <button
                onClick={() => handleUpdateStatus(project._id, 'approve')}
                className="btn btn-approve"
              >
                Approve
              </button>
              <button
                onClick={() => openRejectionModal(project._id)}
                className="btn btn-reject"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingProjectsList;
