/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialConfig } from './data/defaultConfig';
import { SiteConfig } from './types';
import { audioPlayer } from './utils/audio';
import { getMediaItem } from './utils/mediaStorage';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { BackgroundHearts } from './components/BackgroundHearts';
import { FloatingMusicBar } from './components/FloatingMusicBar';
import { HeroSection } from './components/HeroSection';
import { PolaroidGallery } from './components/PolaroidGallery';
import { ApologyCards } from './components/ApologyCards';
import { MaanJaoGame } from './components/MaanJaoGame';
import { CustomizeModal } from './components/CustomizeModal';
import { Heart, Sparkles, SlidersHorizontal, Music2, Camera, Upload } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('apology_site_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return initialConfig;
  });

  const [hasOpenedSurprise, setHasOpenedSurprise] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'details' | 'music' | 'photos'>('photos');

  // Load custom media from IndexedDB on startup (song & photos)
  useEffect(() => {
    async function loadCustomMedia() {
      try {
        const savedSong = await getMediaItem('custom_song');
        const savedHero = await getMediaItem('hero_photo');

        const updatedPhotos = [...config.photos];
        let hasPhotoChanges = false;

        for (let i = 0; i < updatedPhotos.length; i++) {
          const savedPolaroid = await getMediaItem(`polaroid_${i}`);
          if (savedPolaroid) {
            updatedPhotos[i] = { ...updatedPhotos[i], url: savedPolaroid };
            hasPhotoChanges = true;
          }
        }

        if (savedSong || savedHero || hasPhotoChanges) {
          setConfig(prev => ({
            ...prev,
            songUrl: savedSong || prev.songUrl,
            heroPhoto: savedHero || prev.heroPhoto,
            photos: hasPhotoChanges ? updatedPhotos : prev.photos
          }));
        }
      } catch (err) {
        console.warn('Could not load custom media from IndexedDB', err);
      }
    }

    loadCustomMedia();
  }, []);

  // Initialize audio player with configured song URL
  useEffect(() => {
    audioPlayer.init(config.songUrl);
  }, [config.songUrl]);

  const handleSaveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      // Save configuration metadata
      const jsonToStore = {
        ...newConfig,
        // Keep small references in localStorage
        songUrl: newConfig.songUrl.startsWith('data:') ? 'custom_uploaded_song' : newConfig.songUrl,
        heroPhoto: newConfig.heroPhoto.startsWith('data:') ? 'custom_hero_photo' : newConfig.heroPhoto,
        photos: newConfig.photos.map(p => ({
          ...p,
          url: p.url.startsWith('data:') ? `custom_polaroid_${p.id}` : p.url
        }))
      };
      localStorage.setItem('apology_site_config', JSON.stringify(jsonToStore));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  };

  const scrollToMemories = () => {
    const el = document.getElementById('memories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openUploadModal = (tab: 'details' | 'music' | 'photos') => {
    setModalTab(tab);
    setIsCustomizeOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF0F5] text-[#33202A] selection:bg-rose-200 selection:text-rose-900 font-body">
      {/* 1. Welcome Screen Overlay */}
      {!hasOpenedSurprise && (
        <WelcomeOverlay
          herName={config.herName}
          songTitle={config.songTitle}
          onOpen={() => setHasOpenedSurprise(true)}
        />
      )}

      {/* 2. Floating Heart Particles */}
      <BackgroundHearts />

      {/* 3. Romantic Top Header with Direct Upload Actions */}
      <header className="sticky top-0 z-30 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/75 backdrop-blur-md border-b border-white/80 transition-all shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-300 flex items-center justify-center text-rose-600">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            </span>
            <span className="font-display font-bold text-sm sm:text-lg text-rose-950 tracking-tight">
              Maan Jao Na ❤️
            </span>
          </div>

          {/* Quick Links & Upload / Customize Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Upload Song & Photos Button */}
            <button
              onClick={() => openUploadModal('photos')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer font-sans"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Images & Song</span>
            </button>

            <button
              onClick={() => openUploadModal('music')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer font-sans"
              title="Change Background Song"
            >
              <Music2 className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Song</span>
            </button>

            <button
              onClick={() => openUploadModal('details')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer font-sans"
              title="Settings & Names"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Section 1: Hero Section */}
        <HeroSection
          herName={config.herName}
          heroPhoto={config.heroPhoto}
          onScrollToNext={scrollToMemories}
        />

        {/* Section 2: Her Photos & Memories */}
        <PolaroidGallery photos={config.photos} />

        {/* Section 3: Interactive Apology Cards */}
        <ApologyCards cards={config.cards} />

        {/* Section 4: The "Maan Jao Na" Interactive Game */}
        <MaanJaoGame
          herName={config.herName}
          senderName={config.senderName}
          favoriteTreat={config.favoriteTreat}
        />
      </main>

      {/* Romantic Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-rose-200/50 bg-white/40 backdrop-blur-xs mt-12">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-rose-500">
            <Heart className="w-4 h-4 fill-rose-500" />
            <Sparkles className="w-4 h-4" />
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>

          <p className="font-display font-medium text-rose-950 text-base">
            Hamesha sirf tumhara, <span className="text-rose-600 font-bold">{config.senderName}</span>
          </p>

          <p className="font-handwriting text-2xl text-rose-800">
            "Tum meri aadat nahi, meri ibaadat ho..."
          </p>

          <div className="pt-2">
            <button
              onClick={() => openUploadModal('photos')}
              className="text-xs text-rose-600 hover:text-rose-800 underline font-sans cursor-pointer inline-flex items-center gap-1"
            >
              <Camera className="w-3 h-3" />
              <span>Click here to change custom song or photos anytime</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Music Bar Widget */}
      <FloatingMusicBar
        songTitle={config.songTitle}
        onOpenSettings={() => openUploadModal('music')}
      />

      {/* Customization & Upload Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        initialTab={modalTab}
      />
    </div>
  );
}
