import { useState } from 'react';
import HistoryPanel from './HistoryPanel';
import ChatWindow, { Message } from './ChatWindow';
import { FileText, TrendingUp, Image } from 'lucide-react';

interface TripleLayoutProps {
  history: { id: string; title: string; time: string; preview: string }[];
  activeHistoryId: string | null;
  onHistorySelect: (id: string) => void;
}

const mockMessages: Record<string, Message[]> = {
  chapter: [
    {
      id: '1',
      content: '您好！我是章节大师，专门帮您构思小说章节。请告诉我您的故事背景和想要的章节类型。',
      isUser: false,
      timestamp: '10:30',
    },
    {
      id: '2',
      content: '我正在写一部玄幻小说，需要一个精彩的打斗场面章节开头。',
      isUser: true,
      timestamp: '10:31',
    },
    {
      id: '3',
      content: '好的！以下是为您构思的章节开头：\n\n【第三章：风雷动】\n\n青冥山脉，黑云压城。\n\n林玄手持青锋剑，衣袂猎猎作响。对面的血月宗护法眼中闪过一丝狠厉，手中血色长鞭如毒蛇般蜿蜒而出。\n\n"小子，交出玄冰玉髓，饶你不死！"',
      isUser: false,
      timestamp: '10:32',
    },
  ],
  topic: [
    {
      id: '1',
      content: '欢迎使用爆款选题大师！告诉我您的领域，我来帮您生成热门选题。',
      isUser: false,
      timestamp: '10:25',
    },
    {
      id: '2',
      content: '我是做美食自媒体的，最近想做一些家常菜相关的内容。',
      isUser: true,
      timestamp: '10:26',
    },
    {
      id: '3',
      content: '好的！以下是为您推荐的爆款选题：\n\n1. 《月薪3000也能天天吃好！5道不到10元的下饭神菜》\n2. 《婆婆偷偷教我的3个做菜秘诀，学会家人都夸你》\n3. 《懒人必看！电饭煲就能做的8道硬菜》\n4. 《厨房小白也能学会的10道快手家常菜》',
      isUser: false,
      timestamp: '10:28',
    },
  ],
  cover: [
    {
      id: '1',
      content: '封面提示词大师为您服务！请告诉我您的书籍类型和风格。',
      isUser: false,
      timestamp: '10:20',
    },
    {
      id: '2',
      content: '我需要一个科幻小说的封面提示词',
      isUser: true,
      timestamp: '10:21',
    },
    {
      id: '3',
      content: '好的！以下是为您生成的封面提示词：\n\n科幻小说封面，赛博朋克风格，深邃的宇宙背景中漂浮着破碎的机械星球，中央是银色金属质感的飞船剪影，霓虹灯光勾勒出复杂的电路板图案，深蓝与紫色交织的渐变色调，科幻感十足的字体设计，高清8K，电影级质感',
      isUser: false,
      timestamp: '10:23',
    },
  ],
};

export default function TripleLayout({ history, activeHistoryId, onHistorySelect }: TripleLayoutProps) {
  const [chapterMessages, setChapterMessages] = useState<Message[]>(mockMessages.chapter);
  const [topicMessages, setTopicMessages] = useState<Message[]>(mockMessages.topic);
  const [coverMessages, setCoverMessages] = useState<Message[]>(mockMessages.cover);
  const [activeScrollPanel, setActiveScrollPanel] = useState<string | null>(null);

  const handleSendMessage = (type: string, message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    switch (type) {
      case 'chapter':
        setChapterMessages((prev) => [...prev, newMessage]);
        setTimeout(() => {
          setChapterMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: '章节大师正在为您构思...（Mock回复）',
              isUser: false,
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1000);
        break;
      case 'topic':
        setTopicMessages((prev) => [...prev, newMessage]);
        setTimeout(() => {
          setTopicMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: '爆款选题大师正在为您生成...（Mock回复）',
              isUser: false,
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1000);
        break;
      case 'cover':
        setCoverMessages((prev) => [...prev, newMessage]);
        setTimeout(() => {
          setCoverMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: '封面提示词大师正在为您创作...（Mock回复）',
              isUser: false,
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1000);
        break;
    }
  };

  const tabs = [
    { id: 'chapter', name: '章节大师', icon: FileText },
    { id: 'topic', name: '爆款选题', icon: TrendingUp },
    { id: 'cover', name: '封面提示词', icon: Image },
  ];

  return (
    <div className="flex-1 flex h-full">
      <HistoryPanel
        history={history}
        activeId={activeHistoryId}
        onSelect={onHistorySelect}
        title="创作历史"
      />

      <div className="flex-1 flex h-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScrollPanel === tab.id;
          return (
            <div 
              key={tab.id} 
              className="flex-1 border-l border-gray-800 flex flex-col h-full"
              onMouseEnter={() => setActiveScrollPanel(tab.id)}
              onMouseLeave={() => setActiveScrollPanel(null)}
              style={{ 
                overflow: isActive ? 'auto' : 'hidden',
              }}
            >
              <div className="h-12 bg-gray-900/80 border-b border-gray-800 flex items-center justify-center gap-2 flex-shrink-0">
                <Icon className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-medium text-sm">{tab.name}</span>
              </div>
              <div className={`flex-1 flex flex-col ${isActive ? '' : ''}`}>
                <ChatWindow
                  title={tab.name}
                  messages={tab.id === 'chapter' ? chapterMessages : tab.id === 'topic' ? topicMessages : coverMessages}
                  onSendMessage={(msg) => handleSendMessage(tab.id, msg)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}