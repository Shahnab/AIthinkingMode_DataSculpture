import React from 'react';

interface MuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isVisible: boolean;
}

const MuteButton: React.FC<MuteButtonProps> = ({ isMuted, onToggleMute, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onToggleMute}
        className="group relative p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full hover:border-white/40 transition-all duration-300"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {/* Button glow effect */}
        <div className="absolute -inset-1 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isMuted ? (
            // Muted icon (speaker with X)
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
            // Unmuted icon (speaker with sound waves)
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/20 whitespace-nowrap">
            {isMuted ? 'Unmute' : 'Mute'}
          </div>
        </div>
      </button>

      {/* Audio indicator */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-opacity duration-300 ${
        isMuted 
          ? 'bg-red-400 opacity-80' 
          : 'bg-green-400 opacity-60 animate-pulse'
      }`}></div>
    </div>
  );
};

export default MuteButton;