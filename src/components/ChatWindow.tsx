import { useState, useRef, useEffect } from 'react';
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    // 只有当用户没有手动滚动时，才自动滚动到底部
    if (!isUserScrollingRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      // 如果用户滚动到接近底部，认为用户停止手动滚动
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      isUserScrollingRef.current = !isAtBottom;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900/50">
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

      <div className="flex-shrink-0">
        <ChatInput onSend={handleSend} isStreaming={isStreaming} />
      </div>
    </div>
  );
}