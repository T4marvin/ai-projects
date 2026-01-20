
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import ResearchHub from './components/ResearchHub';
import VideoGeneration from './components/VideoGeneration';
import ActivityTracker from './components/ActivityTracker';
import { AppTab, Activity } from './types';
import { Sparkles, Brain, Clock, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load activities from local storage for "Long-term context" simulation
  useEffect(() => {
    const saved = localStorage.getItem('aura_activities');
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (data: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                  Welcome back, <span className="text-indigo-500">User</span>.
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Aura is processing your latest activities. Memory is synced across all modules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { icon: Brain, label: 'Intelligence', value: 'Gemini 3 Pro', color: 'bg-indigo-500' },
                  { icon: Sparkles, label: 'Optimization', value: 'Behavioral', color: 'bg-pink-500' },
                  { icon: Clock, label: 'Uptime', value: '24/7 Sync', color: 'bg-green-500' },
                  { icon: ShieldCheck, label: 'Security', value: 'End-to-End', color: 'bg-blue-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-all shadow-xl group">
                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-white">Recent Memory</h2>
                  <div className="space-y-4">
                    {activities.slice(-3).reverse().map((a) => (
                      <div key={a.id} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div className="flex-1">
                          <p className="text-gray-200 text-sm font-medium">{a.description}</p>
                          <p className="text-gray-500 text-xs">{new Date(a.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && <p className="text-gray-500 text-center py-4">No recent context captured.</p>}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Aura Live Voice</h2>
                    <p className="text-indigo-100 mb-8 max-w-xs">Experience low-latency real-time voice conversations with Native Audio API.</p>
                    <button 
                      onClick={() => setActiveTab(AppTab.VOICE)}
                      className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all"
                    >
                      Initialize Link
                    </button>
                  </div>
                  <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 group-hover:rotate-12 transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </div>
        );
      case AppTab.CHAT:
        return <ChatInterface addActivity={addActivity} />;
      case AppTab.RESEARCH:
        return <ResearchHub />;
      case AppTab.VIDEO:
        return <VideoGeneration />;
      case AppTab.HISTORY:
        return <ActivityTracker activities={activities} />;
      case AppTab.VOICE:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d0d] p-8">
            <div className="max-w-md w-full text-center">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                <div className="relative w-48 h-48 mx-auto rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-24 h-24 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Aura Voice Matrix</h2>
              <p className="text-gray-400 mb-10">
                You are about to enter a high-fidelity, low-latency audio stream using Gemini 2.5 Native Audio. 
                Full multi-turn conversational capabilities active.
              </p>
              <button 
                onClick={() => addActivity({ type: 'voice', description: 'Initialized voice link session' })}
                className="w-full py-5 bg-white text-black font-bold rounded-2xl text-xl hover:bg-gray-100 transition-colors shadow-2xl shadow-white/10"
              >
                Start Session
              </button>
              <p className="mt-6 text-sm text-gray-500">Requires Microphone Permissions</p>
            </div>
          </div>
        );
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
