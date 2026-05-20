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
  const isInitialLoad = useRef(true);

  // 保存滚动位置到 localStorage
  const saveScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      localStorage.setItem('chatScrollPosition', scrollTop.toString());
    }
  }, []);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const savedPosition = localStorage.getItem('chatScrollPosition');
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      console.log('Restoring scroll position:', position);
      
      // 确保 DOM 完全更新后再设置滚动位置
      setTimeout(() => {
        container.scrollTop = position;
      }, 50);
      
      // 再尝试一次，确保生效
      setTimeout(() => {
        container.scrollTop = position;
      }, 150);
    }
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

  // 组件挂载时恢复位置
  useEffect(() => {
    restoreScrollPosition();
    
    // 监听标签页可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page visible, restoring scroll position');
        restoreScrollPosition();
      } else {
        // 隐藏时保存位置
        saveScrollPosition();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restoreScrollPosition, saveScrollPosition]);

  // messages 变化时恢复位置（但只在首次加载时）
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      restoreScrollPosition();
    }
  }, [messages, restoreScrollPosition]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      // 滚动到底部后，保存这个位置
      setTimeout(() => {
        saveScrollPosition();
      }, 300);
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