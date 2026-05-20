'use client';

import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import SingleChatLayout from './SingleChatLayout';
import AuthModal from './AuthModal';
import { useChat, featureNames } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function AICreatorApp() {
  const [activeFeature, setActiveFeature] = useState('polish');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { sessions, activeSessionId, setActiveSession, createNewSession, deleteSession } = useChat();
  const { user, signOut } = useAuth();

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

  const handleLogout = () => {
    signOut();
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
        {user ? (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="max-w-24 truncate">{user.email}</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              登录/注册
            </button>
          </div>
        )}

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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
