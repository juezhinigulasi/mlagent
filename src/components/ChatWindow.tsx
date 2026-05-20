import { useState, useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef(0);
  const hasRestoredPositionRef = useRef(false);

  // 保存滚动位置
  const saveScrollPosition = () => {
    if (messagesContainerRef.current) {
      lastScrollPositionRef.current = messagesContainerRef.current.scrollTop;
    }
  };

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    if (messagesContainerRef.current && !hasRestoredPositionRef.current) {
      // 恢复到之前保存的位置
      messagesContainerRef.current.scrollTop = lastScrollPositionRef.current;
      hasRestoredPositionRef.current = true;
      // 重置标志，下次新消息时可以正常滚动
      setTimeout(() => {
        hasRestoredPositionRef.current = false;
      }, 100);
    }
  };

  useEffect(() => {
    // 监听页面可见性变化（标签页切换）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 用户返回页面
        restoreScrollPosition();
      } else {
        // 用户离开页面
        saveScrollPosition();
      }
    };

    // 监听窗口失焦/聚焦（窗口切换）
    const handleWindowBlur = () => {
      saveScrollPosition();
    };

    const handleWindowFocus = () => {
      restoreScrollPosition();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      // 如果用户滚动到接近底部，显示/隐藏按钮
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isAtBottom);
      // 保存滚动位置
      lastScrollPositionRef.current = scrollTop;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollToBottom(false);
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
        <div ref={messagesEndRef} />
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