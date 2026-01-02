import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import TerminalWindow from '../components/TerminalWindow';
import HackerCard from '../components/HackerCard';
import GlitchText from '../components/GlitchText';
import { useParams } from 'react-router-dom';
import WebTerminal from '../components/WebTerminal';

const LabPage = () => {
  const { id } = useParams();
  const [labState, setLabState] = useState({
    loading: true,
    url: null,
    error: null
  });
  
  // Track which panel is active for the "Green Highlight" effect
  const [activePanel, setActivePanel] = useState('briefing'); // 'briefing', 'target', 'terminal'

  const containerIdRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startLab = async () => {
        try {
          console.log("Initializing Lab Environment...");
          const response = await api.post('/lab/start', { image: 'nginx:alpine' });
          
          // 1. Store in Ref (For Cleanup reliability)
          containerIdRef.current = response.data.container_id;
          
          // 2. Store in State (For UI Rendering - THIS WAS MISSING)
          setLabState({
            loading: false,
            url: response.data.url,
            containerId: response.data.container_id, // <--- ADD THIS LINE
            error: null
          });
  
          // Start Heartbeat
          setInterval(() => {
              if (containerIdRef.current) {
                  api.post('/lab/heartbeat', { container_id: containerIdRef.current })
                     .catch(err => console.warn("Heartbeat failed", err));
              }
          }, 5000);
  
        } catch (err) {
          setLabState({ 
            loading: false, 
            url: null, 
            containerId: null,
            error: "CONNECTION REFUSED: " + (err.response?.data?.detail || err.message) 
          });
        }
      };

    startLab();
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 p-4 text-green-400 font-mono overflow-hidden flex gap-4 box-border">
      
      {/* LEFT PANEL: Mission Brief */}
      <div 
        className={`w-[40%] flex flex-col gap-4 min-w-0 transition-all duration-300 ${activePanel === 'briefing' ? 'opacity-100 scale-[1.01]' : 'opacity-80'}`}
        onClick={() => setActivePanel('briefing')}
      >
        <HackerCard 
            title="MISSION BRIEFING" 
            className={`h-full flex flex-col min-h-0 bg-black/50 ${activePanel === 'briefing' ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'border-green-900'}`}
        >
          {/* Added 'relative' to fix overlapping issues */}
          <div className="prose prose-invert prose-green max-w-none overflow-y-auto pr-2 custom-scrollbar flex-1 relative">
            
            <div className="border-b border-red-500/30 pb-4 mb-4 sticky top-0 bg-gray-900/95 backdrop-blur z-20">
              <span className="bg-red-900 text-red-200 px-2 py-1 text-xs font-bold rounded">TOP SECRET</span>
              <span className="ml-2 text-xs text-gray-400">ID: {id || 'TRNG-001'}</span>
            </div>
            
            <GlitchText text="OBJECTIVE: RECONNAISSANCE" as="h2" className="text-xl font-bold mb-4 text-white" />
            
            <p className="mb-4 text-sm leading-relaxed">
              Agent, we have identified a vulnerable web server hosted by a target organization. 
              Your objective is to access the public interface and identify the server version.
            </p>
            
            <h3 className="text-lg font-bold text-neon-green mt-6 mb-2">INSTRUCTIONS:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
              <li>Wait for the target Uplink (Right Panel) to establish.</li>
              <li>Verify the website loads correctly.</li>
              <li>Open your terminal below.</li>
              <li>Use standard reconnaissance tools to inspect the HTTP headers.</li>
            </ul>

            <div className="mt-8 p-4 border border-green-500/20 bg-green-500/5 rounded text-xs">
              <p className="opacity-70">Hint: Inspect the 'Server' header in the HTTP response.</p>
            </div>
            
            <div className="h-10"></div>
          </div>
        </HackerCard>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[60%] flex flex-col gap-4 min-w-0">
        
        {/* Top: Target View */}
        <div 
            className={`h-1/2 min-h-0 transition-opacity duration-300 ${activePanel === 'target' ? 'opacity-100' : 'opacity-80'}`}
            onClick={() => setActivePanel('target')}
        >
          <TerminalWindow title="TARGET_UPLINK :: HTTP/1.1">
            {/* FIX: Changed bg-white to bg-black */}
            <div className="w-full h-full min-h-[300px] bg-black rounded-sm overflow-hidden relative border border-gray-800">
              {labState.loading ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="animate-pulse tracking-widest">ESTABLISHING CONNECTION...</span>
                  </div>
                </div>
              ) : labState.error ? (
                 <div className="absolute inset-0 bg-black flex items-center justify-center text-red-500 p-4 text-center">
                   {labState.error}
                 </div>
              ) : (
                <iframe 
                  src={labState.url} 
                  title="Target"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms" 
                />
              )}
            </div>
          </TerminalWindow>
        </div>

        {/* Bottom: Terminal */}
        <div 
            className={`h-1/2 min-h-0 transition-opacity duration-300 ${activePanel === 'terminal' ? 'opacity-100' : 'opacity-80'}`}
            onClick={() => setActivePanel('terminal')}
        >
          <TerminalWindow title="LOCAL_SHELL :: ROOT">
            {/* 2. Replace the static div with this: */}
            <div className="w-full h-full bg-black min-h-[250px] p-2 overflow-hidden border border-gray-800">
               {/* Only mount terminal when we have a Container ID */}
               {labState.containerId ? (
                 <WebTerminal containerId={labState.containerId} />
               ) : (
                 <div className="h-full w-full flex items-center justify-center text-green-900 animate-pulse">
                   WAITING FOR CONTAINER...
                 </div>
               )}
            </div>
          </TerminalWindow>
        </div>
        
      </div>
    </div>
  );
};

export default LabPage;