import { Link } from 'react-router-dom';
import './ProjectCard.css';

function ProjectCard({ title, imageUrl, slug }) {
  return (
    <Link to={`/projects/${slug}`} className="project-card">
      <img 
        src={imageUrl} 
        alt={title} 
        className="project-card-image"
      />
      <div className="project-card-overlay">
        <div className="project-card-title">{title}</div>
      </div>
    </Link>
  );
}

export default ProjectCard;
