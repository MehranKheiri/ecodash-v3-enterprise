import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { ProjectData } from './types';
import { EcoDashWidget } from './components/EcoDashWidget';
import { Building2, ChevronRight, HardHat } from 'lucide-react';

function App() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:5058/api/projects')
            .then(res => {
                setProjects(res.data);
                if (res.data.length > 0) {
                    setSelectedProjectId(res.data[0].id);
                }
            })
            .catch(err => console.error("Failed to load projects", err));
    }, []);

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Mock Host Website Navigation */}
            <nav className="bg-stone-900 text-stone-100 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <HardHat className="text-yellow-500" />
                    AZ BUILDERS GROUP
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-stone-400">
                    <a href="#" className="hover:text-white transition">Projects</a>
                    <a href="#" className="hover:text-white transition">Services</a>
                    <a href="#" className="hover:text-white transition">About</a>
                    <a href="#" className="text-white">Sustainability</a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-[60vh] bg-stone-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1541888081691-11dcb1437146?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                        alt="Construction Site" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Building the Future,<br/>Responsibly.</h1>
                    <p className="text-lg text-stone-300 mb-10 max-w-2xl mx-auto">We believe the public deserves full transparency. Explore live environmental metrics from any of our active construction sites across Azerbaijan.</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-stone-900">Active Project Transparency</h2>
                    <p className="text-stone-500 mt-2">Select a site to view its live EcoDash widget.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar Project Selector */}
                    <div className="space-y-3">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedProjectId(p.id)}
                                className={`w-full text-left px-5 py-4 rounded-xl flex items-center justify-between transition-all ${selectedProjectId === p.id ? 'bg-white shadow-md border-l-4 border-yellow-500' : 'hover:bg-stone-200 text-stone-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 className={`w-5 h-5 ${selectedProjectId === p.id ? 'text-yellow-600' : 'text-stone-400'}`} />
                                    <span className={`font-semibold ${selectedProjectId === p.id ? 'text-stone-900' : ''}`}>{p.name}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 ${selectedProjectId === p.id ? 'text-yellow-600' : 'text-transparent'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Widget Display Area */}
                    <div className="lg:col-span-2">
                        {selectedProjectId ? (
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-stone-100 min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
                                {/* Decorative background */}
                                <div className="absolute -top-40 -right-40 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-50"></div>
                                
                                <div className="relative z-10 text-center w-full">
                                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-8">Live Environmental Widget</p>
                                    
                                    {/* --- THIS IS THE ECODASH WIDGET INJECTION --- */}
                                    <EcoDashWidget projectId={selectedProjectId} />
                                    {/* ------------------------------------------- */}
                                    
                                    <p className="text-xs text-stone-400 mt-12">Try hovering over the widget for quick details, or click it for the full transparency report.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-stone-100 rounded-3xl p-10 h-full flex items-center justify-center text-stone-400">
                                Loading projects...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
