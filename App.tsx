import React, { useState, useEffect, useRef } from 'react';
import Globe from './components/Globe';
import InfoBox from './components/InfoBox';
import LandingPage from './components/LandingPage';
import MuteButton from './components/MuteButton';
import { useAudioPlayer } from './hooks/useAudioPlayer';

// Helper function to generate a new random signature hash
const generateSignature = () => {
  const chars = '0123456789abcdef';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)];
    part2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `LVS-42-${part1}...${part2}`;
};

const App: React.FC = () => {
  // App state
  const [showVisualization, setShowVisualization] = useState(false);
  
  // Audio setup - handle dynamic base path
  const getAudioPath = () => {
    // In development (localhost), Vite serves from root, in production from base path
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isDev ? '/audio/gpu.mp3' : '/AIthinkingMode_DataSculpture/audio/gpu.mp3';
  };
  
  const audioPath = getAudioPath();
  
  const { play, toggleMute, isMuted, isLoaded } = useAudioPlayer(audioPath);
  
  // State for dynamic values
  const [cycles, setCycles] = useState(3141592);
  const [synthesisMinutes, setSynthesisMinutes] = useState(7680);
  const [signature, setSignature] = useState('LVS-42-b3d0...a1f7');
  const [latentDimensions, setLatentDimensions] = useState(32768);

  const cyclesRef = useRef(cycles);
  const synthesisMinutesRef = useRef(synthesisMinutes);
  const latentDimensionsRef = useRef(latentDimensions);

  // Animate Cognitive Cycles with a high-frequency loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      // Add a large random number to simulate rapid processing
      cyclesRef.current += Math.floor(Math.random() * 80000) + 20000;
      // Reset to avoid overflow and keep numbers in a similar range
      if (cyclesRef.current > 9999999) {
        cyclesRef.current = 3141592;
      }
      setCycles(cyclesRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Animate Exploration Time continuously
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      synthesisMinutesRef.current += 1;
      setSynthesisMinutes(synthesisMinutesRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  
  // Animate Latent Dimensions continuously
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      latentDimensionsRef.current += Math.floor(Math.random() * 3) + 1;
       if (latentDimensionsRef.current > 33000) {
        latentDimensionsRef.current = 32768;
      }
      setLatentDimensions(latentDimensionsRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Generate a new Cognitive Signature every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSignature(generateSignature());
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle entering visualization
  const handleEnterVisualization = async () => {
    setShowVisualization(true);
    if (isLoaded) {
      try {
        await play();
      } catch (error) {
        console.warn('Audio autoplay blocked or failed:', error);
      }
    }
  };

  // Show landing page first
  if (!showVisualization) {
    return <LandingPage onEnterVisualization={handleEnterVisualization} />;
  }

  // Show main visualization
  return (
    <main className="w-screen h-screen bg-black text-white font-mono relative overflow-hidden select-none">
      <Globe />
      
      <div className="absolute inset-0 pointer-events-none p-8">
        {/* Title Overlay */}
        <div className="absolute top-4 right-4 text-right">
            <p className="text-xs tracking-widest">AI DATA SCULPTURES</p>
            <p className="text-4xl tracking-[0.05em] mt-2">THINKING MODE</p>
            <p className="text-4xl tracking-[0.05em]">CONCEPTUAL VISUALIZATION</p>
        </div>

        {/* Info Boxes & Connectors */}
        <div className="absolute top-[30%] left-[15%] pointer-events-auto flex items-center gap-2">
          <InfoBox label="MODEL" value="Gemini 2.5 Pro" />
          <div className="w-32 h-px bg-white/50 relative">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-[65%] left-[20%] pointer-events-auto flex items-center gap-2">
           <InfoBox label="LATENT DIMENSIONS" value={`${latentDimensions.toLocaleString()} VECTORS`} />
           <div className="w-16 h-px bg-white/50 relative">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-[35%] right-[15%] pointer-events-auto flex flex-row-reverse items-center gap-2">
          <InfoBox label="COGNITIVE STATE" value="Thinking Mode" className="text-right" />
          <div className="w-40 h-px bg-white/50 relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-[50%] right-[12%] pointer-events-auto flex flex-row-reverse items-center gap-2">
           <InfoBox label="COGNITIVE CYCLES" value={cycles.toLocaleString()} className="text-right" />
           <div className="w-48 h-px bg-white/50 relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute top-[65%] right-[15%] pointer-events-auto flex flex-row-reverse items-center gap-2">
          <InfoBox label="EXPLORATION TIME" value={`${synthesisMinutes.toLocaleString()} Minutes `} className="text-right" />
          <div className="w-32 h-px bg-white/50 relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-[80%] right-[10%] pointer-events-auto flex flex-row-reverse items-center gap-2">
          <InfoBox label="COGNITIVE SIGNATURE" value={signature} className="text-right" />
          <div className="w-96 h-px bg-white/50 relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-sm tracking-wider">
          <p>~Shahnab~</p>
        </div>
        <div className="absolute bottom-8 right-20 text-right text-sm tracking-wider">
          <p>HCMC, 22-10-2025</p>
        </div>
      </div>

      {/* Mute Button */}
      <MuteButton 
        isMuted={isMuted} 
        onToggleMute={toggleMute} 
        isVisible={showVisualization} 
      />
    </main>
  );
};

export default App;