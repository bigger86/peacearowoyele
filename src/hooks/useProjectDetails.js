import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProjectDetails(slug) {
  const [project, setProject] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchProjectDetails()
    }
  }, [slug])

  async function fetchProjectDetails() {
    try {
      setLoading(true)
      setError(null)

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (projectError) throw projectError

      setProject(projectData)

      // Fetch project images
      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectData.id)
        .order('display_order', { ascending: true })

      if (imagesError) throw imagesError

      setImages(imagesData || [])
    } catch (error) {
      console.error('Error fetching project details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { project, images, loading, error, refetch: fetchProjectDetails }
}
