import { MessageSquare, Sparkles, FileText, TrendingUp, Image, User, ChevronLeft, ChevronRight, LogOut, Coins } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SidebarProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
  points: number;
}

export default function Sidebar({ activeFeature, onFeatureChange, isCollapsed, onToggleCollapse, user, onSignOut, points }: SidebarProps) {
  const features = [
    { id: 'polish', name: '文案润色大师', icon: MessageSquare },
    { id: 'prompt', name: '提示词大师', icon: Sparkles },
    { id: 'cover', name: '封面标题章节', icon: Image },
    { id: 'topic', name: 'veo 8秒提示词', icon: TrendingUp },
    { id: 'chapter', name: '章节大师', icon: FileText },
  ];

  return (
    <aside className={`bg-[#0a0a0a] border-r border-gray-800 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-lg whitespace-nowrap">AI Creator</h1>
              <p className="text-gray-500 text-xs whitespace-nowrap">内容创作平台</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureChange(feature.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                  : 'bg-gray-900/50 hover:bg-gray-800/50 border border-transparent'
              }`}
              title={isCollapsed ? feature.name : undefined}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  isActive ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span
                  className={`text-left font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {feature.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-black" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-medium whitespace-nowrap truncate">{user?.email || '用户'}</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xs whitespace-nowrap">学员专用</span>
                <span className="text-gray-600">|</span>
                <span className="text-orange-400 text-xs flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {points}
                </span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onSignOut}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
              title="退出登录"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all z-10 shadow-lg"
        title={isCollapsed ? '展开侧边栏' : '收缩侧边栏'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}