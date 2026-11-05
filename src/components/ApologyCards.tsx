import React, { useState } from 'react';
import { Sparkles, Heart, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  quote: string;
  fullMessage: string;
}

interface ApologyCardsProps {
  cards: CardItem[];
}

export const ApologyCards: React.FC<ApologyCardsProps> = ({ cards }) => {
  // Store flipped card IDs
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="apology-section" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Dil Ki Gehraiyon Se</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-4">
            Mere Dil Ke Teen Sach ❤️
          </h2>

          <p className="font-body text-rose-800/80 max-w-lg mx-auto text-sm sm:text-base">
            Har card ko tap karke dekho, isme sirf alfaz nahi, mera sachha pachtawa aur mera waada hai.
          </p>
        </div>

        {/* 3-Grid Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const isFlipped = !!flipped[card.id];

            return (
              <div
                key={card.id}
                className="relative h-[360px] sm:h-[400px] [perspective:1000px] cursor-pointer group"
                onClick={() => toggleFlip(card.id)}
              >
                {/* 3D Flip Card Container */}
                <div
                  className={`relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 [backface-visibility:hidden] glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/80 shadow-xl group-hover:border-rose-300/80 transition-all">
                    {/* Top Pill & Icon */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs uppercase tracking-widest font-bold text-rose-500 font-sans">
                          Part 0{idx + 1}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shadow-sm transform group-hover:scale-110 transition-transform">
                          {card.icon}
                        </div>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
                        {card.title}
                      </h3>

                      <p className="font-body text-sm text-rose-800/80 mb-4 font-medium">
                        {card.subtitle}
                      </p>

                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100/80 text-rose-900 text-sm italic font-display">
                        "{card.quote}"
                      </div>
                    </div>

                    {/* Bottom CTA to flip */}
                    <div className="pt-4 border-t border-rose-100/70 flex items-center justify-between text-xs sm:text-sm font-semibold text-rose-600 font-sans">
                      <span className="flex items-center gap-1">
                        <RotateCcw className="w-3.5 h-3.5" /> Tap to read full letter
                      </span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* BACK SIDE (Flipped) */}
                  <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-br from-white via-rose-50/90 to-pink-50/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-rose-300 shadow-2xl overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{card.icon}</span>
                          <span className="font-display font-bold text-lg text-rose-950">
                            {card.title}
                          </span>
                        </div>
                        <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-sans">
                          Dil Se
                        </span>
                      </div>

                      <div className="h-0.5 w-12 bg-rose-400 rounded-full mb-4" />

                      <p className="font-body text-sm sm:text-base text-rose-900 leading-relaxed font-normal">
                        {card.fullMessage}
                      </p>
                    </div>

                    {/* Bottom Flip back */}
                    <div className="pt-4 mt-4 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-600 font-sans">
                      <span className="flex items-center gap-1 font-medium">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Hamesha tumhara
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 hover:text-rose-700">
                        <RotateCcw className="w-3 h-3" /> Flip back
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cute summary reminder */}
        <div className="mt-12 text-center">
          <p className="font-handwriting text-2xl sm:text-3xl text-rose-800">
            "Ek chhoti si galti se hamara itna pyara rishta kamzor nahi ho sakta..."
          </p>
        </div>
      </div>
    </section>
  );
};
