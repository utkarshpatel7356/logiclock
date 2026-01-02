import React from 'react';

const GlitchText = ({ text, as: Tag = 'h1', className = '' }) => {
  return (
    <div className="relative inline-block group">
      <Tag className={`relative z-10 ${className}`}>
        {text}
      </Tag>
      <Tag className={`absolute top-0 left-0 -z-10 w-full h-full text-neon-green opacity-0 group-hover:opacity-70 group-hover:animate-glitch group-hover:translate-x-[2px] ${className}`}>
        {text}
      </Tag>
      <Tag className={`absolute top-0 left-0 -z-10 w-full h-full text-alert-red opacity-0 group-hover:opacity-70 group-hover:animate-glitch group-hover:-translate-x-[2px] animation-delay-75 ${className}`}>
        {text}
      </Tag>
    </div>
  );
};

export default GlitchText;