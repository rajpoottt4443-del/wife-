import React, { useState } from 'react';
import { Heart, ChevronDown, Sparkles, AlertCircle } from 'lucide-react';

interface HeroSectionProps {
  herName: string;
  heroPhoto: string;
  onScrollToNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  herName,
  heroPhoto,
  onScrollToNext
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-10 pb-16 px-4">
      <div className="max-w-2xl w-full mx-auto">
        {/* Main Centered Frosted Glass Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 text-center relative border border-white/80 shadow-2xl glass-card-hover overflow-hidden">
          {/* Subtle floral/sparkle corner decorations */}
          <span className="absolute -top-3 -right-3 text-3xl opacity-60 pointer-events-none select-none">🌸</span>
          <span className="absolute -bottom-2 -left-2 text-3xl opacity-60 pointer-events-none select-none">✨</span>

          {/* Top romantic tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/70 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-medium tracking-wide mb-6">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>A Message Straight From The Heart</span>
          </div>

          {/* Glowing Circular Frame with Photo or Fallback Cute Illustration */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8">
            {/* Glowing gradient aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-600 blur-md opacity-70 animate-pulse" />
            
            {/* Frame container */}
            <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-rose-500 via-pink-300 to-rose-400 shadow-xl overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-rose-50 flex items-center justify-center">
                {!imgError ? (
                  <img
                    src={heroPhoto}
                    alt={herName}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-rose-500">
                    <Heart className="w-12 h-12 fill-rose-400 text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-handwriting text-rose-700 mt-1">For {herName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Little floating heart badge on avatar */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-4 tracking-tight leading-tight">
            I'm Really Sorry, <span className="text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-8">{herName}</span> ❤️
          </h1>

          {/* Subtext */}
          <p className="font-body text-base sm:text-lg text-rose-900/85 leading-relaxed max-w-lg mx-auto mb-8 font-normal">
            Mujhe pata hai tum naraz ho, aur meri galti bhi hai. Par tumhari smile ke bina sab adhoora lagta hai.
          </p>

          {/* Emotional Quote Pill */}
          <div className="p-3.5 sm:p-4 mb-8 rounded-2xl bg-rose-50/70 border border-rose-100 text-rose-800 text-sm italic font-display">
            "Tum naraz hoti ho toh hawa bhi ruk si jaati hai... Ek baar meri baat sun toh lo."
          </div>

          {/* Smooth Glowing Button: "Mere Dil Ki Baat Suno ↓" */}
          <button
            onClick={onScrollToNext}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 rounded-full shadow-lg shadow-rose-500/25 hover:shadow-rose-500/45 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer glow-rose"
          >
            <span>Mere Dil Ki Baat Suno</span>
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
