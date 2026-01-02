import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LabPage from './pages/LabPage';
import GlitchText from './components/GlitchText';
import ChainBuilder from './components/ChainBuilder';

const Home = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-green-400 font-mono p-4">
    <div className="max-w-2xl w-full text-center space-y-8">
      <div className="border border-green-500/30 p-10 bg-black/40 backdrop-blur relative overflow-hidden group">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 bg-cover mix-blend-overlay pointer-events-none"></div>
        
        <GlitchText text="LOGICLOCK" className="text-6xl font-bold mb-2 tracking-tighter" />
        <p className="text-xl text-gray-400 mb-8">CYBER SECURITY BATTLEGROUNDS</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Lab */}
          <Link to="/lab/SQL-101" className="block group/btn relative">
            <div className="absolute inset-0 bg-neon-green opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
            <div className="border border-green-500/50 p-4 hover:border-green-400 transition-colors">
              <h3 className="font-bold text-lg">{'>>'} START TRAINING</h3>
              <p className="text-xs text-gray-500 mt-2">Initialize Sandbox Environment</p>
            </div>
          </Link>
          
          {/* Card 2: Builder (Unlocked) */}
          <Link to="/builder" className="block group/btn relative border border-gray-700 p-4 hover:border-alert-red transition-colors">
             <div className="absolute inset-0 bg-alert-red opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
             <h3 className="font-bold text-lg text-gray-300 group-hover/btn:text-alert-red">{'>>'} AUTOMATION BUILDER</h3>
             <p className="text-xs text-gray-500 mt-2">Design Attack Workflows (BETA)</p>
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
        <Route path="/" element={<Home />} />
        
        <Route path="/lab/:id" element={<LabPage />} />
        
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