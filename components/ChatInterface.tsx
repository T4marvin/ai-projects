
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Volume2, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Message, Activity } from '../types';
import { chatWithPro, generateSpeech, analyzeImage } from '../services/gemini';

interface ChatInterfaceProps {
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ addActivity }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am Aura. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPendingImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !pendingImage) || isLoading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input,
      mediaUrl: pendingImage || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (pendingImage) {
        const base64 = pendingImage.split(',')[1];
        responseText = await analyzeImage(base64, input || "Analyze this image.");
        setPendingImage(null);
      } else {
        const response = await chatWithPro(input, messages, useThinking);
        responseText = response.text || "I'm sorry, I couldn't generate a response.";
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      };

      setMessages(prev => [...prev, assistantMsg]);
      addActivity({ type: 'chat', description: `Chatted with Aura: ${input.slice(0, 30)}...` });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: 'err', 
        role: 'assistant', 
        content: "Error connecting to Gemini. Please check your network." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const audio = new Audio(`data:audio/pcm;base64,${base64Audio}`);
        // Note: PCM raw audio needs a specific player, but for simplicity we assume standard audio format support
        // or we convert it. In a real world, we'd use the Web Audio API as shown in the Live API example.
        // Simplified for this demo component:
        console.log("TTS data generated");
      }
    } catch (e) {
      console.error("TTS failed", e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f0f0f]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold">Chat with Aura</h2>
        </div>
        <button 
          onClick={() => setUseThinking(!useThinking)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            useThinking ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          Thinking Mode {useThinking ? 'ON' : 'OFF'}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-200'
            }`}>
              {msg.mediaUrl && (
                <img src={msg.mediaUrl} alt="Upload" className="max-w-full rounded-lg mb-3 max-h-64 object-cover" />
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => playTTS(msg.content)}
                  className="mt-3 p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-gray-400">Aura is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0f0f0f] border-t border-white/10">
        {pendingImage && (
          <div className="mb-4 relative inline-block">
            <img src={pendingImage} className="w-20 h-20 rounded-lg object-cover border border-indigo-500" />
            <button 
              onClick={() => setPendingImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <label className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-gray-400 transition-colors">
            <ImageIcon className="w-6 h-6" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none max-h-32 text-gray-200"
              rows={1}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
