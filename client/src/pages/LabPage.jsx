import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Get ID from URL
import { modules } from '../data/modules'; // Import Data
import api from '../api';
import WebTerminal from '../components/WebTerminal';
import TerminalWindow from '../components/TerminalWindow';

const LabPage = () => {
  const { id } = useParams(); // Get "linux-101" etc.
  
  // 1. Find the module data based on URL
  const activeModule = modules.find(m => m.id === id);

  const [containerId, setContainerId] = useState(null);
  const [status, setStatus] = useState("booting");

  useEffect(() => {
    if (!activeModule) return; // Safety check

    const startLab = async () => {
      try {
        // 2. Send the specific image for this module to the backend
        const res = await api.post('/lab/start', { image: activeModule.image });
        setContainerId(res.data.container_id);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    startLab();
    
    // Cleanup handled by backend heartbeat failure, 
    // but we can add explicit stop on unmount if we want.
  }, [activeModule]);

  // Heartbeat loop (Same as before)
  useEffect(() => {
    if (!containerId) return;
    const interval = setInterval(() => api.post('/lab/heartbeat', { container_id: containerId }), 5000);
    return () => clearInterval(interval);
  }, [containerId]);

  if (!activeModule) return <div className="text-red-500 p-10">MODULE NOT FOUND</div>;

  return (
    <div className="h-screen w-screen bg-gray-900 flex overflow-hidden font-mono text-gray-300">
      
      {/* LEFT PANEL: Dynamic Instructions */}
      <div className="w-1/3 border-r border-gray-700 bg-black flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <h2 className="text-xl font-bold text-white">{activeModule.title}</h2>
          <span className="text-xs text-neon-green uppercase tracking-widest">Objective Active</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Render HTML Guide Safely */}
          <div dangerouslySetInnerHTML={{ __html: activeModule.guide }} />

          <div className="mt-8 border-t border-gray-800 pt-4">
            <h4 className="text-neon-green font-bold mb-2">CHECKLIST:</h4>
            <ul className="space-y-2">
              {activeModule.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <input type="checkbox" className="mt-1 accent-neon-green" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Terminal */}
      <div className="w-2/3 bg-gray-900 p-4 flex flex-col">
        <TerminalWindow title={`ROOT@${activeModule.image.toUpperCase()}`}>
           {status === 'ready' && containerId ? (
             <WebTerminal containerId={containerId} />
           ) : (
             <div className="flex items-center justify-center h-full text-neon-green animate-pulse">
               {'>>'} INITIALIZING CONTAINER ENVIRONMENT...
             </div>
           )}
        </TerminalWindow>
      </div>
      
    </div>
  );
};

export default LabPage;