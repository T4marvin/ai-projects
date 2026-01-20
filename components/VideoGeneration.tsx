
import React, { useState } from 'react';
import { Upload, Film, Loader2, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateVideoFromImage } from '../services/gemini';

const VideoGeneration: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Check for API key access for Veo models
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }

      const base64 = image.split(',')[1];
      const url = await generateVideoFromImage(base64, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate video. Ensure your API key is configured with billing.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] overflow-y-auto">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Cinema Engine</h2>
          <p className="text-gray-400">Animate static images into cinematic sequences with Veo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10">
              <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Step 1: Source Image</label>
              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-white/5 cursor-pointer transition-all">
                  <Upload className="w-10 h-10 text-gray-500 mb-2" />
                  <span className="text-gray-400">Upload Reference Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden">
                  <img src={image} className="w-full h-64 object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10">
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Step 2: Motion Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how the camera should move or how the subject should behave..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10">
              <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Step 3: Output Settings</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                    aspectRatio === '16:9' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Landscape (16:9)
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                    aspectRatio === '9:16' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Portrait (9:16)
                </button>
              </div>
            </div>

            <button 
              disabled={!image || isGenerating}
              onClick={handleGenerate}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Cinematic Video...
                </>
              ) : (
                <>
                  <Film className="w-6 h-6" />
                  Generate Magic
                </>
              )}
            </button>
          </div>

          {/* Result Preview */}
          <div className="flex flex-col">
            <div className="flex-1 bg-black rounded-3xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 text-center p-10">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xl font-semibold">Veo is processing...</p>
                  <p className="text-gray-500 max-w-xs">This typically takes 20-40 seconds to frame each sequence.</p>
                </div>
              ) : videoUrl ? (
                <div className="w-full h-full">
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    COMPLETED
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-600">
                  <Play className="w-16 h-16 opacity-20" />
                  <p className="text-lg">Your video preview will appear here</p>
                </div>
              )}

              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGeneration;
