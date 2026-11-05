import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, PartyPopper, Check, Utensils, MessageCircle, RefreshCw } from 'lucide-react';

interface MaanJaoGameProps {
  herName: string;
  senderName: string;
  favoriteTreat: string;
}

export const MaanJaoGame: React.FC<MaanJaoGameProps> = ({
  herName,
  senderName,
  favoriteTreat
}) => {
  const [hasForgiven, setHasForgiven] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [runawayPos, setRunawayPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playful evasion remarks
  const remarks = [
    "Arey pakad nahi sakti! 😜",
    "Itna gussa sehat ke liye achha nahi 🥺",
    "Haan wala button zyada pyara hai na? ❤️",
    "Button bhi bhaag raha hai, ab toh maan jao! 🏃‍♂️💨",
    "Meri jaan, please gussa chhod do na! 🌸",
    "Dekho 'Haan' button kitna wait kar raha hai ✨",
    "Nahi ka option hi nahi hai hamari kahani mein! ♾️",
    "Har baar bach jaunga, maan jao baba! 🥰"
  ];

  // Move runaway button to a random position safely within container bounds
  const moveRunawayButton = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // safe margin
    const buttonWidth = 180;
    const buttonHeight = 60;
    const maxX = Math.max(20, rect.width - buttonWidth - 20);
    const maxY = Math.max(20, rect.height - buttonHeight - 20);

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    setRunawayPos({ x: randomX, y: randomY });
    setDodgeCount(prev => prev + 1);
  };

  const triggerRomanticConfetti = () => {
    // Multi-stage confetti burst
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#E11D48', '#FB7185', '#FDA4AF', '#FFF1F2', '#F43F5E'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center big burst
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#BE123C', '#FDA4AF', '#FFE4E6']
    });
  };

  const handleForgive = () => {
    setHasForgiven(true);
    triggerRomanticConfetti();
  };

  const handleReset = () => {
    setHasForgiven(false);
    setDodgeCount(0);
    setRunawayPos(null);
  };

  // WhatsApp reply link
  const whatsappText = encodeURIComponent(
    `Aww! ❤️ Main maan gayi! Chalo ab jaldi se mujhe ${favoriteTreat} ke liye le chalo! 🍦✨`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <section id="game-section" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>The Moment Of Truth</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-3">
            Kya tumne mujhe maaf kiya? 🥺
          </h2>

          <p className="font-body text-rose-800/80 max-w-md mx-auto text-sm sm:text-base">
            Ek pyara sa faisla jo meri poori duniya badal dega. Soch samajh kar chunna!
          </p>
        </div>

        {/* Game Container */}
        <div
          ref={containerRef}
          className="relative min-h-[420px] sm:min-h-[440px] glass-panel rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center border border-white/90 shadow-2xl overflow-hidden"
        >
          {/* Floral background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-9xl">
            ❤️
          </div>

          {!hasForgiven ? (
            <div className="w-full flex flex-col items-center justify-center text-center">
              {/* Cute prompt avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-100 to-pink-200 border-2 border-white flex items-center justify-center text-4xl shadow-md mb-6 animate-bounce">
                🥺
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-rose-950 mb-3">
                Bas ek baar "Haan" keh do na...
              </h3>

              {dodgeCount > 0 && (
                <div className="mb-6 px-4 py-2 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-sm font-handwriting text-xl sm:text-2xl shadow-sm animate-pulse">
                  {remarks[(dodgeCount - 1) % remarks.length]}
                </div>
              )}

              {/* Action Buttons Zone */}
              <div className="relative w-full max-w-md min-h-[140px] flex items-center justify-center gap-4 sm:gap-6 mt-4">
                {/* YES BUTTON: "Haan, Maaf Kiya! ❤️" */}
                <button
                  onClick={handleForgive}
                  style={{
                    transform: `scale(${1 + Math.min(dodgeCount * 0.06, 0.4)})`
                  }}
                  className="group z-10 px-8 py-4 sm:px-10 sm:py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 glow-rose"
                >
                  <Heart className="w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform" />
                  <span className="text-base sm:text-lg tracking-wide">Haan, Maaf Kiya! ❤️</span>
                </button>

                {/* NO BUTTON: "Nahi, Abhi Bhi Gussa Hoon 😤" (Runaway button) */}
                <button
                  onMouseEnter={moveRunawayButton}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    moveRunawayButton();
                  }}
                  onClick={moveRunawayButton}
                  style={
                    runawayPos
                      ? {
                          position: 'absolute',
                          left: `${runawayPos.x}px`,
                          top: `${runawayPos.y}px`,
                          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }
                      : {
                          position: 'relative'
                        }
                  }
                  className="z-20 px-5 py-3 sm:px-6 sm:py-3.5 bg-white/90 hover:bg-white text-rose-800 font-medium rounded-2xl border border-rose-200 shadow-md text-sm whitespace-nowrap cursor-pointer select-none transition-all duration-200"
                >
                  <span>Nahi, Abhi Bhi Gussa Hoon 😤</span>
                </button>
              </div>

              {dodgeCount > 0 && (
                <p className="mt-8 text-xs text-rose-500/70 font-sans">
                  Pakarne ki koshish: {dodgeCount} baar 🙈 (Nahi wala button kabhi click nahi hone wala!)
                </p>
              )}
            </div>
          ) : (
            /* SUCCESS STATE: "Yayy! Thank you meri jaan! Chalo ab jaldi se [Uski Favorite Cheez] ke liye ready ho jao! ❤️" */
            <div className="w-full text-center py-4 animate-scaleUp">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/30 mb-6 animate-bounce">
                <PartyPopper className="w-10 h-10" />
              </div>

              <span className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-700 text-xs uppercase tracking-widest font-bold mb-3 font-sans">
                Best News Ever! 🎉
              </span>

              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-4 leading-tight">
                Yayy! Thank you {herName}! ❤️
              </h3>

              <p className="font-body text-base sm:text-lg text-rose-900 max-w-xl mx-auto mb-8 leading-relaxed">
                Chalo ab jaldi se <span className="font-bold text-rose-600 underline decoration-rose-400">{favoriteTreat}</span> ke liye ready ho jao! Tumhare chehre par ye muskaan hi meri sabse badi daulat hai.
              </p>

              {/* Romantic Coupon Card / Treat Voucher */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-white via-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-dashed border-rose-300 shadow-lg relative mb-8 text-left">
                {/* Decorative cutouts on coupon sides */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F5] border-r-2 border-dashed border-rose-300" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F5] border-l-2 border-dashed border-rose-300" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-rose-600" />
                    <span className="font-bold text-rose-950 text-sm font-sans uppercase tracking-wider">
                      Official Date Coupon
                    </span>
                  </div>
                  <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    VALID FOREVER
                  </span>
                </div>

                <h4 className="font-display text-xl font-bold text-rose-900 mb-1">
                  1x {favoriteTreat} Date Pass 🍦✨
                </h4>
                <p className="text-xs text-rose-700 mb-3 font-sans">
                  Issued with infinite love by {senderName} for {herName}
                </p>

                <div className="border-t border-rose-200/70 pt-3 flex items-center justify-between text-xs text-rose-600 font-sans">
                  <span>Includes: Unlimited Hugs & Zero Arguments</span>
                  <span className="font-bold">No Expiry ♾️</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Share & Re-test */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send "Main Maan Gayi" on WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-sm font-medium transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
