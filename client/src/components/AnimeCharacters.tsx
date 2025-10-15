export function AnimeCharacters() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(210, 100%, 60%)', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: 'hsl(210, 100%, 50%)', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(210, 100%, 40%)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <ellipse cx="400" cy="550" rx="350" ry="80" fill="url(#blueGlow)" opacity="0.6" className="animate-pulse" style={{ animationDuration: '3s' }} />

        <g className="left-character" transform="translate(150, 150)">
          <ellipse cx="0" cy="150" rx="120" ry="100" fill="hsl(210, 100%, 50%)" opacity="0.3" filter="url(#strongGlow)" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          
          <ellipse cx="0" cy="-30" rx="35" ry="40" fill="#1a1a2e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M -60,-50 Q -80,-80 -70,-100 Q -60,-90 -50,-95 Q -45,-105 -35,-100 Q -30,-95 -40,-80 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="1.5" filter="url(#glow)" />
          
          <rect x="-40" y="-20" width="80" height="120" rx="15" fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M -40,20 L -70,90 L -75,110 L -65,112 L -35,100 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          <path d="M 40,20 L 70,90 L 75,110 L 65,112 L 35,100 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <ellipse cx="-12" cy="-15" rx="6" ry="8" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
          <ellipse cx="12" cy="-15" rx="6" ry="8" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
        </g>

        <g className="center-character" transform="translate(400, 120)">
          <ellipse cx="0" cy="200" rx="150" ry="120" fill="hsl(210, 100%, 50%)" opacity="0.4" filter="url(#strongGlow)" className="animate-pulse" style={{ animationDuration: '3s' }} />
          
          <ellipse cx="0" cy="-40" rx="45" ry="50" fill="#1a1a2e" stroke="hsl(210, 100%, 60%)" strokeWidth="3" filter="url(#glow)" />
          
          <path d="M -50,-70 Q -60,-110 -45,-130 L -35,-120 L -30,-125 L -20,-115 L -15,-120 L -5,-110 L 5,-110 L 15,-120 L 20,-115 L 30,-125 L 35,-120 L 45,-130 Q 60,-110 50,-70 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <rect x="-50" y="-25" width="100" height="140" rx="20" fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="3" filter="url(#glow)" />
          
          <path d="M -50,30 L -85,120 L -90,145 L -75,148 L -45,130 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="3" filter="url(#glow)" />
          <path d="M 50,30 L 85,120 L 90,145 L 75,148 L 45,130 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="3" filter="url(#glow)" />
          
          <path d="M -50,115 L -55,180 L -60,210 L -48,212 L -42,180 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2.5" filter="url(#glow)" />
          <path d="M 50,115 L 55,180 L 60,210 L 48,212 L 42,180 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2.5" filter="url(#glow)" />
          
          <ellipse cx="-15" cy="-20" rx="7" ry="10" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
          <ellipse cx="15" cy="-20" rx="7" ry="10" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
          
          <line x1="-20" y1="5" x2="20" y2="5" stroke="hsl(210, 100%, 60%)" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
        </g>

        <g className="right-character" transform="translate(650, 150)">
          <ellipse cx="0" cy="150" rx="120" ry="100" fill="hsl(210, 100%, 50%)" opacity="0.3" filter="url(#strongGlow)" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          
          <ellipse cx="0" cy="-30" rx="35" ry="40" fill="#1a1a2e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M -55,-60 Q -70,-90 -60,-110 Q -50,-100 -40,-105 Q -35,-115 -25,-110 Q -20,-105 -30,-90 L -20,-80 L -10,-85 L 0,-75 L 10,-85 L 20,-80 L 30,-90 Q 20,-105 25,-110 Q 35,-115 40,-105 Q 50,-100 60,-110 Q 70,-90 55,-60 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="1.5" filter="url(#glow)" />
          
          <rect x="-40" y="-20" width="80" height="120" rx="15" fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <path d="M -40,20 L -70,90 L -75,110 L -65,112 L -35,100 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          <path d="M 40,20 L 70,90 L 75,110 L 65,112 L 35,100 Z" 
                fill="#0f0f1e" stroke="hsl(210, 100%, 60%)" strokeWidth="2" filter="url(#glow)" />
          
          <ellipse cx="-12" cy="-15" rx="6" ry="8" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
          <ellipse cx="12" cy="-15" rx="6" ry="8" fill="hsl(210, 100%, 70%)" filter="url(#glow)" />
        </g>
      </svg>
    </div>
  );
}
