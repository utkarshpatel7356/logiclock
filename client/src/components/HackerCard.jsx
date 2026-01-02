import React from 'react';

const HackerCard = ({ title, children, className = '' }) => {
  return (
    <div className={`relative bg-terminal-gray border border-neon-green/30 p-6 shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300 ${className}`}>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-green"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-green"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-green"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-green"></div>
      
      {/* Header Line */}
      <h3 className="text-xl font-bold mb-4 text-neon-green tracking-wider uppercase border-b border-neon-green/20 pb-2">
        {title}
      </h3>
      
      <div className="text-gray-300 font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

export default HackerCard;