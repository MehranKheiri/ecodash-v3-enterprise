export interface ProjectData {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    energyKwh: number;
    co2Tons: number;
    waterM3: number;
    wasteTons: number;
    recyclingRate: number;
    efficiencyMetric: string;
    transparencyScore: number;
    imageUrl: string;
}

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
}

export interface AqiData {
    aqi: number;
    pm25: number;
    pm10: number;
}
