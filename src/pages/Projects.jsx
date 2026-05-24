import { useState } from 'react';
import { useGallery } from '../hooks/useGallery';
import './Projects.css';

function Projects() {
  const { images, loading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedImage(null), 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="projects">
      <div className="projects-container">
        <h1 className="projects-heading">Projects</h1>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#666' }}>
            Loading projects...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#e74c3c' }}>
            Error loading projects: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="projects-grid">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="project-card"
                onClick={() => openModal(image)}
              >
                <img src={image.image_url} alt={image.title} className="project-image" />
                <div className="project-overlay">
                  <div className="project-title">{image.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#666' }}>
            No projects found.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className={`lightbox-modal ${isModalOpen ? 'open' : ''}`}
          onClick={handleBackdropClick}
        >
          <button 
            className="lightbox-close" 
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
          <div className="lightbox-content">
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.title}
              className="lightbox-image"
            />
            {selectedImage.title && (
              <div className="lightbox-title">{selectedImage.title}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
