import { useState } from 'react';
import HistoryPanel from './HistoryPanel';
import ChatWindow, { Message } from './ChatWindow';

interface SingleChatLayoutProps {
  title: string;
  history: { id: string; title: string; time: string; preview: string }[];
  activeHistoryId: string | null;
  onHistorySelect: (id: string) => void;
}

const mockMessages: Record<string, Message[]> = {
  polish: [
    {
      id: '1',
      content: '您好！我是文案润色大师。请把需要润色的文案发给我，我来帮您优化表达。',
      isUser: false,
      timestamp: '10:30',
    },
    {
      id: '2',
      content: '请帮我润色一下这句话："这个产品很好用，大家可以试试"',
      isUser: true,
      timestamp: '10:31',
    },
    {
      id: '3',
      content: '好的！以下是润色后的版本：\n\n"这款产品性能卓越，值得您亲自体验。"\n\n润色说明：\n1. 将口语化的"很好用"改为更专业的"性能卓越"\n2. 将"大家可以试试"改为更具引导性的"值得您亲自体验"\n3. 整体语气更加正式和有说服力',
      isUser: false,
      timestamp: '10:32',
    },
  ],
  prompt: [
    {
      id: '1',
      content: '欢迎使用提示词大师！告诉我您想要生成什么类型的提示词，我来帮您优化。',
      isUser: false,
      timestamp: '10:25',
    },
    {
      id: '2',
      content: '帮我生成一个AI绘画的提示词，主题是风景',
      isUser: true,
      timestamp: '10:26',
    },
    {
      id: '3',
      content: '好的！以下是为您生成的详细提示词：\n\n一幅美丽的山间日落风景，金色的阳光洒在连绵起伏的山脉上，山间有清澈的小溪流淌，溪边开满野花，远处的天空被染成橙红色，有几朵白云漂浮，整体氛围宁静祥和，油画风格，高清8K，细腻的笔触，温暖的色调',
      isUser: false,
      timestamp: '10:28',
    },
  ],
};

export default function SingleChatLayout({ title, history, activeHistoryId, onHistorySelect }: SingleChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[title === '文案润色大师' ? 'polish' : 'prompt']);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: '【预留接口】请在此处接入 Dify API，调用 handleSendMessage 函数处理消息。',
          isUser: false,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex">
      <HistoryPanel
        history={history}
        activeId={activeHistoryId}
        onSelect={onHistorySelect}
        title={title}
      />
      <ChatWindow title={title} messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}