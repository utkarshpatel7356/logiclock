import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import Pages
import LabPage from './pages/LabPage';
import ChainBuilder from './components/ChainBuilder';
import ArenaLobby from './pages/ArenaLobby';
import ArenaGame from './pages/ArenaGame';
import TrainingMenu from './pages/TrainingMenu';

// Import Components
import GlitchText from './components/GlitchText';

const Home = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-green-400 font-mono p-4">
    <div className="max-w-4xl w-full text-center space-y-8">
      
      {/* Title Section */}
      <div className="border border-green-500/30 p-10 bg-black/40 backdrop-blur relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 bg-cover mix-blend-overlay pointer-events-none"></div>
        
        <GlitchText text="LOGICLOCK" className="text-6xl font-bold mb-2 tracking-tighter" />
        <p className="text-xl text-gray-400 mb-8">CYBER SECURITY BATTLEGROUNDS</p>
        
        {/* Menu Grid - Now with 3 Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Training Modules */}
          <Link to="/training" className="block group/btn relative">
            <div className="absolute inset-0 bg-neon-green opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
            <div className="h-full border border-green-500/50 p-4 hover:border-green-400 transition-colors flex flex-col justify-center">
              <h3 className="font-bold text-lg">{'>>'} ACADEMY</h3>
              <p className="text-xs text-gray-500 mt-2">Guided Learning Modules</p>
            </div>
          </Link>
          
          {/* 2. Automation Builder */}
          <Link to="/builder" className="block group/btn relative">
             <div className="absolute inset-0 bg-alert-red opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
             <div className="h-full border border-gray-700 p-4 hover:border-alert-red transition-colors flex flex-col justify-center">
                <h3 className="font-bold text-lg text-gray-300 group-hover/btn:text-alert-red">{'>>'} BUILDER</h3>
                <p className="text-xs text-gray-500 mt-2">Visual Script Editor</p>
             </div>
          </Link>

          {/* 3. Multiplayer Arena */}
          <Link to="/arena" className="block group/btn relative">
             <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
             <div className="h-full border border-gray-700 p-4 hover:border-blue-500 transition-colors flex flex-col justify-center">
                <h3 className="font-bold text-lg text-gray-300 group-hover/btn:text-blue-500">{'>>'} ARENA</h3>
                <p className="text-xs text-gray-500 mt-2">PvP Wargames</p>
             </div>
          </Link>

        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Training Routes */}
        <Route path="/training" element={<TrainingMenu />} />
        <Route path="/lab/:id" element={<LabPage />} />
        
        {/* Arena Routes */}
        <Route path="/arena" element={<ArenaLobby />} />
        <Route path="/arena/:matchId/:role" element={<ArenaGame />} />

        {/* Builder Route */}
        <Route path="/builder" element={
            <div className="h-screen w-screen bg-gray-900 p-8 flex flex-col box-border">
                <h1 className="text-2xl text-neon-green font-mono mb-4 border-b border-green-800 pb-2">
                  {'>>'} ATTACK_CHAIN_BUILDER_v2.0
                </h1>
                <ChainBuilder />
            </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;