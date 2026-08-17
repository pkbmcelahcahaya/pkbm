import React from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface TextToSpeechButtonProps {
  text: string;
  title?: string;
  variant?: 'icon' | 'compact' | 'pill' | 'chip';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rate?: number;
  className?: string;
  showTooltip?: boolean;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  text,
  title = 'Materi Pembelajaran',
  variant = 'icon',
  size = 'sm',
  rate = 1.0,
  className = '',
  showTooltip = true
}) => {
  const { isPlaying, isPaused, currentText, speak, pause, resume, stop, isSupported } = useTextToSpeech();

  if (!isSupported || !text) {
    return null;
  }

  // Check if THIS specific button's text is currently playing
  const cleanedText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/[*_#`~[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isCurrentActive = currentText === cleanedText;
  const isCurrentlyPlaying = isCurrentActive && isPlaying;
  const isCurrentlyPaused = isCurrentActive && isPaused;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else if (isCurrentlyPaused) {
      resume();
    } else {
      speak(cleanedText, { title, rate });
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-3.5 h-3.5';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
    }
  };

  const getButtonPadding = () => {
    switch (size) {
      case 'xs': return 'p-1';
      case 'sm': return 'p-1.5';
      case 'md': return 'p-2';
      case 'lg': return 'p-2.5';
    }
  };

  const tooltipTitle = isCurrentlyPlaying
    ? 'Klik untuk jeda (Pause audio)'
    : isCurrentlyPaused
    ? 'Klik untuk lanjutkan mendengar'
    : 'Dengarkan teks (Text to Speech Suara Bahasa Indonesia)';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={showTooltip ? tooltipTitle : undefined}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none shadow-2xs ${
          isCurrentlyPlaying
            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-sm animate-pulse'
            : isCurrentlyPaused
            ? 'bg-amber-500 text-white'
            : 'bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
        } ${className}`}
      >
        {isCurrentlyPlaying ? (
          <>
            <Volume2 className={`${getIconSize()} animate-bounce`} />
            <span>Mendengarkan...</span>
            <span className="flex gap-0.5 items-end h-3 ml-1">
              <span className="w-0.5 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
              <span className="w-0.5 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
              <span className="w-0.5 bg-white rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
            </span>
          </>
        ) : isCurrentlyPaused ? (
          <>
            <Play className={getIconSize()} />
            <span>Lanjutkan</span>
          </>
        ) : (
          <>
            <Volume2 className={getIconSize()} />
            <span>Baca Teks</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={showTooltip ? tooltipTitle : undefined}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer select-none ${
          isCurrentlyPlaying
            ? 'bg-indigo-600 text-white shadow-xs'
            : isCurrentlyPaused
            ? 'bg-amber-500 text-white'
            : 'bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
        } ${className}`}
      >
        {isCurrentlyPlaying ? (
          <Volume2 className={`${getIconSize()} animate-bounce`} />
        ) : (
          <Volume2 className={getIconSize()} />
        )}
        <span>{isCurrentlyPlaying ? 'Jeda' : 'Audio'}</span>
      </button>
    );
  }

  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={showTooltip ? tooltipTitle : undefined}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] transition-colors cursor-pointer select-none ${
          isCurrentlyPlaying
            ? 'bg-indigo-600 text-white'
            : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
        } ${className}`}
      >
        <Volume2 className="w-3 h-3" />
        <span>TTS</span>
      </button>
    );
  }

  // Default: icon only
  return (
    <button
      type="button"
      onClick={handleClick}
      title={showTooltip ? tooltipTitle : undefined}
      className={`rounded-xl transition-all cursor-pointer select-none flex items-center justify-center ${
        getButtonPadding()
      } ${
        isCurrentlyPlaying
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/50 scale-105'
          : isCurrentlyPaused
          ? 'bg-amber-500 text-white'
          : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700'
      } ${className}`}
      aria-label="Bacakan teks dengan Text to Speech"
    >
      {isCurrentlyPlaying ? (
        <Volume2 className={`${getIconSize()} animate-pulse`} />
      ) : isCurrentlyPaused ? (
        <Play className={getIconSize()} />
      ) : (
        <Volume2 className={getIconSize()} />
      )}
    </button>
  );
};
