import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';
import ToolNode from './nodes/ToolNode';
import LogicNode from './nodes/LogicNode';
import api from '../api';

const nodeTypes = {
  tool: ToolNode,
  logic: LogicNode,
};

const initialNodes = [
  { 
    id: '1', 
    type: 'tool', 
    position: { x: 250, y: 50 }, 
    data: { label: 'Initial Scan', tool: 'nmap', args: '-sV -p- 192.168.1.5' } 
  },
];

const ChainBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [compiling, setCompiling] = useState(false);
  
  // State for the Result Modal
  const [generatedScript, setGeneratedScript] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const onNodeDataChange = useCallback((id, key, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          data: { ...node.data, [key]: value, onChange: onNodeDataChange },
        };
      })
    );
  }, [setNodes]);

  const nodesWithHandler = nodes.map(node => ({
      ...node,
      data: { ...node.data, onChange: onNodeDataChange }
  }));

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
      ...params, 
      animated: true, 
      style: { stroke: '#00ff41', strokeWidth: 2 }
  }, eds)), [setEdges]);

  const addNode = (type) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label: `New ${type}`, 
        onChange: onNodeDataChange,
        tool: type === 'tool' ? 'nmap' : undefined
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const payload = { nodes, edges };
      const res = await api.post('/api/generate-script', payload);
      setGeneratedScript(res.data.script);
      setShowModal(true);
    } catch (err) {
      alert("COMPILATION FAILED: " + err.message);
    } finally {
      setCompiling(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert("Copied to clipboard!");
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden relative">
      
      {/* 1. Toolbar */}
      <div className="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={() => addNode('tool')} className="px-3 py-1 bg-terminal-gray border border-neon-green text-neon-green text-xs font-bold hover:bg-neon-green hover:text-black transition-colors">
            + ADD TOOL
          </button>
          <button onClick={() => addNode('logic')} className="px-3 py-1 bg-terminal-gray border border-alert-red text-alert-red text-xs font-bold hover:bg-alert-red hover:text-white transition-colors">
            + ADD LOGIC
          </button>
        </div>
        <button 
          onClick={handleCompile}
          disabled={compiling}
          className="px-4 py-1 bg-neon-green text-black font-bold text-xs hover:bg-white transition-colors disabled:opacity-50"
        >
          {compiling ? 'COMPILING...' : 'GENERATE PAYLOAD >>'}
        </button>
      </div>

      {/* 2. Canvas */}
      <div className="flex-1 min-h-[500px]">
        <ReactFlow
          nodes={nodesWithHandler}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#333" gap={20} size={1} />
          <Controls className="bg-gray-800 border border-gray-700 fill-white text-white" />
        </ReactFlow>
      </div>

      {/* 3. The "Hacker" Modal (New Feature) */}
      {showModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-10">
          <div className="w-full max-w-3xl bg-gray-900 border border-neon-green shadow-[0_0_50px_rgba(0,255,65,0.2)] flex flex-col max-h-full">
            
            {/* Modal Header */}
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
              <span className="text-neon-green font-mono font-bold">{'>>'} GENERATED_PAYLOAD.sh</span>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                [X] CLOSE
              </button>
            </div>
            
            {/* Modal Body (Code) */}
            <div className="flex-1 overflow-auto p-4 bg-black">
              <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap leading-relaxed">
                {generatedScript}
              </pre>
            </div>
            
            {/* Modal Footer */}
            <div className="p-3 border-t border-gray-700 flex justify-end gap-2">
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-800 border border-gray-600 text-white text-xs hover:border-neon-green hover:text-neon-green"
              >
                COPY CODE
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-neon-green text-black text-xs font-bold hover:bg-white"
              >
                DEPLOY TO TARGET
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChainBuilder;