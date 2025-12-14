import { useState, useEffect } from 'react';
import { fetchTasks } from '../services/googleSheets';

export const useSheetData = (refreshInterval = 30000) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    // Set up auto-refresh
    const interval = setInterval(loadTasks, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const refetch = () => {
    loadTasks();
  };

  return {
    tasks,
    loading,
    error,
    lastUpdated,
    refetch,
  };
};
