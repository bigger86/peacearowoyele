import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          slug,
          description,
          client_name,
          project_type,
          year,
          featured,
          thumbnail_url,
          created_at
        `)
        .eq('status', 'published')
        .order('display_order', { ascending: true })

      if (error) throw error
      
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error, refetch: fetchProjects }
}
