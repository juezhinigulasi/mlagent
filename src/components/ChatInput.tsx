import { Send, Paperclip } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  isStreaming?: boolean;
}

export default function ChatInput({ onSend, placeholder = '输入你的问题...', isStreaming = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isStreaming) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-4xl mx-auto flex gap-4">
        <button 
          className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          disabled={isStreaming}
        >
          <Paperclip className="w-5 h-5 text-gray-400" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'AI 正在生成中，请稍候...' : placeholder}
          disabled={isStreaming}
          className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isStreaming}
          className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-700 disabled:to-gray-600 text-black font-semibold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/25 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <span>{isStreaming ? '生成中' : '发送'}</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}