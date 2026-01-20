
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const models = {
  pro: 'gemini-3-pro-preview',
  flash: 'gemini-3-flash-preview',
  flashLite: 'gemini-2.5-flash-lite-latest',
  voice: 'gemini-2.5-flash-native-audio-preview-12-2025',
  tts: 'gemini-2.5-flash-preview-tts',
  maps: 'gemini-2.5-flash',
  veo: 'veo-3.1-fast-generate-preview'
};

export const chatWithPro = async (message: string, history: any[] = [], useThinking = false) => {
  const ai = getAI();
  const config: any = {};
  
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const chat = ai.chats.create({
    model: models.pro,
    config: {
      ...config,
      systemInstruction: "You are Aura, a high-intelligence personal assistant. Be concise but extremely thorough when thinking is enabled."
    }
  });

  const response = await chat.sendMessage({ message });
  return response;
};

export const researchWithSearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: models.flash,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return response;
};

export const researchWithMaps = async (query: string, location?: { lat: number, lng: number }) => {
  const ai = getAI();
  const config: any = {
    tools: [{ googleMaps: {} }]
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    model: models.maps,
    contents: query,
    config
  });
  return response;
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: models.tts,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }
        }
      }
    }
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateVideoFromImage = async (imageB64: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: models.veo,
    prompt: prompt || 'Animate this image subtly and professionally.',
    image: {
      imageBytes: imageB64,
      mimeType: 'image/jpeg'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const analyzeImage = async (imageB64: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: models.pro,
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const getFastResponse = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: models.flashLite,
    contents: query
  });
  return response.text;
};
