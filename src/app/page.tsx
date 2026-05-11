export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100">
      <h1 className="text-4xl font-bold text-yellow-600 mb-8">🐥 可爱的小黄鸭</h1>
      
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400">
          <ellipse cx="200" cy="280" rx="120" ry="50" fill="#FFD93D" opacity="0.3"/>
          
          <ellipse cx="200" cy="220" rx="100" ry="80" fill="#FFD93D"/>
          <ellipse cx="200" cy="210" rx="80" ry="65" fill="#FFE66D"/>
          
          <ellipse cx="150" cy="190" rx="35" ry="40" fill="#FFD93D"/>
          <ellipse cx="150" cy="185" rx="25" ry="30" fill="#FFE66D"/>
          <ellipse cx="250" cy="190" rx="35" ry="40" fill="#FFD93D"/>
          <ellipse cx="250" cy="185" rx="25" ry="30" fill="#FFE66D"/>
          
          <ellipse cx="130" cy="175" rx="15" ry="18" fill="#FFD93D"/>
          <ellipse cx="270" cy="175" rx="15" ry="18" fill="#FFD93D"/>
          
          <circle cx="200" cy="150" r="55" fill="#FFD93D"/>
          <circle cx="200" cy="145" r="45" fill="#FFE66D"/>
          
          <circle cx="175" cy="135" r="8" fill="#1a1a1a"/>
          <circle cx="225" cy="135" r="8" fill="#1a1a1a"/>
          <circle cx="177" cy="133" r="3" fill="white"/>
          <circle cx="227" cy="133" r="3" fill="white"/>
          
          <ellipse cx="200" cy="155" rx="12" ry="8" fill="#FF6B6B"/>
          
          <path d="M185 170 Q200 185 215 170" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
          
          <ellipse cx="145" cy="155" rx="15" ry="8" fill="#FF9F43" opacity="0.6"/>
          <ellipse cx="255" cy="155" rx="15" ry="8" fill="#FF9F43" opacity="0.6"/>
          
          <ellipse cx="130" cy="200" rx="20" ry="8" fill="#FF9F43"/>
          <ellipse cx="270" cy="200" rx="20" ry="8" fill="#FF9F43"/>
          
          <ellipse cx="200" cy="260" rx="25" ry="15" fill="#FF6B6B"/>
          
          <ellipse cx="160" cy="290" rx="20" ry="12" fill="#FFD93D"/>
          <ellipse cx="240" cy="290" rx="20" ry="12" fill="#FFD93D"/>
          
          <path d="M160 300 Q160 320 165 330" stroke="#FFD93D" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M240 300 Q240 320 235 330" stroke="#FFD93D" strokeWidth="12" fill="none" strokeLinecap="round"/>
          
          <path d="M290 200 Q340 180 350 150" stroke="#FFD93D" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <ellipse cx="355" cy="145" rx="12" ry="10" fill="#FFD93D"/>
        </svg>
      </div>
      
      <p className="mt-8 text-xl text-gray-700">~ 嘎嘎嘎 ~</p>
    </main>
  )
}
