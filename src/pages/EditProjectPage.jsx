import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    technologies: '',
    githubLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const project = res.data.data;

        // Handle case where project is not found
        if (!project) {
          toast.error('Project not found.');
          navigate('/');
          return;
        }

        // Security check: ensure the logged-in user is the owner
        if (!user || user._id !== project.user?._id) {
          toast.error('Not authorized to edit this project.');
          navigate('/');
          return;
        }

        // Prevent editing if not pending
        if (!['pending', 'approved'].includes(project.status)) {
          toast.error(`Cannot edit a project with status: '${project.status}'.`);
          navigate(`/projects/${id}`);
          return;
        }

        setFormData({
          title: project.title,
          description: project.description,
          category: project.category,
          technologies: (project.technologies || []).join(', '),
          githubLink: project.githubLink || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project data.');
        setLoading(false);
      }
    };

    if (user) { // Only fetch if user is loaded
        fetchProject();
    }
  }, [id, user, API_URL]);

  const { title, description, category, technologies, githubLink } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to update a project.');
        return;
      }

      const techArray = technologies.split(',').map(tech => tech.trim());
      const updatedData = { title, description, category, technologies: techArray, githubLink };

      // Include token to update the project
      await axios.put(`${API_URL}/api/projects/${id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Project updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="login-container"> {/* Reusing styles */}
      <h2>Edit Project</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" name="title" value={title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={category} onChange={onChange}>
            <option value="Technology">Technology</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Art & Design">Art & Design</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" name="technologies" value={technologies} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>GitHub Link (optional)</label>
          <input type="url" name="githubLink" value={githubLink} onChange={onChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProjectPage;
