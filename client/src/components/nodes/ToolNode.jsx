import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ToolNode = ({ data }) => {
  return (
    <div className="bg-terminal-gray border border-neon-green/50 p-2 rounded-md shadow-[0_0_10px_rgba(0,255,65,0.1)] min-w-[150px]">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-2">
        <span className="text-xs font-bold text-neon-green uppercase">TOOL MODULE</span>
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-400">Action:</div>
        <select 
          className="w-full bg-black border border-gray-700 text-white text-xs p-1 focus:border-neon-green outline-none"
          defaultValue={data.tool || 'nmap'}
          onChange={(evt) => data.onChange(data.id, 'tool', evt.target.value)}
        >
          <option value="nmap">Nmap Scan</option>
          <option value="sqlmap">SQLMap Injection</option>
          <option value="hydra">Hydra Brute Force</option>
          <option value="curl">Curl Request</option>
        </select>
        
        <div className="text-xs text-gray-400">Target/Args:</div>
        <input 
          type="text" 
          className="w-full bg-black border border-gray-700 text-white text-xs p-1 focus:border-neon-green outline-none font-mono"
          placeholder="-sV 10.10.0.5"
          defaultValue={data.args || ''}
          onChange={(evt) => data.onChange(data.id, 'args', evt.target.value)}
        />
      </div>

      <Handle type="target" position={Position.Top} className="!bg-neon-green !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-neon-green !w-3 !h-3" />
    </div>
  );
};

export default memo(ToolNode);