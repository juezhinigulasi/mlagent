import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatWindowProps {
  title: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isStreaming?: boolean;
}

export default function ChatWindow({ title, messages, onSendMessage, isStreaming = false }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isRestoring = useRef(false);

  // 保存滚动位置
  const saveScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      localStorage.setItem('chatScrollPosition', container.scrollTop.toString());
    }
  }, []);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isRestoring.current) return;

    isRestoring.current = true;
    
    const savedPosition = localStorage.getItem('chatScrollPosition');
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      requestAnimationFrame(() => {
        container.scrollTop = position;
      });
    }
    
    setTimeout(() => {
      isRestoring.current = false;
    }, 100);
  }, []);

  // 处理滚动
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // 显示/隐藏回到最新按钮
    setShowScrollToBottom(distanceFromBottom >= 100);
    
    // 实时保存滚动位置
    localStorage.setItem('chatScrollPosition', scrollTop.toString());
  }, []);

  // AI生成中自动滚动到底部
  useEffect(() => {
    if (isStreaming) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
        localStorage.setItem('chatScrollPosition', container.scrollHeight.toString());
      }
    }
  }, [messages, isStreaming]);

  // 组件初始化
  useEffect(() => {
    // 延迟恢复一次位置
    setTimeout(() => {
      restoreScrollPosition();
    }, 100);
    
    // 监听标签页可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 如果正在生成中，自动滚动到底部
        if (!isStreaming) {
          restoreScrollPosition();
        }
      } else {
        saveScrollPosition();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restoreScrollPosition, saveScrollPosition, isStreaming]);

  // 回到最新
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      
      // 保存底部位置
      setTimeout(() => {
        localStorage.setItem('chatScrollPosition', container.scrollHeight.toString());
      }, 500);
    }
  };

  const handleSend = (message: string) => {
    setInputValue('');
    onSendMessage(message);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-gray-900/50">
      <header className="h-16 flex-shrink-0 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between px-6">
        <h2 className="text-white font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            isStreaming ? 'bg-yellow-500' : 'bg-green-500'
          }`}></span>
          <span className="text-xs text-gray-400">
            {isStreaming ? 'AI 正在思考...' : '在线'}
          </span>
        </div>
      </header>

      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      {/* 回到最新消息按钮 */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-medium">回到最新</span>
        </button>
      )}

      <div className="flex-shrink-0">
        <ChatInput onSend={handleSend} isStreaming={isStreaming} />
      </div>
    </div>
  );
}