import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import HackerCard from '../components/HackerCard';

const ArenaLobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [joinId, setJoinId] = useState("");

  const createMatch = async () => {
    setLoading(true);
    try {
      const res = await api.post('/arena/create');
      // Auto-join as RED
      navigate(`/arena/${res.data.match_id}/red`);
    } catch (err) {
      alert("Failed to create match");
      setLoading(false);
    }
  };

  const joinMatch = (role) => {
    if (!joinId) return alert("Enter Match ID");
    navigate(`/arena/${joinId}/${role}`);
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center p-4 font-mono">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8">
        
        {/* CREATE PANEL */}
        <HackerCard title="HOST MATCH" className="border-neon-green">
          <div className="h-40 flex flex-col justify-center items-center gap-4">
            <p className="text-gray-400 text-center text-sm">
              Initialize a new King of the Hill server.<br/>
              Target: Redis (No Auth)
            </p>
            <button 
              onClick={createMatch} 
              disabled={loading}
              className="px-6 py-2 bg-neon-green text-black font-bold hover:bg-white transition-colors"
            >
              {loading ? "INITIALIZING..." : ">> DEPLOY SERVER"}
            </button>
          </div>
        </HackerCard>

        {/* JOIN PANEL */}
        <HackerCard title="JOIN UPLINK" className="border-alert-red">
          <div className="h-40 flex flex-col justify-center gap-4">
            <input 
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="ENTER MATCH ID (e.g. match_1234)"
              className="w-full bg-black border border-gray-700 p-2 text-white text-center focus:border-alert-red outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => joinMatch('red')} className="flex-1 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                JOIN RED
              </button>
              <button onClick={() => joinMatch('blue')} className="flex-1 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                JOIN BLUE
              </button>
            </div>
          </div>
        </HackerCard>

      </div>
    </div>
  );
};

export default ArenaLobby;