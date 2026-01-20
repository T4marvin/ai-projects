
import React, { useState } from 'react';
import { Search, MapPin, Globe, ExternalLink, Loader2, Navigation } from 'lucide-react';
import { researchWithSearch, researchWithMaps } from '../services/gemini';

const ResearchHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'search' | 'maps'>('search');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      let res;
      if (type === 'search') {
        res = await researchWithSearch(query);
      } else {
        // Simple geo mock or navigator.geolocation call
        res = await researchWithMaps(query);
      }
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const groundingChunks = results?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Research Hub</h2>
          <p className="text-gray-400">Get up-to-date information via Google Search and Maps.</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
          <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl w-fit">
            <button 
              onClick={() => setType('search')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                type === 'search' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              General Search
            </button>
            <button 
              onClick={() => setType('maps')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                type === 'maps' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Place Search
            </button>
          </div>

          <div className="flex gap-3">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={type === 'search' ? "Search anything..." : "Find places, restaurants, business..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            />
            <button 
              onClick={handleResearch}
              disabled={loading}
              className="px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Analyze
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">Aura's Analysis</h3>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            </div>

            {groundingChunks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sources & Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groundingChunks.map((chunk: any, idx: number) => {
                    const source = chunk.web || chunk.maps;
                    if (!source) return null;
                    return (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/10 rounded-xl hover:border-indigo-500/50 hover:bg-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {chunk.web ? <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" /> : <Navigation className="w-5 h-5 text-green-400 flex-shrink-0" />}
                          <span className="truncate text-gray-300 font-medium">{source.title || "Reference Source"}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchHub;
