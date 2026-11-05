import React, { useState } from 'react';
import { Sparkles, Heart, ZoomIn, X, Camera } from 'lucide-react';

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
  rotation: string;
}

interface PolaroidGalleryProps {
  photos: PhotoItem[];
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="memories-section" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Memories That Mean The World</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-4">
            Meri Sabse Pyari Wajah ✨
          </h2>

          <p className="font-body text-rose-800/80 max-w-lg mx-auto text-sm sm:text-base">
            Har ek tasveer mein sirf tumhari khubsurti nahi, meri poori duniya basi hai. Tap karo kisi bhi photo par!
          </p>
        </div>

        {/* Polaroid Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 pt-4 pb-8">
          {photos.map((item, idx) => {
            const isFailed = failedImages[item.id];
            // alternating tilts: -2deg, 2deg, -3deg, 3deg
            const tiltClass = item.rotation || (idx % 2 === 0 ? '-rotate-2' : 'rotate-2');

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className={`group relative cursor-pointer transform ${tiltClass} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 ease-out`}
              >
                {/* Polaroid Frame (Thick white border with extra bottom spacing) */}
                <div className="bg-white rounded-lg p-3 sm:p-4 pb-6 shadow-xl shadow-rose-900/10 border border-neutral-100 flex flex-col items-center">
                  {/* Photo area */}
                  <div className="relative w-full aspect-[4/5] rounded overflow-hidden bg-rose-50 mb-4 shadow-inner">
                    {!isFailed ? (
                      <img
                        src={item.url}
                        alt={item.caption}
                        onError={() => handleImageError(item.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-pink-50 text-rose-400">
                        <Camera className="w-10 h-10 mb-2 opacity-70" />
                        <span className="text-xs font-sans text-rose-600 text-center">
                          Add photo: photo{item.id}.jpg
                        </span>
                      </div>
                    )}

                    {/* Subtle tape effect at top */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-100/70 border-t border-b border-amber-200/50 backdrop-blur-xs transform -rotate-1 shadow-xs pointer-events-none" />

                    {/* Hover zoom icon */}
                    <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Handwritten-style caption in 'Dancing Script' font */}
                  <p className="font-handwriting text-xl sm:text-2xl text-rose-900 text-center leading-tight tracking-wide px-1">
                    {item.caption}
                  </p>
                </div>

                {/* Little cute corner heart sticker */}
                <div className="absolute -bottom-2 -right-2 text-xl filter drop-shadow-md transform group-hover:scale-125 transition-transform">
                  ❤️
                </div>
              </div>
            );
          })}
        </div>

        {/* Polaroid Note Hint */}
        <div className="text-center mt-4 text-xs sm:text-sm text-rose-700/70 font-sans flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
          <span>Photos automatically straighten up when you hover or tap on them</span>
        </div>
      </div>

      {/* Lightbox / Expanded Polaroid Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-md w-full bg-white rounded-2xl p-4 sm:p-6 pb-8 shadow-2xl border-4 border-white transform scale-100 animate-scaleUp relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:bg-rose-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-rose-50 mb-4 shadow-inner">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl text-rose-950 text-center font-bold">
              {selectedPhoto.caption}
            </p>

            <p className="text-center text-xs text-rose-500 mt-2 font-sans">
              "Kyunki tumhare bina meri koi bhi tasveer mukammal nahi..."
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
