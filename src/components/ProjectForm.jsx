import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology', // Default category
    technologies: '',
    githubLink: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  const { title, description, category, technologies, githubLink } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit a project.');
        return;
      }

      // Create a FormData object to handle file upload
      const submissionData = new FormData();
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('category', category);
      submissionData.append('technologies', technologies); // Send as string, backend can split
      submissionData.append('githubLink', githubLink);
      if (file) {
        submissionData.append('projectDocument', file);
      }

      // Include the token for authentication
      // When sending FormData, axios sets the 'Content-Type' to 'multipart/form-data' automatically
      await axios.post(`${API_URL}/api/projects`, submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Project submitted successfully for review!');
      // Clear the form
      setFormData({
        title: '',
        description: '',
        category: 'Technology',
        technologies: '',
        githubLink: '',
      });
      setFile(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Project submission failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container"> {/* Reusing styles */}
      <h3>Submit a New Project</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
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
          <input
            type="text"
            name="technologies"
            value={technologies}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Project Document (PDF only)</label>
          <input type="file" name="projectDocument" accept=".pdf" onChange={onFileChange} />
        </div>
        <div className="form-group">
          <label>GitHub Link (optional)</label>
          <input
            type="url"
            name="githubLink"
            value={githubLink}
            onChange={onChange}
          />
        </div>
        <button type="submit">Submit Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
