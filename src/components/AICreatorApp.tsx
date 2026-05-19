'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import SingleChatLayout from './SingleChatLayout';
import { useChat, featureNames } from '../context/ChatContext';

export default function AICreatorApp() {
  const [activeFeature, setActiveFeature] = useState('polish');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { sessions, activeSessionId, setActiveSession, createNewSession, deleteSession } = useChat();

  const getCurrentHistory = () => {
    return sessions[activeFeature] || [];
  };

  const getFeatureTitle = () => {
    return featureNames[activeFeature] || '';
  };

  const handleHistorySelect = (sessionId: string) => {
    setActiveSession(activeFeature, sessionId);
  };

  const handleNewSession = () => {
    createNewSession(activeFeature);
  };

  const handleDelete = (sessionId: string) => {
    deleteSession(activeFeature, sessionId);
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
        <SingleChatLayout
          title={getFeatureTitle()}
          featureId={activeFeature}
          history={getCurrentHistory()}
          activeHistoryId={activeSessionId[activeFeature] || null}
          onHistorySelect={handleHistorySelect}
          onNewSession={handleNewSession}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
