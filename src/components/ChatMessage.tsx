import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold mb-2">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={index} className="list-disc list-inside ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-yellow-400 mb-2">
            {line.slice(2)}
          </h3>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2 last:mb-0">
          {line}
        </p>
      );
    });
  };

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
          className={`px-5 py-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gray-800 text-gray-200 rounded-tr-sm'
              : 'bg-gray-800/50 text-gray-300 rounded-tl-sm border border-yellow-500/20'
          }`}
        >
          {renderContent(content)}
        </div>
      </div>
    </div>
  );
}