import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function uploadImage(file, title = '') {
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          title: title || file.name,
          image_url: publicUrl,
          display_order: images.length
        }])

      if (dbError) throw dbError

      // Refresh images
      await fetchImages()
      return { success: true }
    } catch (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: error.message }
    }
  }

  async function deleteImage(imageId, imageUrl) {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw dbError

      // Delete from storage (optional - extract path from URL)
      if (imageUrl.includes('supabase')) {
        const path = imageUrl.split('/storage/v1/object/public/portfolio-images/')[1]
        if (path) {
          await supabase.storage
            .from('portfolio-images')
            .remove([path])
        }
      }

      // Refresh images
      await fetchImages()
      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }
  }

  return { 
    images, 
    loading, 
    error, 
    uploadImage, 
    deleteImage,
    refetch: fetchImages 
  }
}
