import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Custom hook to fetch reviews from the backend
 * @param {number} limit - Maximum number of reviews to fetch
 * @param {boolean} autoFetch - Whether to automatically fetch on mount
 * @returns {object} { reviews, loading, error, refetch }
 */
export const useReviews = (limit = null, autoFetch = true) => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = limit ? `/api/reviews/${limit}` : '/api/reviews';
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
      setReviews(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
    }
  }, [limit, autoFetch]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  };
};

export default useReviews;
