import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './AddProject.css'

function AddProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    client_name: '',
    project_type: 'Brand Identity',
    year: new Date().getFullYear(),
    featured: false,
    status: 'published'
  })
  const [images, setImages] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `projects/${formData.slug || 'temp'}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Error uploading ${file.name}: ${error.message}`)
      }
    }

    setImages(prev => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    setLoading(true)

    try {
      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          ...formData,
          thumbnail_url: images[0],
          display_order: 0
        }])
        .select()
        .single()

      if (projectError) throw projectError

      // Insert project images
      const imageRecords = images.map((url, index) => ({
        project_id: project.id,
        image_url: url,
        display_order: index,
        is_thumbnail: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageRecords)

      if (imagesError) throw imagesError

      alert('Project created successfully!')
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-project-page">
      <div className="add-project-header">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Add New Project</h1>
      </div>

      <div className="add-project-container">
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-section">
            <h2>Project Details</h2>
            
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="e.g., Brand Identity for Tech Startup"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="e.g., brand-identity-tech-startup"
              />
              <small>Auto-generated from title, but you can edit it</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the project, challenges, and solutions..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Project Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client_name">Client Name</label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div className="form-group">
                <label htmlFor="project_type">Project Type</label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                >
                  <option value="Brand Identity">Brand Identity</option>
                  <option value="Logo Design">Logo Design</option>
                  <option value="Visual Strategy">Visual Strategy</option>
                  <option value="Brand Audit">Brand Audit</option>
                  <option value="Design System">Design System</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Featured Project</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Project Images *</h2>
            
            <div className="form-group">
              <label htmlFor="images">Upload Images</label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="file-input"
              />
              {uploading && <p className="upload-status">Uploading images...</p>}
              <small>First image will be used as thumbnail</small>
            </div>
            
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn-remove-image"
                      title="Remove image"
                    >
                      ×
                    </button>
                    {index === 0 && <span className="thumbnail-badge">Thumbnail</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || uploading || images.length === 0}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProject
