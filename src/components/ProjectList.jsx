import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';
import Spinner from './Spinner';

// A custom hook for debouncing input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [filters, setFilters] = useState({
    category: '',
    faculty: '',
    year: '',
  });
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: 9,
          search: debouncedSearchTerm,
          status: 'approved',
        });

        // Add filters to the query parameters if they are selected
        if (filters.category) params.append('category', filters.category);
        if (filters.faculty) params.append('faculty', filters.faculty);
        if (filters.year) params.append('year', filters.year);

        const response = await axios.get(`${API_URL}/api/projects?${params.toString()}`);
        // Ensure that we always set an array to the state
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, debouncedSearchTerm, filters, API_URL]);

  // Reset to page 1 whenever a new search is performed
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filters]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="gallery-header">
        <h2>Approved Projects</h2>
        <div className="filters-container">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Art & Design">Art & Design</option>
            <option value="Other">Other</option>
          </select>
          <select name="faculty" value={filters.faculty} onChange={handleFilterChange}>
            <option value="">All Faculties</option>
            {/* These would ideally come from an API or a config file */}
            <option value="Science and Technology">Science and Technology</option>
            <option value="Business and Management">Business and Management</option>
            <option value="Health Sciences">Health Sciences</option>
          </select>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            {/* Generate last 5 years */}
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <p>No approved projects found.</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default ProjectList;
