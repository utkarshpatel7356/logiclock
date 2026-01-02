import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LabPage from './pages/LabPage';
import GlitchText from './components/GlitchText';

const Home = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-green-400 font-mono p-4">
    <div className="max-w-2xl w-full text-center space-y-8">
      <div className="border border-green-500/30 p-10 bg-black/40 backdrop-blur relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 bg-cover mix-blend-overlay pointer-events-none"></div>
        
        <GlitchText text="LOGICLOCK" className="text-6xl font-bold mb-2 tracking-tighter" />
        <p className="text-xl text-gray-400 mb-8">CYBER SECURITY BATTLEGROUNDS</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/lab/SQL-101" className="block group/btn relative">
            <div className="absolute inset-0 bg-neon-green opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
            <div className="border border-green-500/50 p-4 hover:border-green-400 transition-colors">
              {/* FIXED: Wrapped arrows in braces */}
              <h3 className="font-bold text-lg">{'>>'} START TRAINING</h3>
              <p className="text-xs text-gray-500 mt-2">Initialize Sandbox Environment</p>
            </div>
          </Link>
          
          <div className="border border-gray-700 p-4 opacity-50 cursor-not-allowed">
             {/* FIXED: Wrapped arrows in braces */}
             <h3 className="font-bold text-lg">{'>>'} MULTIPLAYER ARENA</h3>
             <p className="text-xs text-gray-500 mt-2">LOCKED (Level 5 Required)</p>
          </div>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;