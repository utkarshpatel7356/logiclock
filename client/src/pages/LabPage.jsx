import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import TerminalWindow from '../components/TerminalWindow';
import HackerCard from '../components/HackerCard';
import GlitchText from '../components/GlitchText';
import { useParams } from 'react-router-dom';

const LabPage = () => {
  const { id } = useParams();
  const [labState, setLabState] = useState({
    loading: true,
    url: null,
    error: null
  });
  
  const containerIdRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let heartbeatInterval = null;

    const startLab = async () => {
      try {
        console.log("Initializing Lab Environment...");
        const response = await api.post('/lab/start', { image: 'nginx:alpine' });
        
        containerIdRef.current = response.data.container_id;
        
        setLabState({
          loading: false,
          url: response.data.url,
          error: null
        });

        // --- HEARTBEAT SYSTEM START ---
        // Ping the server every 5 seconds
        heartbeatInterval = setInterval(() => {
            if (containerIdRef.current) {
                api.post('/lab/heartbeat', { container_id: containerIdRef.current })
                   .catch(err => console.warn("Heartbeat failed", err));
            }
        }, 5000);

      } catch (err) {
        setLabState({ 
          loading: false, 
          url: null, 
          error: "CONNECTION REFUSED: " + (err.response?.data?.detail || err.message) 
        });
      }
    };

    startLab();

    // CLEANUP
    return () => {
      // 1. Stop the heartbeat timer
      if (heartbeatInterval) clearInterval(heartbeatInterval);

      // 2. Tell server we are leaving (Best Effort)
      if (containerIdRef.current) {
        console.log(`Stopping session ${containerIdRef.current}...`);
        api.post('/lab/stop', { container_id: containerIdRef.current }).catch(console.error);
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 p-4 text-green-400 font-mono overflow-hidden flex gap-4 box-border">
      
      {/* LEFT PANEL */}
      <div className="w-[40%] flex flex-col gap-4 min-w-0">
        <HackerCard title="MISSION BRIEFING" className="h-full flex flex-col min-h-0 bg-black/50">
          <div className="prose prose-invert prose-green max-w-none overflow-y-auto pr-2 custom-scrollbar flex-1">
             <div className="border-b border-red-500/30 pb-4 mb-4 sticky top-0 bg-gray-900/90 backdrop-blur z-10">
              <span className="bg-red-900 text-red-200 px-2 py-1 text-xs font-bold rounded">TOP SECRET</span>
              <span className="ml-2 text-xs text-gray-400">ID: {id || 'TRNG-001'}</span>
            </div>
            <GlitchText text="OBJECTIVE: RECONNAISSANCE" as="h2" className="text-xl font-bold mb-4 text-white" />
            <p className="mb-4">Agent, access the target interface and identify the vulnerability.</p>
          </div>
        </HackerCard>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[60%] flex flex-col gap-4 min-w-0">
        <div className="h-1/2 min-h-0">
          <TerminalWindow title="TARGET_UPLINK :: HTTP/1.1">
            <div className="w-full h-full min-h-[300px] bg-white rounded-sm overflow-hidden relative">
              {labState.loading ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="animate-pulse tracking-widest">ESTABLISHING CONNECTION...</div>
                </div>
              ) : labState.error ? (
                 <div className="absolute inset-0 bg-black flex items-center justify-center text-red-500">{labState.error}</div>
              ) : (
                <iframe src={labState.url} title="Target" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-forms" />
              )}
            </div>
          </TerminalWindow>
        </div>
        <div className="h-1/2 min-h-0">
          <TerminalWindow title="LOCAL_SHELL :: ROOT">
            <div className="w-full h-full bg-black min-h-[250px] p-2 font-mono text-sm text-green-500">
               root@kali:~$ _
            </div>
          </TerminalWindow>
        </div>
      </div>
    </div>
  );
};

export default LabPage;