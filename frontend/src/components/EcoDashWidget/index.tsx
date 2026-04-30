import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEcoData } from '../../hooks/useEcoData';
import { Leaf, Wind, Droplets, MapPin, X, Factory, Recycle, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EcoDashWidgetProps {
    projectId: string;
}

const getWeatherDesc = (code: number) => {
    if (code <= 3) return "Clear/Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    return "Overcast";
};

const getAqiInfo = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> };
    if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <AlertTriangle className="w-4 h-4 text-yellow-600" /> };
    return { text: 'Unhealthy', color: 'text-red-700', bg: 'bg-red-100', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> };
};

export const EcoDashWidget: React.FC<EcoDashWidgetProps> = ({ projectId }) => {
    const { project, weather, aqi, loading, error } = useEcoData(projectId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="p-4 bg-white rounded-full shadow animate-pulse w-64 h-12"></div>;
    if (error || !project || !weather || !aqi) return null;

    const aqiInfo = getAqiInfo(aqi.aqi);

    // Mock trend data for chart
    const labels = Array.from({length: 14}, (_, i) => `Day ${i+1}`);
    const chartData = {
        labels,
        datasets: [
            { label: 'PM2.5 Trend', data: Array.from({length: 14}, () => Math.floor(Math.random() * 20) + 20), borderColor: '#3b82f6', tension: 0.4 },
        ]
    };

    return (
        <>
            {/* The Floating / Embeddable Badge */}
            <div 
                className="group relative inline-block bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm hover:shadow-md hover:rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden z-40"
                onClick={() => setIsModalOpen(true)}
            >
                {/* Default State */}
                <div className="flex items-center gap-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {project.name}
                    </div>
                    <div className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                        {weather.temperature}°C <span className="text-gray-400">|</span> {getWeatherDesc(weather.weatherCode)}
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${aqiInfo.bg} ${aqiInfo.color}`}>
                        {aqiInfo.icon} AQI: {aqi.aqi}
                    </div>
                </div>

                {/* Hover State Details */}
                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <div className="pt-4 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3 min-w-[300px]">
                        <div className="text-xs text-gray-500 flex justify-between">PM2.5: <strong className="text-gray-700">{aqi.pm25} µg/m³</strong></div>
                        <div className="text-xs text-gray-500 flex justify-between">Humidity: <strong className="text-gray-700">{weather.humidity}%</strong></div>
                        <div className="text-xs text-gray-500 flex justify-between">PM10: <strong className="text-gray-700">{aqi.pm10} µg/m³</strong></div>
                        <div className="text-xs text-gray-500 flex justify-between">Wind: <strong className="text-gray-700">{weather.windSpeed} km/h</strong></div>
                    </div>
                    <div className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wider">Click for full transparency report</div>
                </div>
            </div>

            {/* Expanded Modal State */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition" onClick={() => setIsModalOpen(false)}>
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="p-10">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.name} — Transparency Report</h2>
                                <p className="text-gray-500 mt-2">{project.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Verified Data */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                                            <Factory className="w-4 h-4" /> Operational Metrics (24h)
                                        </h4>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">{project.energyKwh.toLocaleString()}</div>
                                                <div className="text-sm text-gray-500 mt-1">Energy Use (kWh)</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">{project.co2Tons}</div>
                                                <div className="text-sm text-gray-500 mt-1">CO₂ Emissions (Tons)</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">{project.waterM3}</div>
                                                <div className="text-sm text-gray-500 mt-1">Water Consumed (m³)</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">{project.wasteTons}</div>
                                                <div className="text-sm text-gray-500 mt-1">Waste Generated (Tons)</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                         <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                                            <Activity className="w-4 h-4" /> 14-Day Air Quality Trend
                                        </h4>
                                        <div className="h-48">
                                            <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Scores */}
                                <div className="space-y-6">
                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
                                        <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">Transparency Score</h4>
                                        <div className="text-7xl font-black text-green-600 tracking-tighter">{project.transparencyScore}</div>
                                        <p className="text-xs text-green-700 mt-4 font-medium">Based on open API integrations, complete reporting, and 3rd party audits.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            <Recycle className="w-4 h-4" /> Efficiency & Circularity
                                        </h4>
                                        <div className="mb-4">
                                            <div className="text-xl font-bold text-gray-900">{project.efficiencyMetric}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">Efficiency Rating</div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">{project.recyclingRate}%</div>
                                            <div className="text-xs text-gray-500 mt-0.5">Waste Recycled</div>
                                        </div>
                                    </div>

                                    <div className={`${aqiInfo.bg} p-6 rounded-2xl border border-opacity-50`}>
                                        <h4 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 ${aqiInfo.color}`}>
                                            <Wind className="w-4 h-4" /> Live Air Quality
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className={`text-sm ${aqiInfo.color} font-medium`}>AQI Index</span>
                                                <span className={`text-xl font-bold ${aqiInfo.color}`}>{aqi.aqi}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className={`text-sm ${aqiInfo.color} font-medium`}>PM2.5</span>
                                                <span className={`text-lg font-semibold ${aqiInfo.color}`}>{aqi.pm25} <span className="text-xs">µg/m³</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
