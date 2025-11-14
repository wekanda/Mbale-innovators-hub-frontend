import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  // This is a critical safeguard. If for any reason the project prop is null or undefined,
  // we return null to prevent the entire application from crashing.
  if (!project) {
    return null;
  }

  return (
    <div className="project-card">
      <h3>
        <Link to={`/projects/${project._id}`}>{project.title}</Link>
      </h3>
      <p>{project.description || 'No description available.'}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Technologies:</strong> {(project.technologies || []).join(', ')}</p>
      {project.githubLink && (
        <p>
          <strong>GitHub:</strong>{' '}
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
            {project.githubLink}
          </a>
        </p>
      )}
      {/* Add more project details here as needed */}
    </div>
  );
};

export default ProjectCard;
