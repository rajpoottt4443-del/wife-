import React, { useState, useRef } from 'react';
import { X, Sparkles, Music, Image as ImageIcon, Heart, Check, Upload, Play, Pause, Trash2, Camera, RefreshCw } from 'lucide-react';
import { SiteConfig } from '../types';
import { audioPlayer } from '../utils/audio';
import { saveMediaItem } from '../utils/mediaStorage';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSave: (newConfig: SiteConfig) => void;
  initialTab?: 'details' | 'music' | 'photos';
}

const SONG_PRESETS = [
  {
    title: "Tum Se Hi (Romantic Piano Lofi)",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3"
  },
  {
    title: "Acoustic Love Guitar Melody",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitar-love-10906.mp3"
  },
  {
    title: "Pehla Nasha (Music Box Chimes)",
    url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=piano-moment-9835.mp3"
  },
  {
    title: "Public folder song (/song.mp3)",
    url: "/song.mp3"
  }
];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  initialTab = 'photos'
}) => {
  const [formData, setFormData] = useState<SiteConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'details' | 'music' | 'photos'>(initialTab);
  const [isAudioTesting, setIsAudioTesting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const heroPhotoInputRef = useRef<HTMLInputElement>(null);
  const polaroidInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  // Handle local song file upload
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Loading song file...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Save in IndexedDB for fast reloads without quota errors
        await saveMediaItem('custom_song', dataUrl);
        const fileNameClean = file.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({
          ...prev,
          songTitle: fileNameClean || "My Special Song ❤️",
          songUrl: dataUrl
        }));
        setUploadStatus(`Uploaded: ${file.name}`);
        setTimeout(() => setUploadStatus(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local hero image upload
  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await saveMediaItem('hero_photo', dataUrl);
        setFormData(prev => ({
          ...prev,
          heroPhoto: dataUrl
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Polaroid individual photo uploads
  const handlePolaroidUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await saveMediaItem(`polaroid_${index}`, dataUrl);
        const updatedPhotos = [...formData.photos];
        updatedPhotos[index] = {
          ...updatedPhotos[index],
          url: dataUrl
        };
        setFormData(prev => ({
          ...prev,
          photos: updatedPhotos
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTestAudioToggle = () => {
    if (isAudioTesting) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setIsAudioTesting(false);
    } else {
      if (!previewAudioRef.current) {
        previewAudioRef.current = new Audio();
      }
      previewAudioRef.current.src = formData.songUrl;
      previewAudioRef.current.volume = 0.8;
      previewAudioRef.current.play()
        .then(() => setIsAudioTesting(true))
        .catch(err => {
          console.warn('Audio preview error', err);
          alert('Could not preview this audio file. Please check format (MP3 recommended).');
        });
      previewAudioRef.current.onended = () => setIsAudioTesting(false);
    }
  };

  const handleSave = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    onSave(formData);
    audioPlayer.setSong(formData.songUrl);
    onClose();
  };

  const handleSelectSongPreset = (preset: { title: string; url: string }) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsAudioTesting(false);
    }
    setFormData(prev => ({
      ...prev,
      songTitle: preset.title,
      songUrl: preset.url
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-rose-950/70 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-200" />
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl leading-tight">
                Custom Song & Photos 📸🎵
              </h3>
              <p className="text-[11px] text-rose-100 font-sans">
                Upload your favorite song and romantic memories
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (previewAudioRef.current) previewAudioRef.current.pause();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-rose-100 bg-rose-50/60 px-4 sm:px-6 pt-2.5 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-rose-600 text-rose-700 bg-white/60 rounded-t-lg'
                : 'border-transparent text-rose-500 hover:text-rose-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Upload Photos ({formData.photos.length + 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'music'
                ? 'border-rose-600 text-rose-700 bg-white/60 rounded-t-lg'
                : 'border-transparent text-rose-500 hover:text-rose-700'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Upload Song (MP3)</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-rose-600 text-rose-700 bg-white/60 rounded-t-lg'
                : 'border-transparent text-rose-500 hover:text-rose-700'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Names & Promises</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 font-sans text-sm">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Hero Circular Avatar Upload */}
              <div className="p-4 rounded-2xl border-2 border-rose-100 bg-gradient-to-r from-rose-50/60 to-pink-50/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-rose-950 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    Hero Photo (Top Circle Frame)
                  </span>
                  <span className="text-[11px] text-rose-500 font-medium">Shows at top</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rose-300 shadow-md flex-shrink-0 bg-white">
                    <img
                      src={formData.heroPhoto}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={heroPhotoInputRef}
                        accept="image/*"
                        onChange={handleHeroPhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroPhotoInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm cursor-pointer transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Photo From Phone/PC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroPhoto: "/hero.jpg" })}
                        className="text-xs text-rose-700 hover:underline px-2 py-1"
                        title="Use /hero.jpg in public folder"
                      >
                        Use /hero.jpg
                      </button>
                    </div>

                    <input
                      type="text"
                      value={formData.heroPhoto}
                      onChange={e => setFormData({ ...formData, heroPhoto: e.target.value })}
                      placeholder="Or paste an Image URL here"
                      className="w-full px-3 py-1.5 rounded-lg border border-rose-200 text-xs bg-white text-rose-950"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Polaroid Photos Uploads */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-rose-950 font-display text-base">
                    Polaroid Memory Photos (Section 2)
                  </h4>
                  <span className="text-xs text-rose-600">4 Polaroid Frames</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.photos.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-rose-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          Polaroid #{item.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.photos];
                            updated[idx].url = `/photo${item.id}.jpg`;
                            setFormData({ ...formData, photos: updated });
                          }}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Use /photo{item.id}.jpg
                        </button>
                      </div>

                      {/* Photo Thumbnail + Upload Button */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-rose-200 bg-rose-50 flex-shrink-0 shadow-inner">
                          <img
                            src={item.url}
                            alt={`Photo ${item.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="file"
                            ref={el => {
                              polaroidInputRefs.current[idx] = el;
                            }}
                            accept="image/*"
                            onChange={e => handlePolaroidUpload(idx, e)}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => polaroidInputRefs.current[idx]?.click()}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium cursor-pointer transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-rose-500" />
                            <span>Upload Image</span>
                          </button>
                        </div>
                      </div>

                      {/* URL input fallback */}
                      <input
                        type="text"
                        value={item.url.startsWith('data:') ? 'Custom Uploaded Photo (Saved)' : item.url}
                        onChange={e => {
                          const updated = [...formData.photos];
                          updated[idx].url = e.target.value;
                          setFormData({ ...formData, photos: updated });
                        }}
                        placeholder={`URL or photo${item.id}.jpg`}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-rose-100 text-[11px] bg-rose-50/40 text-rose-900 truncate"
                      />

                      {/* Handwritten Caption */}
                      <div>
                        <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                          Polaroid Caption (Dancing Script font):
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={e => {
                            const updated = [...formData.photos];
                            updated[idx].caption = e.target.value;
                            setFormData({ ...formData, photos: updated });
                          }}
                          placeholder="e.g. Tumhari ye smile meri jaan hai ❤️"
                          className="w-full px-3 py-1.5 rounded-lg border border-rose-200 text-xs bg-white text-rose-950 font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
                💡 <strong>Tip:</strong> You can upload photos directly from your phone gallery or laptop storage! They will be automatically saved and displayed inside the romantic Polaroid frames.
              </div>
            </div>
          )}

          {/* TAB 2: SONG / MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              {/* Direct Audio File Upload Box */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                  <Music className="w-6 h-6 animate-bounce" />
                </div>

                <div>
                  <h4 className="font-bold text-rose-950 text-base">
                    Select Your Song From Device (MP3 / Audio)
                  </h4>
                  <p className="text-xs text-rose-700/80 mt-1">
                    Upload your favorite romantic song file from your phone or PC.
                  </p>
                </div>

                <input
                  type="file"
                  ref={audioFileInputRef}
                  accept="audio/*,.mp3,.m4a,.wav,.ogg"
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/30 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Song File (.mp3)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestAudioToggle}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold shadow-xs cursor-pointer transition-all"
                  >
                    {isAudioTesting ? (
                      <>
                        <Pause className="w-4 h-4 text-rose-600" />
                        <span>Stop Test</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
                        <span>Preview / Test Song</span>
                      </>
                    )}
                  </button>
                </div>

                {uploadStatus && (
                  <p className="text-xs font-medium text-emerald-600 animate-pulse">
                    {uploadStatus}
                  </p>
                )}
              </div>

              {/* Song Title Input */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-rose-950 mb-1">
                    Display Song Name (Shows in the Vinyl Bar)
                  </label>
                  <input
                    type="text"
                    value={formData.songTitle}
                    onChange={e => setFormData({ ...formData, songTitle: e.target.value })}
                    placeholder="e.g. Tum Se Hi, Kesariya, Pehla Nasha..."
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-rose-950 mb-1">
                    Or Direct Song URL / Path
                  </label>
                  <input
                    type="text"
                    value={formData.songUrl.startsWith('data:') ? 'Custom Uploaded Audio File (Ready)' : formData.songUrl}
                    onChange={e => setFormData({ ...formData, songUrl: e.target.value })}
                    placeholder="e.g. /song.mp3 or https://..."
                    className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 bg-white text-xs truncate"
                  />
                </div>
              </div>

              {/* Preset Songs */}
              <div>
                <span className="block font-semibold text-rose-950 mb-2">
                  Or Pick a Preset Romantic Song:
                </span>
                <div className="space-y-2">
                  {SONG_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSongPreset(preset)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        formData.songTitle === preset.title
                          ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                          : 'border-rose-100 hover:border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Music className="w-4 h-4 text-rose-500" />
                        <span className="text-xs sm:text-sm">{preset.title}</span>
                      </div>
                      {formData.songTitle === preset.title && (
                        <Check className="w-4 h-4 text-rose-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-rose-950 mb-1">
                  Her Name or Nickname
                </label>
                <input
                  type="text"
                  value={formData.herName}
                  onChange={e => setFormData({ ...formData, herName: e.target.value })}
                  placeholder="e.g. Meri Jaan, Simran, Sara, Priya..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-950 mb-1">
                  Your Name / Signature
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="e.g. Tera Pagal, Rahul, Raj..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-950 mb-1">
                  Her Favorite Treat / Date Activity
                </label>
                <input
                  type="text"
                  value={formData.favoriteTreat}
                  onChange={e => setFormData({ ...formData, favoriteTreat: e.target.value })}
                  placeholder="e.g. Ice Cream & Long Drive, Chocolate Waffles, Pizza..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 bg-white"
                />
                <p className="text-xs text-rose-600/80 mt-1">
                  This will be shown on the official apology date pass after she forgives you!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-rose-100 flex items-center justify-between">
          <span className="text-xs text-rose-600/80 hidden sm:inline">
            Changes save instantly to your browser!
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => {
                if (previewAudioRef.current) previewAudioRef.current.pause();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-100 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-md shadow-rose-600/30 cursor-pointer transition-all"
            >
              Save & Apply Changes ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
