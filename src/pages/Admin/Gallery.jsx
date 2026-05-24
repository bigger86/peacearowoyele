import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useGallery } from '../../hooks/useGallery'
import './Gallery.css'

function Gallery() {
  const { signOut } = useAuth()
  const { images, loading, uploadImage, deleteImage } = useGallery()
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    for (const file of files) {
      const result = await uploadImage(file, title || file.name)
      if (!result.success) {
        alert(`Error uploading ${file.name}: ${result.error}`)
      }
    }

    setUploading(false)
    setTitle('')
    e.target.value = '' // Reset file input
  }

  const handleDelete = async (image) => {
    if (!confirm(`Delete "${image.title}"?`)) return

    const result = await deleteImage(image.id, image.image_url)
    if (!result.success) {
      alert(`Error deleting image: ${result.error}`)
    }
  }

  return (
    <div className="gallery-admin">
      <header className="gallery-header">
        <div className="gallery-header-content">
          <h1>Image Gallery Manager</h1>
          <div className="header-actions">
            <Link to="/" className="btn-view-site">View Website</Link>
            <button onClick={signOut} className="btn-signout">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="gallery-content">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>Upload New Image</h2>
          <div className="upload-form">
            <input
              type="text"
              placeholder="Image title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              disabled={uploading}
            />
            <label className="file-upload-btn">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              {uploading ? 'Uploading...' : 'Choose Images'}
            </label>
          </div>
          <p className="upload-hint">You can select multiple images at once</p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-section">
          <div className="section-header">
            <h2>Gallery Images ({images.length})</h2>
          </div>

          {loading ? (
            <div className="loading-state">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <h3>No images yet</h3>
              <p>Upload your first image to get started</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((image) => (
                <div key={image.id} className="gallery-item">
                  <div className="image-wrapper">
                    <img src={image.image_url} alt={image.title} />
                    <div className="image-overlay">
                      <button
                        onClick={() => handleDelete(image)}
                        className="btn-delete"
                        title="Delete image"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="image-info">
                    <h3>{image.title}</h3>
                    <p className="image-date">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery
