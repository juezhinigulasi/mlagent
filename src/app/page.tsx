export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
      <h1 className="text-4xl font-bold text-gray-200 mb-8">🐺 大灰狼</h1>
      
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400">
          <ellipse cx="200" cy="280" rx="100" ry="40" fill="#4a4a4a" opacity="0.3"/>
          
          <ellipse cx="200" cy="240" rx="90" ry="70" fill="#6B7280"/>
          <ellipse cx="200" cy="230" rx="75" ry="55" fill="#9CA3AF"/>
          
          <path d="M140 120 L165 180 L120 160 Z" fill="#6B7280"/>
          <path d="M145 130 L162 175 L128 162 Z" fill="#D1D5DB"/>
          <path d="M260 120 L235 180 L280 160 Z" fill="#6B7280"/>
          <path d="M255 130 L238 175 L272 162 Z" fill="#D1D5DB"/>
          
          <circle cx="200" cy="160" r="50" fill="#6B7280"/>
          <circle cx="200" cy="155" r="42" fill="#9CA3AF"/>
          
          <circle cx="175" cy="145" r="12" fill="#1a1a1a"/>
          <circle cx="225" cy="145" r="12" fill="#1a1a1a"/>
          <circle cx="179" cy="141" r="5" fill="white"/>
          <circle cx="229" cy="141" r="5" fill="white"/>
          <circle cx="181" cy="143" r="2" fill="#1a1a1a"/>
          <circle cx="231" cy="143" r="2" fill="#1a1a1a"/>
          
          <path d="M180 175 Q200 195 220 175" stroke="#4B5563" strokeWidth="2" fill="none"/>
          
          <ellipse cx="200" cy="170" rx="18" ry="14" fill="#374151"/>
          
          <path d="M185 175 L165 185 L170 175" stroke="#374151" strokeWidth="2" fill="none"/>
          <path d="M185 178 L168 188 L172 178" stroke="#374151" strokeWidth="2" fill="none"/>
          <path d="M215 175 L235 185 L230 175" stroke="#374151" strokeWidth="2" fill="none"/>
          <path d="M215 178 L232 188 L228 178" stroke="#374151" strokeWidth="2" fill="none"/>
          
          <ellipse cx="145" cy="165" rx="18" ry="10" fill="#FF9F43" opacity="0.5"/>
          <ellipse cx="255" cy="165" rx="18" ry="10" fill="#FF9F43" opacity="0.5"/>
          
          <ellipse cx="135" cy="210" rx="25" ry="12" fill="#6B7280"/>
          <ellipse cx="265" cy="210" rx="25" ry="12" fill="#6B7280"/>
          
          <ellipse cx="200" cy="250" rx="20" ry="12" fill="#374151"/>
          <ellipse cx="200" cy="253" rx="10" ry="6" fill="#1F2937"/>
          
          <ellipse cx="155" cy="285" rx="22" ry="14" fill="#6B7280"/>
          <ellipse cx="245" cy="285" rx="22" ry="14" fill="#6B7280"/>
          
          <path d="M155 298 Q150 320 148 335" stroke="#6B7280" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M155 302 Q148 325 145 340" stroke="#9CA3AF" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M245 298 Q250 320 252 335" stroke="#6B7280" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M245 302 Q252 325 255 340" stroke="#9CA3AF" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      
      <p className="mt-8 text-xl text-gray-300">~ 嗷呜 ~</p>
    </main>
  )
}
