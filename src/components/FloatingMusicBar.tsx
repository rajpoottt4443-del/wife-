import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { audioPlayer } from '../utils/audio';

interface FloatingMusicBarProps {
  songTitle: string;
  onOpenSettings?: () => void;
}

export const FloatingMusicBar: React.FC<FloatingMusicBarProps> = ({
  songTitle,
  onOpenSettings
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsub = audioPlayer.subscribe((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(audioPlayer.isPlaying());
    return unsub;
  }, []);

  const handleTogglePlay = () => {
    audioPlayer.toggle();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      audioPlayer.setVolume(0.7);
      setIsMuted(false);
    } else {
      audioPlayer.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass-panel rounded-full px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 sm:gap-4 shadow-xl border border-white/90 bg-white/80 hover:bg-white/95 transition-all">
        {/* Spinning Vinyl Disk */}
        <div className="relative flex-shrink-0 cursor-pointer" onClick={handleTogglePlay} title="Click to Play/Pause">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-slate-900 via-rose-950 to-slate-900 p-1 flex items-center justify-center shadow-md transition-transform ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            {/* Vinyl grooves pattern */}
            <div className="w-full h-full rounded-full border border-rose-300/30 flex items-center justify-center bg-radial from-rose-900/60 to-black/80">
              <div className="w-4 h-4 rounded-full bg-rose-500 border border-white/80 flex items-center justify-center">
                <Disc className="w-2.5 h-2.5 text-white/90" />
              </div>
            </div>
          </div>
          {/* Status badge */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              isPlaying ? 'bg-emerald-500' : 'bg-rose-400'
            }`}
          />
        </div>

        {/* Song Info & Soundwave bars */}
        <div className="flex flex-col min-w-[110px] max-w-[160px] sm:max-w-[200px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-sans">
              Romantic Vibes
            </span>
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3 ml-1">
                <span className="w-0.5 bg-rose-500 rounded-full wave-bar-1" />
                <span className="w-0.5 bg-rose-500 rounded-full wave-bar-2" />
                <span className="w-0.5 bg-rose-500 rounded-full wave-bar-3" />
                <span className="w-0.5 bg-rose-500 rounded-full wave-bar-4" />
              </div>
            )}
          </div>
          <span 
            className="text-xs sm:text-sm font-semibold text-rose-950 truncate font-display" 
            title={songTitle}
          >
            {songTitle}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all shadow-md shadow-rose-600/30 active:scale-90 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Edit Song Button if handler provided */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-[11px] font-sans text-rose-600/80 hover:text-rose-700 underline px-1 cursor-pointer hidden sm:inline-block"
              title="Change Song or Photos"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
