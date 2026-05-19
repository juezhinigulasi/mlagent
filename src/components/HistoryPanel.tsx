import { MessageSquare, Clock, Plus, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';

interface HistoryItem {
  id: string;
  title: string;
  time: string;
  preview: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  title: string;
  onNewSession: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryPanel({ history, activeId, onSelect, title, onNewSession, onDelete }: HistoryPanelProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  return (
    <aside className="w-72 bg-gray-900/30 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-yellow-500" />
          {title}历史
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无历史记录</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`relative group p-4 rounded-xl transition-all duration-300 ${
                activeId === item.id
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border border-transparent'
              } ${deleteConfirmId === item.id ? 'ring-2 ring-red-500' : ''}`}
            >
              <button
                onClick={() => onSelect(item.id)}
                className="w-full text-left"
              >
                <p
                  className={`font-medium text-sm mb-2 truncate ${
                    activeId === item.id ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 truncate mb-2">{item.preview}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              </button>
              
              {/* 删除按钮 */}
              <button
                onClick={(e) => handleDeleteClick(e, item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all duration-200"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* 二次确认按钮 */}
              {deleteConfirmId === item.id && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => handleConfirmDelete(e, item.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all duration-200"
                    title="确认删除"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="p-1.5 rounded-lg bg-gray-500/20 hover:bg-gray-500/40 text-gray-400 transition-all duration-200"
                    title="取消"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onNewSession}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">新建对话</span>
        </button>
      </div>
    </aside>
  );
}