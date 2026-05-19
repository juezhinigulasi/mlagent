import { MessageSquare, Clock } from 'lucide-react';

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
}

export default function HistoryPanel({ history, activeId, onSelect, title }: HistoryPanelProps) {
  return (
    <aside className="w-72 bg-gray-900/30 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-yellow-500" />
          {title}
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
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                activeId === item.id
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border border-transparent'
              }`}
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
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
          <span className="text-sm font-medium">+ 新建对话</span>
        </button>
      </div>
    </aside>
  );
}