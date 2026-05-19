import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser ? 'bg-gray-700' : 'bg-yellow-500'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-gray-300" />
        ) : (
          <Bot className="w-5 h-5 text-black" />
        )}
      </div>
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs ${
              isUser ? 'text-gray-400' : 'text-yellow-400 font-medium'
            }`}
          >
            {isUser ? '你' : 'AI 助手'}
          </span>
          {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
        </div>
        <div
          className={`px-5 py-4 rounded-2xl leading-relaxed ${
            isUser
              ? 'bg-gray-800 text-gray-200 rounded-tr-sm'
              : 'bg-gray-800/50 text-gray-300 rounded-tl-sm border border-yellow-500/20'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}