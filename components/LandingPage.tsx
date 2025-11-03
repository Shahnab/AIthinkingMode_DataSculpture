import React from 'react';

interface LandingPageProps {
  onEnterVisualization: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterVisualization }) => {
  return (
    <main className="w-screen h-screen bg-black text-white overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/15 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
        {/* Title */}
        <div className="mb-16">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight tracking-[0.15em] mb-8 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            AI
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-thin tracking-[0.25em] mb-4 text-gray-300">
            THINKING MODE
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
          <p className="text-sm md:text-base font-light tracking-[0.2em] text-gray-400 max-w-2xl">
            A CONCEPTUAL VISUALIZATION OF ARTIFICIAL INTELLIGENCE<br />
            COGNITIVE PROCESSES IN REAL-TIME
          </p>
        </div>

        {/* Enter button */}
        <div className="relative group cursor-pointer" onClick={onEnterVisualization}>
          {/* Button glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          
          {/* Main button */}
          <div className="relative px-12 py-4 border border-white/30 rounded-full bg-black/50 backdrop-blur-sm group-hover:border-white/60 transition-all duration-300">
            <span className="text-lg md:text-xl font-light tracking-[0.3em] text-white group-hover:text-white transition-colors duration-300">
              ENTER VISUALIZATION
            </span>
          </div>

          {/* Button connecting lines */}
          <div className="absolute top-1/2 -left-16 w-12 h-px bg-gradient-to-r from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
          <div className="absolute top-1/2 -right-16 w-12 h-px bg-gradient-to-l from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
        </div>

        {/* Subtitle */}
        <p className="mt-12 text-xs font-light tracking-[0.2em] text-gray-500">
          CLICK TO INITIALIZE COGNITIVE INTERFACE
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs tracking-wider text-gray-600">
        <p>~Shahnab~</p>
      </div>
      <div className="absolute bottom-8 right-8 text-right text-xs tracking-wider text-gray-600">
        <p>HCMC, 22-10-2025</p>
      </div>

      {/* Audio notice */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="flex items-center gap-2 text-xs tracking-wider text-gray-500 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>AUDIO ENABLED EXPERIENCE</span>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;