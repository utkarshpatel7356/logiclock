import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const LogicNode = ({ data }) => {
  return (
    <div className="bg-gray-900 border border-alert-red/50 p-2 rounded-md shadow-[0_0_10px_rgba(255,0,85,0.1)] min-w-[150px]">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-2">
        <span className="text-xs font-bold text-alert-red uppercase">LOGIC GATE</span>
        <div className="w-2 h-2 transform rotate-45 bg-alert-red"></div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-400">Condition:</div>
        <select 
          className="w-full bg-black border border-gray-700 text-white text-xs p-1 focus:border-alert-red outline-none"
          defaultValue={data.condition || 'port_open'}
        >
          <option value="port_open">If Port Open</option>
          <option value="vuln_found">If Vuln Found</option>
          <option value="status_200">If Status 200</option>
        </select>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-alert-red !w-3 !h-3 !rounded-none" />
      
      {/* Two outputs: True (Left), False (Right) */}
      <div className="absolute -bottom-1.5 left-4 text-[8px] text-green-500">TRUE</div>
      <Handle type="source" position={Position.Bottom} id="true" className="!bg-green-500 !left-6 !w-2 !h-2 !rounded-none" />
      
      <div className="absolute -bottom-1.5 right-4 text-[8px] text-red-500">FALSE</div>
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-500 !left-auto !right-6 !w-2 !h-2 !rounded-none" />
    </div>
  );
};

export default memo(LogicNode);