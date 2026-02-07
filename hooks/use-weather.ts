'use client';

import { useEffect, useState, useCallback } from 'react';

export interface WeatherData {
  wind: {
    speed: number;
    deg: number;
    direction: string;
  };
  temp: number;
  humidity: number;
  visibility: number | null;
  airQuality: {
    aqi: number | null;
    pm2_5: number | null;
    pm10: number | null;
  } | null;
  description: string;
  location: string;
}

export function useWeather(lat: number | null, lon: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Weather API error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setWeather(null);
      
      // Set fallback weather data to prevent UI breakage
      setWeather({
        wind: { speed: 0, deg: 0, direction: 'N/A' },
        temp: 0,
        humidity: 0,
        visibility: null,
        airQuality: null,
        description: 'Weather data unavailable',
        location: 'Unknown',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      // Debounce the weather fetch to avoid too many API calls
      const timeoutId = setTimeout(() => {
        fetchWeather(lat, lon);
      }, 1000); // Wait 1 second after map stops moving

      return () => clearTimeout(timeoutId);
    }
  }, [lat, lon, fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}

