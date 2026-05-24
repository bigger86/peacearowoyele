import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProjects } from '../../hooks/useProjects'
import './Dashboard.css'

function Dashboard() {
  const { user, signOut } = useAuth()
  const { projects, loading } = useProjects()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const publishedCount = projects.filter(p => p.status === 'published').length
  const draftCount = projects.filter(p => p.status === 'draft').length

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Dashboard</h1>
            <p className="admin-subtitle">Welcome back, {user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="btn-signout">
            Sign Out
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Projects</h3>
              <p className="stat-number">{loading ? '...' : projects.length}</p>
            </div>
          </div>
          
          <div className="stat-card stat-card-success">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Published</h3>
              <p className="stat-number">{loading ? '...' : publishedCount}</p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Drafts</h3>
              <p className="stat-number">{loading ? '...' : draftCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-actions">
          <Link to="/admin/projects/new" className="btn-primary">
            <span className="btn-icon">+</span>
            Add New Project
          </Link>
          <Link to="/admin/projects" className="btn-secondary">
            <span className="btn-icon">📁</span>
            Manage Projects
          </Link>
          <Link to="/" className="btn-secondary">
            <span className="btn-icon">🌐</span>
            View Website
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="recent-projects">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/admin/projects" className="link-view-all">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No projects yet</h3>
              <p>Get started by adding your first project</p>
              <Link to="/admin/projects/new" className="btn-primary">
                Add Project
              </Link>
            </div>
          ) : (
            <div className="projects-list">
              {projects.slice(0, 5).map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-thumbnail">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} />
                    ) : (
                      <div className="thumbnail-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p className="project-meta">
                      <span className={`status-badge status-${project.status}`}>
                        {project.status}
                      </span>
                      <span className="project-slug">/{project.slug}</span>
                    </p>
                  </div>
                  <Link 
                    to={`/admin/projects/${project.id}/edit`} 
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
