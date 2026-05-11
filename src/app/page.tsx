export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-200 to-pink-200">
      <h1 className="text-4xl font-bold text-orange-500 mb-8">🐱 可爱的小猫咪</h1>
      
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400">
          <ellipse cx="200" cy="280" rx="100" ry="30" fill="#FFA500" opacity="0.2"/>
          
          <ellipse cx="200" cy="230" rx="80" ry="60" fill="#FFA500"/>
          <ellipse cx="200" cy="225" rx="60" ry="45" fill="#FFB6C1"/>
          
          <polygon points="130,120 165,175 110,170" fill="#FFA500"/>
          <polygon points="138,135 160,170 122,168" fill="#FFB6C1"/>
          <polygon points="270,120 235,175 290,170" fill="#FFA500"/>
          <polygon points="262,135 240,170 278,168" fill="#FFB6C1"/>
          
          <circle cx="200" cy="160" r="48" fill="#FFA500"/>
          <circle cx="200" cy="158" r="40" fill="#FFE4E1"/>
          
          <ellipse cx="170" cy="145" rx="14" ry="18" fill="#1a1a1a"/>
          <ellipse cx="230" cy="145" rx="14" ry="18" fill="#1a1a1a"/>
          <ellipse cx="174" cy="141" rx="6" ry="8" fill="white"/>
          <ellipse cx="234" cy="141" rx="6" ry="8" fill="white"/>
          <circle cx="176" cy="145" r="3" fill="#1a1a1a"/>
          <circle cx="236" cy="145" r="3" fill="#1a1a1a"/>
          
          <path d="M192 168 L200 175 L208 168" stroke="#FF69B4" strokeWidth="2" fill="none"/>
          <ellipse cx="200" cy="175" rx="6" ry="4" fill="#FF69B4"/>
          
          <line x1="150" y1="165" x2="110" y2="160" stroke="#333" strokeWidth="2"/>
          <line x1="150" y1="172" x2="110" y2="172" stroke="#333" strokeWidth="2"/>
          <line x1="150" y1="179" x2="110" y2="184" stroke="#333" strokeWidth="2"/>
          <line x1="250" y1="165" x2="290" y2="160" stroke="#333" strokeWidth="2"/>
          <line x1="250" y1="172" x2="290" y2="172" stroke="#333" strokeWidth="2"/>
          <line x1="250" y1="179" x2="290" y2="184" stroke="#333" strokeWidth="2"/>
          
          <ellipse cx="145" cy="160" rx="15" ry="8" fill="#FFB6C1" opacity="0.6"/>
          <ellipse cx="255" cy="160" rx="15" ry="8" fill="#FFB6C1" opacity="0.6"/>
          
          <ellipse cx="130" cy="200" rx="22" ry="10" fill="#FFA500"/>
          <ellipse cx="270" cy="200" rx="22" ry="10" fill="#FFA500"/>
          
          <ellipse cx="200" cy="245" rx="15" ry="8" fill="#FFB6C1"/>
          
          <ellipse cx="155" cy="280" rx="18" ry="10" fill="#FFA500"/>
          <ellipse cx="245" cy="280" rx="18" ry="10" fill="#FFA500"/>
          
          <path d="M155 288 Q150 305 145 320" stroke="#FFA500" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M155 290 Q148 308 142 325" stroke="#FFE4E1" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M245 288 Q250 305 255 320" stroke="#FFA500" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M245 290 Q252 308 258 325" stroke="#FFE4E1" strokeWidth="4" fill="none" strokeLinecap="round"/>
          
          <path d="M280 220 Q330 200 350 150 Q345 130 330 140 Q320 125 300 135 Q290 115 280 130" stroke="#FFA500" strokeWidth="10" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      
      <p className="mt-8 text-xl text-gray-600">~ 喵喵喵 ~</p>
    </main>
  )
}
