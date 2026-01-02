import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test the connection to the backend
    api.get('/')
      .then((response) => {
        setStatus(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("System Failure:", error);
        setStatus({ status: "offline", system: "Connection Refused" });
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-950 text-green-500">
      <div className="border border-green-500 p-8 shadow-[0_0_20px_rgba(0,255,65,0.3)] bg-black max-w-md w-full">
        <h1 className="text-2xl font-bold tracking-widest mb-4 uppercase border-b border-green-800 pb-2">
          LogicLock System
        </h1>
        
        {loading ? (
          <div className="animate-pulse">INITIALIZING UPLINK...</div>
        ) : (
          <div className="space-y-2 font-mono">
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className={status.status === 'online' ? "text-green-400" : "text-red-500"}>
                [{status.status?.toUpperCase()}]
              </span>
            </div>
            <div className="flex justify-between">
              <span>CORE:</span>
              <span>{status.system}</span>
            </div>
            <div className="flex justify-between">
              <span>VERSION:</span>
              <span>{status.version || 'UNKNOWN'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;