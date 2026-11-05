import React, { useState } from 'react';
import { Heart, Music, Sparkles } from 'lucide-react';
import { audioPlayer } from '../utils/audio';

interface WelcomeOverlayProps {
  onOpen: () => void;
  herName?: string;
  songTitle?: string;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  onOpen,
  herName = "Meri Jaan",
  songTitle = "Tum Se Hi"
}) => {
  const [isFading, setIsFading] = useState(false);

  const handleOpen = async () => {
    // Start audio trigger on user gesture
    await audioPlayer.play();
    setIsFading(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ${
        isFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 240, 245, 0.94) 0%, rgba(254, 226, 226, 0.92) 50%, rgba(253, 242, 248, 0.96) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Decorative ambient elements */}
      <div className="absolute top-12 left-12 w-24 h-24 rounded-full bg-rose-300/30 blur-2xl animate-pulse" />
      <div className="absolute bottom-16 right-16 w-36 h-36 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl border border-white/90">
        {/* Soft top badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-medium tracking-wide mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Khas Sirf {herName} Ke Liye</span>
        </div>

        {/* Pulsing Glowing Heart Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-75" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 transform hover:scale-105 transition-transform duration-300">
            <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
          </div>
        </div>

        {/* Main Welcome Text */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950 mb-3 tracking-tight leading-snug">
          Ek Chota Sa Surprise Tumhare Liye ❤️
        </h1>

        <p className="text-rose-800/80 text-sm sm:text-base leading-relaxed font-body mb-8">
          Dil se ek chhoti si koshish tumhare pyare se chehre par wapas muskaan laane ke liye...
        </p>

        {/* Tap to Open glowing romantic button */}
        <button
          onClick={handleOpen}
          className="group relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-2xl shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden glow-rose"
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Music className="w-5 h-5 animate-bounce" />
          <span className="tracking-wide">Tap to Open 🎵</span>
          <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform" />
        </button>

        <p className="mt-4 text-xs text-rose-600/70 flex items-center justify-center gap-1.5 font-sans">
          <span>🎧 Headphone recommended for the best experience</span>
        </p>
      </div>
    </div>
  );
};
