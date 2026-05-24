import { useState } from 'react'
import { useGallery } from '../hooks/useGallery'
import './GalleryPublic.css'

function GalleryPublic() {
  const { images, loading, error } = useGallery()
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (image) => {
    setSelectedImage(image)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'unset'
    // Wait for animation to finish before clearing selected image
    setTimeout(() => setSelectedImage(null), 300)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div className="gallery-public">
      <div className="gallery-public-container">
        <h1 className="gallery-heading">Gallery</h1>
        
        {loading && (
          <div className="gallery-loading">Loading images...</div>
        )}

        {error && (
          <div className="gallery-error">Error loading images: {error}</div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="gallery-empty">
            <p>No images in gallery yet</p>
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="gallery-public-grid">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="gallery-public-item"
                onClick={() => openModal(image)}
              >
                <img src={image.image_url} alt={image.title} />
                {image.title && (
                  <div className="gallery-public-title">{image.title}</div>
                )}
              </div>
            ))}
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
  )
}

export default GalleryPublic
