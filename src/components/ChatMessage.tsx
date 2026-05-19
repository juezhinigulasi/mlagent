import { User, Bot, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  const [showThink, setShowThink] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const parseContent = () => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/;
    const match = content.match(thinkRegex);
    const thinkContent = match ? match[1].trim() : '';
    
    let fullContent = content;
    if (thinkContent) {
      fullContent = fullContent.replace(thinkRegex, '');
    }
    
    fullContent = fullContent.replace(/<thunk>\s*/g, '');
    fullContent = fullContent.replace(/\s*<\/thunk>/g, '');
    fullContent = fullContent.replace(/<\/?think>/g, '');
    fullContent = fullContent.trim();
    
    const parts = fullContent.split(/^---$/m);
    let copyableContent = parts[0]?.trim() || fullContent;
    
    copyableContent = copyableContent.replace(/^###\s*.*$/m, '').trim();
    
    const adviceContent = parts[1]?.trim() || '';
    
    return { thinkContent, mainContent: fullContent, copyableContent };
  };

  const { thinkContent, mainContent, copyableContent } = parseContent();

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];
    let inPrompt = false;
    let promptLines: string[] = [];
    let blockId = 0;

    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        if (promptLines.length > 0) {
          const promptText = promptLines.join('\n').trim();
          const currentId = `prompt-${blockId++}`;
          elements.push(
            <CopyableBlock 
              key={currentId}
              content={promptText}
              onCopy={() => handleCopy(promptText, currentId)}
              copied={copied === currentId}
              label="提示词"
            />
          );
          promptLines = [];
        }
        inPrompt = false;
        elements.push(
          <p key={index} className="font-bold mb-2 text-orange-400">
            {line.slice(2, -2)}
          </p>
        );
        return;
      }

      if (line.startsWith('**提示词：**') || line.startsWith('提示词：')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        inPrompt = true;
        elements.push(
          <p key={index} className="font-bold mb-2 text-yellow-400">
            {line}
          </p>
        );
        return;
      }

      if (line.startsWith('【') && line.endsWith('】')) {
        elements.push(
          <p key={index} className="mb-2 text-gray-400 font-medium">
            {line}
          </p>
        );
        return;
      }

      if (line.startsWith('* ') || line.startsWith('- ')) {
        inList = true;
        listItems.push(
          <li key={`item-${index}`} className="mb-1 text-gray-300">
            {line.slice(2)}
          </li>
        );
        return;
      } else if (line.startsWith('# ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(
          <h2 key={index} className="text-xl font-bold text-yellow-400 mb-3 mt-4">
            {line.slice(2)}
          </h2>
        );
        return;
      } else if (line.startsWith('## ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(
          <h3 key={index} className="text-lg font-bold text-yellow-500 mb-2 mt-3">
            {line.slice(3)}
          </h3>
        );
        return;
      } else if (line.startsWith('### ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(
          <h4 key={index} className="text-base font-semibold text-yellow-600 mb-2 mt-2">
            {line.slice(4)}
          </h4>
        );
        return;
      } else if (line.startsWith('`') && line.endsWith('`')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(
          <code key={index} className="bg-gray-700/50 px-2 py-1 rounded text-yellow-400 text-sm">
            {line.slice(1, -1)}
          </code>
        );
        return;
      } else if (line.trim() === '') {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(<br key={index} />);
        return;
      } else {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        elements.push(
          <p key={index} className="mb-2 last:mb-0 text-gray-300 leading-relaxed">
            {line}
          </p>
        );
        return;
      }
    });

    if (inList) {
      elements.push(<ul key="final-list" className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
    }

    if (promptLines.length > 0) {
      const promptText = promptLines.join('\n').trim();
      const currentId = `prompt-${blockId++}`;
      elements.push(
        <CopyableBlock 
          key={currentId}
          content={promptText}
          onCopy={() => handleCopy(promptText, currentId)}
          copied={copied === currentId}
          label="提示词"
        />
      );
    }

    return elements;
  };

  function CopyableBlock({ content, onCopy, copied, label }: { content: string; onCopy: () => void; copied: boolean; label: string }) {
    const renderBlockText = (text: string) => {
      const lines = text.split('\n');
      const elements: React.ReactNode[] = [];
      let inList = false;
      let listItems: React.ReactNode[] = [];

      lines.forEach((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
          inList = true;
          listItems.push(
            <li key={`block-item-${index}`} className="mb-1 text-gray-200">
              {line.slice(2)}
            </li>
          );
        } else if (line.trim() === '') {
          if (inList) {
            elements.push(<ul key={`block-list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
            inList = false;
            listItems = [];
          }
          elements.push(<br key={`block-br-${index}`} />);
        } else {
          if (inList) {
            elements.push(<ul key={`block-list-${index}`} className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
            inList = false;
            listItems = [];
          }
          elements.push(
            <p key={`block-p-${index}`} className="mb-2 last:mb-0 leading-relaxed text-gray-200">
              {line}
            </p>
          );
        }
      });

      if (inList) {
        elements.push(<ul key="block-final-list" className="list-disc list-outside ml-6 mb-2">{listItems}</ul>);
      }

      return elements;
    };

    return (
      <div className="relative my-4">
        <div className="bg-gray-700/30 border-2 border-yellow-500/40 rounded-xl p-4">
          <div className="text-gray-200">
            {renderBlockText(content)}
          </div>
        </div>
        <button
          onClick={onCopy}
          className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              复制{label}
            </>
          )}
        </button>
      </div>
    );
  }

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

        {/* 主要内容 */}
        <div
          className={`px-5 py-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gray-800 text-gray-200 rounded-tr-sm'
              : 'bg-gray-800/50 text-gray-300 rounded-tl-sm border border-yellow-500/20'
          }`}
        >
          {renderText(mainContent)}
        </div>
      </div>
    </div>
  );
}