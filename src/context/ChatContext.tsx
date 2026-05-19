'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message } from '../components/ChatWindow';

export interface ChatSession {
  id: string;
  title: string;
  time: string;
  preview: string;
  messages: Message[];
  conversationId?: string;
}

export interface ChatState {
  sessions: Record<string, ChatSession[]>;
  activeSessionId: Record<string, string | null>;
}

interface ChatContextType {
  sessions: Record<string, ChatSession[]>;
  activeSessionId: Record<string, string | null>;
  setActiveSession: (featureId: string, sessionId: string | null) => void;
  addMessage: (featureId: string, sessionId: string, message: Message) => void;
  createNewSession: (featureId: string) => void;
  getActiveSessionMessages: (featureId: string) => Message[];
  deleteSession: (featureId: string, sessionId: string) => void;
  getConversationId: (featureId: string) => string | undefined;
  setConversationId: (featureId: string, sessionId: string, conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'ai-creator-chat-data';

const defaultSessions: Record<string, ChatSession[]> = {
  polish: [
    {
      id: 'polish-1',
      title: '产品描述润色',
      time: '今天 10:30',
      preview: '这款产品性能卓越...',
      messages: [
        { id: '1', content: '您好！我是文案润色大师。请把需要润色的文案发给我，我来帮您优化表达。', isUser: false, timestamp: '10:30' },
        { id: '2', content: '请帮我润色一下这句话："这个产品很好用，大家可以试试"', isUser: true, timestamp: '10:31' },
        { id: '3', content: '好的！以下是润色后的版本：\n\n"这款产品性能卓越，值得您亲自体验。"\n\n润色说明：\n1. 将口语化的"很好用"改为更专业的"性能卓越"\n2. 将"大家可以试试"改为更具引导性的"值得您亲自体验"\n3. 整体语气更加正式和有说服力', isUser: false, timestamp: '10:32' },
      ],
    },
    {
      id: 'polish-2',
      title: '营销文案优化',
      time: '今天 09:15',
      preview: '活动即将开始，限时优惠...',
      messages: [
        { id: '1', content: '您好！我是文案润色大师。请把需要润色的文案发给我。', isUser: false, timestamp: '09:15' },
        { id: '2', content: '帮我优化一下："活动即将开始，限时优惠进行中"', isUser: true, timestamp: '09:16' },
      ],
    },
  ],
  prompt: [
    {
      id: 'prompt-1',
      title: 'AI绘画提示词',
      time: '今天 10:25',
      preview: '一幅美丽的山间日落...',
      messages: [
        { id: '1', content: '欢迎使用提示词大师！告诉我您想要生成什么类型的提示词。', isUser: false, timestamp: '10:25' },
        { id: '2', content: '帮我生成一个AI绘画的提示词，主题是风景', isUser: true, timestamp: '10:26' },
        { id: '3', content: '好的！以下是为您生成的详细提示词：\n\n一幅美丽的山间日落风景，金色的阳光洒在连绵起伏的山脉上，山间有清澈的小溪流淌，溪边开满野花，远处的天空被染成橙红色，有几朵白云漂浮，整体氛围宁静祥和，油画风格，高清8K，细腻的笔触，温暖的色调', isUser: false, timestamp: '10:28' },
      ],
    },
  ],
  cover: [
    {
      id: 'cover-1',
      title: '科幻小说封面',
      time: '今天 10:20',
      preview: '赛博朋克风格封面...',
      messages: [
        { id: '1', content: '封面提示词大师为您服务！请告诉我您的书籍类型和风格。', isUser: false, timestamp: '10:20' },
        { id: '2', content: '我需要一个科幻小说的封面提示词', isUser: true, timestamp: '10:21' },
        { id: '3', content: '好的！以下是为您生成的封面提示词：\n\n科幻小说封面，赛博朋克风格，深邃的宇宙背景中漂浮着破碎的机械星球，中央是银色金属质感的飞船剪影，霓虹灯光勾勒出复杂的电路板图案，深蓝与紫色交织的渐变色调，科幻感十足的字体设计，高清8K，电影级质感', isUser: false, timestamp: '10:23' },
      ],
    },
  ],
  topic: [
    {
      id: 'topic-1',
      title: '美食爆款选题',
      time: '今天 10:25',
      preview: '5道不到10元的下饭菜...',
      messages: [
        { id: '1', content: '欢迎使用爆款选题大师！告诉我您的领域，我来帮您生成热门选题。', isUser: false, timestamp: '10:25' },
        { id: '2', content: '我是做美食自媒体的，最近想做一些家常菜相关的内容。', isUser: true, timestamp: '10:26' },
        { id: '3', content: '好的！以下是为您推荐的爆款选题：\n\n1. 《月薪3000也能天天吃好！5道不到10元的下饭神菜》\n2. 《婆婆偷偷教我的3个做菜秘诀，学会家人都夸你》\n3. 《懒人必看！电饭煲就能做的8道硬菜》\n4. 《厨房小白也能学会的10道快手家常菜》', isUser: false, timestamp: '10:28' },
      ],
    },
  ],
  chapter: [
    {
      id: 'chapter-1',
      title: '玄幻小说第三章',
      time: '今天 10:30',
      preview: '第三章：风雷动...',
      messages: [
        { id: '1', content: '您好！我是章节大师，专门帮您构思小说章节。请告诉我您的故事背景和想要的章节类型。', isUser: false, timestamp: '10:30' },
        { id: '2', content: '我正在写一部玄幻小说，需要一个精彩的打斗场面章节开头。', isUser: true, timestamp: '10:31' },
        { id: '3', content: '好的！以下是为您构思的章节开头：\n\n【第三章：风雷动】\n\n青冥山脉，黑云压城。\n\n林玄手持青锋剑，衣袂猎猎作响。对面的血月宗护法眼中闪过一丝狠厉，手中血色长鞭如毒蛇般蜿蜒而出。\n\n"小子，交出玄冰玉髓，饶你不死！"', isUser: false, timestamp: '10:32' },
      ],
    },
  ],
};

const featureWelcomeMessages: Record<string, string> = {
  polish: '您好！我是文案润色大师。请把需要润色的文案发给我，我来帮您优化表达。',
  prompt: '欢迎使用提示词大师！告诉我您想要生成什么类型的提示词，我来帮您优化。',
  cover: '封面提示词大师为您服务！请告诉我您的书籍类型和风格。',
  topic: '欢迎使用爆款标题大师！告诉我您的领域，我来帮您生成吸引人的标题。',
  chapter: '您好！我是章节大师，专门帮您构思小说章节。请告诉我您的故事背景和想要的章节类型。',
};

const featureNames: Record<string, string> = {
  polish: '文案润色大师',
  prompt: '提示词大师',
  cover: '封面提示词',
  topic: '爆款标题',
  chapter: '章节大师',
};

const getStoredSessions = (): Record<string, ChatSession[]> => {
  if (typeof window === 'undefined') {
    return defaultSessions;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultSessions;
    }
  }
  return defaultSessions;
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Record<string, ChatSession[]>>(defaultSessions);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const stored = getStoredSessions();
    setSessions(stored);
    setHasHydrated(true);
  }, []);

  const [activeSessionId, setActiveSessionId] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {};
    Object.keys(defaultSessions).forEach(key => {
      initial[key] = defaultSessions[key][0]?.id || null;
    });
    return initial;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const setActiveSession = (featureId: string, sessionId: string | null) => {
    setActiveSessionId(prev => ({ ...prev, [featureId]: sessionId }));
  };

  const addMessage = (featureId: string, sessionId: string, message: Message) => {
    setSessions(prev => {
      const featureSessions = prev[featureId] || [];
      const updatedSessions = featureSessions.map(session => {
        if (session.id === sessionId) {
          const updatedMessages = [...session.messages, message];
          const preview = message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content;
          return {
            ...session,
            messages: updatedMessages,
            preview: session.preview === '新对话' ? preview : session.preview,
            time: message.timestamp,
          };
        }
        return session;
      });
      return { ...prev, [featureId]: updatedSessions };
    });
  };

  const createNewSession = (featureId: string) => {
    const newSession: ChatSession = {
      id: `${featureId}-${Date.now()}`,
      title: '新对话',
      time: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      preview: '新对话',
      messages: [
        {
          id: Date.now().toString(),
          content: featureWelcomeMessages[featureId] || '您好！我是您的AI助手。',
          isUser: false,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setSessions(prev => {
      const featureSessions = prev[featureId] || [];
      return { ...prev, [featureId]: [newSession, ...featureSessions] };
    });

    setActiveSessionId(prev => ({ ...prev, [featureId]: newSession.id }));
  };

  const getActiveSessionMessages = (featureId: string): Message[] => {
    const featureSessions = sessions[featureId] || [];
    const activeId = activeSessionId[featureId];
    const activeSession = featureSessions.find(s => s.id === activeId);
    return activeSession?.messages || [];
  };

  const deleteSession = (featureId: string, sessionId: string) => {
    setSessions(prev => {
      const featureSessions = prev[featureId] || [];
      const filteredSessions = featureSessions.filter(session => session.id !== sessionId);
      
      // 如果删除的是当前活跃的会话，需要切换到另一个
      if (activeSessionId[featureId] === sessionId) {
        const newActiveId = filteredSessions.length > 0 ? filteredSessions[0].id : null;
        setActiveSessionId(prevActive => ({ ...prevActive, [featureId]: newActiveId }));
      }
      
      return { ...prev, [featureId]: filteredSessions };
    });
  };

  const getConversationId = (featureId: string): string | undefined => {
    const featureSessions = sessions[featureId] || [];
    const activeId = activeSessionId[featureId];
    const activeSession = featureSessions.find(s => s.id === activeId);
    return activeSession?.conversationId;
  };

  const setConversationId = (featureId: string, sessionId: string, conversationId: string) => {
    setSessions(prev => {
      const featureSessions = prev[featureId] || [];
      const updatedSessions = featureSessions.map(session => {
        if (session.id === sessionId) {
          return { ...session, conversationId };
        }
        return session;
      });
      return { ...prev, [featureId]: updatedSessions };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        setActiveSession,
        addMessage,
        createNewSession,
        getActiveSessionMessages,
        deleteSession,
        getConversationId,
        setConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export { featureNames };
