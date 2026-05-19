import { useState, useEffect } from 'react';
import HistoryPanel from './HistoryPanel';
import ChatWindow, { Message } from './ChatWindow';
import { useChat } from '../context/ChatContext';

interface SingleChatLayoutProps {
  title: string;
  featureId: string;
  history: { id: string; title: string; time: string; preview: string }[];
  activeHistoryId: string | null;
  onHistorySelect: (id: string) => void;
  onNewSession: () => void;
}

const replies: Record<string, string> = {
  polish: '【文案润色大师】正在为您润色文案...（预留接口：接入 Dify API）',
  prompt: '【提示词大师】正在为您生成提示词...（预留接口：接入 Dify API）',
  chapter: '【章节大师】正在为您构思章节...（预留接口：接入 Dify API）',
  topic: '【爆款选题】正在为您生成选题...（预留接口：接入 Dify API）',
  cover: '【封面提示词】正在为您创作提示词...（预留接口：接入 Dify API）',
};

export default function SingleChatLayout({
  title,
  featureId,
  history,
  activeHistoryId,
  onHistorySelect,
  onNewSession,
}: SingleChatLayoutProps) {
  const { getActiveSessionMessages, addMessage } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const sessionMessages = getActiveSessionMessages(featureId);
    setMessages(sessionMessages);
  }, [featureId, activeHistoryId, getActiveSessionMessages]);

  const handleSendMessage = (message: string) => {
    if (!activeHistoryId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(featureId, activeHistoryId, newMessage);

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: replies[featureId] || replies.polish,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };

      addMessage(featureId, activeHistoryId, replyMessage);
    }, 1000);
  };

  return (
    <div className="flex-1 flex h-full">
      <HistoryPanel
        history={history}
        activeId={activeHistoryId}
        onSelect={onHistorySelect}
        title={title}
        onNewSession={onNewSession}
      />
      <ChatWindow title={title} messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
