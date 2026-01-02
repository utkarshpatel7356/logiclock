import React from 'react';

const TerminalWindow = ({ title = "root@kali:~", children }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 bg-cyber-black/90 backdrop-blur-md shadow-2xl">
      {/* Window Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-400 font-mono">
          {title}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 font-mono text-sm text-gray-300 min-h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;