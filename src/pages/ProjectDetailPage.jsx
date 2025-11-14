import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import CommentSection from './CommentSection';

const ProjectDetailPage = () => {
  const { id } = useParams(); // Get the project ID from the URL
  // It's good practice to use a base URL from environment variables for API calls
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {};
        // If a token exists, add it to the request headers
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await axios.get(`${API_URL}/api/projects/${id}`, config);
        setProject(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project details.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProject();
  }, [id, API_URL]); // Re-run the effect if the ID or API_URL changes

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  // Check if the current user is the owner of the project
  const isOwner = user?._id === project.user?._id;

  // Check if the current user is a supervisor and the project is pending
  const isSupervisorReviewing = user?.role === 'supervisor' && project.status === 'pending';

  const handleProjectStatusUpdate = async (status) => {
    if (!window.confirm(`Are you sure you want to ${status} this project?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to perform this action.');
        return;
      }

      // For rejection, we need to prompt for a comment. For now, we'll send a placeholder.
      // A better implementation would use a modal here, just like in PendingProjectsList.
      const requestData = status === 'reject' ? { comment: 'Rejected from detail page.' } : {};
      const res = await axios.put(`${API_URL}/api/projects/${id}/${status}`, requestData, { headers: { Authorization: `Bearer ${token}` } });
      setProject(res.data.data); // Update the project state with the returned data
      toast.success(`Project has been ${status}ed.`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status} project.`);
      console.error(err);
    }
  };

  return (
    <div className="project-detail-container">
      {isOwner && ['pending', 'approved'].includes(project.status) && (
        <div className="edit-project-link">
          <Link to={`/projects/${project._id}/edit`} className="btn">
            Edit Project
          </Link>
        </div>
      )}

      <h2>{project.title}</h2>
      <p className="project-author">
        By: {project.user?.name ?? 'Unknown Author'}
      </p>
      <hr />
      <div className="project-detail-content">
        <h4>Description</h4>
        <p>{project.description}</p>

        <h4>Status</h4>
        <p>{project.status}</p>

        {project.status === 'rejected' && project.rejectionComment && (
          <div className="rejection-reason">
            <h4>Rejection Reason</h4>
            <p style={{ color: 'red', fontStyle: 'italic' }}>
              {project.rejectionComment}
            </p>
          </div>
        )}

        <h4>Category</h4>
        <p>{project.category}</p>

        <h4>Technologies Used</h4>
        <ul>
          {(project.technologies || []).map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>

        {project.githubLink && (
          <>
            <h4>GitHub Repository</h4>
            <p>
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                {project.githubLink}
              </a>
            </p>
          </>
        )}
      </div>

      {isSupervisorReviewing && (
        <div className="supervisor-actions">
          <hr />
          <h4>Supervisor Actions</h4>
          <p>Review this project and choose an action.</p>
          <button className="btn btn-success" onClick={() => handleProjectStatusUpdate('approve')}>Approve</button>
          <button className="btn btn-danger" onClick={() => handleProjectStatusUpdate('reject')}>Reject</button>
        </div>
      )}

      {user && (
        <CommentSection projectId={id} />
      )}
    </div>
  );
};

export default ProjectDetailPage;
