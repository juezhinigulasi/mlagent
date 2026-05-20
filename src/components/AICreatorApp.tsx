'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowRight, User, Coins } from 'lucide-react';
import Sidebar from './Sidebar';
import SingleChatLayout from './SingleChatLayout';
import AuthModal from './AuthModal';
import { useChat, featureNames } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function AICreatorApp() {
  const [activeFeature, setActiveFeature] = useState('polish');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { sessions, activeSessionId, setActiveSession, createNewSession, deleteSession, setUserId } = useChat();
  const { user, loading, points, pointsLoading, signOut } = useAuth();

  useEffect(() => {
    if (!loading) {
      setUserId(user?.id || null);
    }
  }, [user, loading, setUserId]);

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

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">AI Creator</h1>
          <p className="text-gray-400 mb-8">请登录以使用全部功能</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl text-lg flex items-center gap-2 transition-all hover:scale-105 mx-auto"
          >
            <User className="w-5 h-5" />
            登录 / 注册
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (pointsLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <Sidebar
        activeFeature={activeFeature}
        onFeatureChange={setActiveFeature}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onSignOut={signOut}
        points={points}
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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
