
export interface Activity {
  id: string;
  timestamp: number;
  type: 'chat' | 'research' | 'voice' | 'video' | 'task';
  description: string;
  metadata?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'video' | 'map' | 'search_results';
  thinking?: string;
  groundingUrls?: Array<{title: string, uri: string}>;
  mediaUrl?: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  RESEARCH = 'research',
  VOICE = 'voice',
  VIDEO = 'video',
  HISTORY = 'history'
}
