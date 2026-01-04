import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import WebTerminal from '../components/WebTerminal';
import TerminalWindow from '../components/TerminalWindow';

const ArenaGame = () => {
  const { matchId, role } = useParams();
  const [containerId, setContainerId] = useState(null);
  const [targetHost, setTargetHost] = useState("");
  const [score, setScore] = useState({ red: 0, blue: 0, king: 'NEUTRAL' });

  // 1. Join Match on Mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.post('/arena/join', { match_id: matchId, role });
        setContainerId(res.data.container_id);
        setTargetHost(res.data.target_host);
      } catch (err) {
        alert("Failed to join match: " + err.message);
      }
    };
    init();
  }, []);

  // 2. Poll Score every 1s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/arena/score/${matchId}`);
        setScore({
            red: res.data.red_score, 
            blue: res.data.blue_score, 
            king: res.data.current_king 
        });
      } catch (e) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <div className="h-screen w-screen bg-gray-900 p-4 flex flex-col gap-4 font-mono overflow-hidden">
      
      {/* SCOREBOARD */}
      <div className="h-20 bg-black border-b border-gray-700 flex items-center justify-between px-10">
        <div className="text-red-500 text-4xl font-bold">{score.red}</div>
        <div className="flex flex-col items-center">
            <div className="text-gray-500 text-xs tracking-widest">CURRENT KING</div>
            <div className={`text-2xl font-bold ${score.king === 'RED' ? 'text-red-500' : score.king === 'BLUE' ? 'text-blue-500' : 'text-gray-400'}`}>
                {score.king}
            </div>
            <div className="text-gray-600 text-xs mt-1">TARGET: {targetHost}</div>
        </div>
        <div className="text-blue-500 text-4xl font-bold">{score.blue}</div>
      </div>

      {/* TERMINAL */}
      <div className="flex-1 min-h-0">
        <TerminalWindow title={`ARENA UPLINK :: ${role.toUpperCase()} TEAM`}>
            {containerId ? (
                <div className="w-full h-full bg-black">
                     <WebTerminal containerId={containerId} />
                </div>
            ) : (
                <div className="text-white p-10">CONNECTING TO ARENA...</div>
            )}
        </TerminalWindow>
      </div>

      {/* HINT */}
      <div className="text-center text-xs text-gray-500">
        COMMAND: <span className="text-white">redis-cli -h {targetHost} SET king {role.toUpperCase()}</span>
      </div>

    </div>
  );
};

export default ArenaGame;