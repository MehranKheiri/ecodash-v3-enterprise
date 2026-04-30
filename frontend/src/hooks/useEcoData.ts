import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ProjectData, WeatherData, AqiData } from '../types';

export const useEcoData = (projectId: string | null) => {
    const [project, setProject] = useState<ProjectData | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aqi, setAqi] = useState<AqiData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Project Data from C# Backend
                const projRes = await axios.get<ProjectData>(`http://localhost:5058/api/projects/${projectId}`);
                const projData = projRes.data;
                setProject(projData);

                // 2. Fetch Live Environment Data based on Project coordinates
                const { latitude, longitude } = projData;
                
                const [weatherRes, aqiRes] = await Promise.all([
                    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`),
                    axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,us_aqi`)
                ]);

                setWeather({
                    temperature: weatherRes.data.current.temperature_2m,
                    weatherCode: weatherRes.data.current.weather_code,
                    humidity: weatherRes.data.current.relative_humidity_2m,
                    windSpeed: weatherRes.data.current.wind_speed_10m,
                });

                setAqi({
                    aqi: aqiRes.data.current.us_aqi,
                    pm25: aqiRes.data.current.pm2_5,
                    pm10: aqiRes.data.current.pm10,
                });

            } catch (err) {
                console.error(err);
                setError("Failed to load eco data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    return { project, weather, aqi, loading, error };
};
