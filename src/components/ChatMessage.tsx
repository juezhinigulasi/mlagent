import { User, Bot, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  const [showThink, setShowThink] = useState(false);
  const [copied, setCopied] = useState(false);

  const parseContent = () => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/;
    const match = content.match(thinkRegex);
    const thinkContent = match ? match[1].trim() : '';
    const mainContent = content.replace(thinkRegex, '').trim();
    return { thinkContent, mainContent };
  };

  const { thinkContent, mainContent } = parseContent();

  const renderText = (text: string) => {
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mainContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        
        {/* 思考过程 - 默认折叠 */}
        {thinkContent && (
          <div className="mb-3">
            <button
              onClick={() => setShowThink(!showThink)}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showThink ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {showThink ? '隐藏思考过程' : `显示思考过程 (${thinkContent.length}字)`}
              </span>
            </button>
            {showThink && (
              <div className="mt-2 p-3 bg-gray-900/50 rounded-xl text-xs text-gray-500 border border-gray-700">
                {renderText(thinkContent)}
              </div>
            )}
          </div>
        )}

        {/* 主要内容 + 复制按钮 */}
        <div className="relative">
          <div
            className={`px-5 py-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-gray-800 text-gray-200 rounded-tr-sm'
                : 'bg-gray-800/50 text-gray-300 rounded-tl-sm border border-yellow-500/20'
            }`}
          >
            {renderText(mainContent)}
          </div>
          
          {/* 复制按钮 */}
          {!isUser && mainContent && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-200"
              title={copied ? '已复制!' : '复制文案'}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}