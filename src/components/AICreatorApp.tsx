'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import SingleChatLayout from './SingleChatLayout';
import TripleLayout from './TripleLayout';

const polishHistory = [
  { id: '1', title: '产品描述润色', time: '今天 10:30', preview: '这款产品性能卓越...' },
  { id: '2', title: '营销文案优化', time: '今天 09:15', preview: '活动即将开始，限时优惠...' },
  { id: '3', title: '简历内容修改', time: '昨天 18:42', preview: '具备丰富的项目经验...' },
];

const promptHistory = [
  { id: '1', title: 'AI绘画提示词', time: '今天 10:25', preview: '一幅美丽的山间日落...' },
  { id: '2', title: '文案写作提示', time: '今天 08:30', preview: '撰写一篇关于旅行的文章...' },
  { id: '3', title: '代码生成提示', time: '昨天 16:20', preview: '生成一个React组件...' },
];

const createHistory = [
  { id: '1', title: '玄幻小说创作', time: '今天 10:15', preview: '第三章：风雷动...' },
  { id: '2', title: '美食选题策划', time: '今天 09:00', preview: '5道不到10元的下饭菜...' },
  { id: '3', title: '科幻封面设计', time: '昨天 14:30', preview: '赛博朋克风格封面...' },
];

export default function AICreatorApp() {
  const [activeFeature, setActiveFeature] = useState('polish');
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getCurrentHistory = () => {
    switch (activeFeature) {
      case 'polish':
        return polishHistory;
      case 'prompt':
        return promptHistory;
      case 'create':
        return createHistory;
      default:
        return [];
    }
  };

  const getFeatureTitle = () => {
    switch (activeFeature) {
      case 'polish':
        return '文案润色大师';
      case 'prompt':
        return '提示词大师';
      case 'create':
        return '三合一创作中心';
      default:
        return '';
    }
  };

  const handleSendMessage = async (message: string) => {
    // 预留接口：后续接入 Dify API
    console.log('发送消息:', message);
    // TODO: 调用 Dify API
    // const response = await fetch('/api/dify', {
    //   method: 'POST',
    //   body: JSON.stringify({ message }),
    // });
    // const data = await response.json();
    // return data;
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <Sidebar 
          activeFeature={activeFeature} 
          onFeatureChange={setActiveFeature}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

      <main className="flex-1 overflow-hidden">
        {activeFeature === 'create' ? (
          <TripleLayout
            history={getCurrentHistory()}
            activeHistoryId={activeHistoryId}
            onHistorySelect={setActiveHistoryId}
          />
        ) : (
          <SingleChatLayout
            title={getFeatureTitle()}
            history={getCurrentHistory()}
            activeHistoryId={activeHistoryId}
            onHistorySelect={setActiveHistoryId}
          />
        )}
      </main>
    </div>
  );
}