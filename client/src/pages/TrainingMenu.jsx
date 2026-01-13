import React from 'react';
import { useNavigate } from 'react-router-dom';
import { modules } from '../data/modules';
import HackerCard from '../components/HackerCard';

const TrainingMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl text-neon-green font-bold mb-2">{'>>'} TRAINING_MODULES</h1>
        <p className="text-gray-400 mb-10 border-b border-gray-700 pb-4">Select a simulation to begin initialization sequence.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              onClick={() => navigate(`/lab/${mod.id}`)}
              className="group cursor-pointer relative"
            >
              <div className="absolute inset-0 bg-neon-green opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"></div>
              
              <HackerCard title={`[${mod.difficulty.toUpperCase()}]`} className="h-full border-gray-700 group-hover:border-neon-green transition-colors">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="text-5xl text-gray-500 group-hover:text-neon-green mb-4 transition-colors">
                    {mod.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{mod.description}</p>
                  <span className="text-neon-green text-xs font-bold border border-neon-green px-2 py-1">
                    INITIALIZE {'>>'}
                  </span>
                </div>
              </HackerCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingMenu;