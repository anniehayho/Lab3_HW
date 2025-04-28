import { useState, useEffect, useCallback } from 'react';
import { fetchImages } from '../services/pixabayService';
import { analyzeImage } from '../services/imageAnalyzer';

export const useImagePagination = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadImages = useCallback(async (pageToLoad = 1, searchQuery = query) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchImages(pageToLoad, 20, searchQuery);
      
      // Process each image with AI
      const processedImages = await Promise.all(
        response.hits.map(async (image) => {
          const aiTags = await analyzeImage(image.webformatURL);
          return { ...image, aiTags };
        })
      );
      
      if (pageToLoad === 1) {
        setImages(processedImages);
      } else {
        setImages(prev => [...prev, ...processedImages]);
      }
      
      setHasMore(response.hits.length > 0);
      setPage(pageToLoad);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query, loading]);

  // Initial load
  useEffect(() => {
    loadImages(1, query);
  }, [query, loadImages]);

  // Load more images
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadImages(page + 1);
    }
  }, [hasMore, loading, page, loadImages]);

  // Refresh the list
  const refresh = useCallback(() => {
    setRefreshing(true);
    loadImages(1, query);
  }, [query, loadImages]);

  // Search with a new query
  const search = useCallback((newQuery) => {
    setQuery(newQuery);
    loadImages(1, newQuery);
  }, [loadImages]);

  // Filter images by AI tags
  const filterByAiTag = useCallback((tag) => {
    if (!tag) {
      refresh();
      return;
    }
    
    const filtered = images.filter(image => 
      image.aiTags && image.aiTags.some(aiTag => 
        aiTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
    
    setImages(filtered);
  }, [images, refresh]);

  return {
    images,
    loading,
    error,
    hasMore,
    refreshing,
    loadMore,
    refresh,
    search,
    filterByAiTag
  };
};