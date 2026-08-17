import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ChevronUp,
  ChevronDown,
  Gauge,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

export const FloatingTtsPlayer: React.FC = () => {
  const {
    isPlaying,
    isPaused,
    isIdle,
    currentText,
    currentTitle,
    rate,
    pause,
    resume,
    stop,
    setRate,
    isSupported
  } = useTextToSpeech();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!isSupported || isIdle) {
    return null;
  }

  const speedPresets = [
    { label: '0.75×', desc: 'Lambat', value: 0.75 },
    { label: '1×', desc: 'Normal', value: 1.0 },
    { label: '1.25×', desc: 'Cepat', value: 1.25 },
    { label: '1.5×', desc: 'Sangat Cepat', value: 1.5 }
  ];

  return (
    <aside
      id="floating-tts-player"
      aria-label="Panel Kontrol Pembaca Suara (TTS)"
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-[70] max-w-[calc(100vw-1.5rem)] sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-500/40 p-3 sm:p-4 flex flex-col gap-2.5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/40">
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  Pembaca Suara Modul
                </span>
                <span className="px-1.5 py-0.5 bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 rounded text-[9px] font-semibold">
                  Bahasa Indonesia
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate max-w-[190px] sm:max-w-[240px]">
                {currentTitle || 'Materi Pembelajaran'}
              </h4>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id="tts-btn-toggle-minimize"
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? 'Perluas Panel' : 'Perkecil Panel'}
              aria-label={isMinimized ? 'Perluas Panel' : 'Perkecil Panel'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              id="tts-btn-close-header"
              type="button"
              onClick={stop}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Hentikan & Tutup Audio"
              aria-label="Hentikan & Tutup Audio"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Controls View */}
        {!isMinimized ? (
          <>
            {/* Snippet Preview */}
            <div className="bg-slate-800/90 dark:bg-slate-900/90 rounded-xl p-2.5 text-[11px] text-slate-300 line-clamp-2 leading-relaxed border border-slate-700/60 shadow-inner">
              <span className="italic">"{currentText}"</span>
            </div>

            {/* Playback Controls & Speed Options */}
            <div className="flex flex-col gap-2 pt-1.5 border-t border-slate-800">
              {/* Direct Speed Presets Selector */}
              <div className="flex items-center justify-between gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-750">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold px-1.5">
                  <Gauge className="w-3 h-3 text-indigo-400" />
                  <span className="hidden sm:inline">Speed:</span>
                </div>
                <div className="flex items-center gap-1 flex-1 justify-end">
                  {speedPresets.map((preset) => {
                    const isActive = Math.abs(rate - preset.value) < 0.05;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setRate(preset.value)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-1 ring-indigo-400/50'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                        }`}
                        title={`Kecepatan ${preset.label} (${preset.desc})`}
                      >
                        <span>{preset.label}</span>
                        <span className="hidden md:inline text-[9px] opacity-75 font-normal">
                          {preset.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Waveform & Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                {/* Waveform / Status Indicator */}
                <div className="flex items-center gap-2">
                  {isPlaying ? (
                    <div className="flex items-end gap-1 h-4 px-1" title="Sedang membacakan teks">
                      <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2.5" />
                      <span className="w-1 bg-indigo-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
                      <span className="w-1 bg-indigo-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
                      <span className="w-1 bg-indigo-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                      <span className="text-[10px] text-indigo-300 font-medium ml-1 hidden sm:inline">Memutar</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-[10px] text-amber-300 font-medium">Dijeda</span>
                    </div>
                  )}
                </div>

                {/* Main Action Buttons: Play/Pause, Stop */}
                <div className="flex items-center gap-2">
                  {isPlaying ? (
                    <button
                      id="tts-btn-pause"
                      type="button"
                      onClick={pause}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-amber-500/20"
                      title="Jeda Suara (Pause)"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      id="tts-btn-play"
                      type="button"
                      onClick={resume}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-indigo-600/30"
                      title="Lanjutkan Membaca (Play)"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </button>
                  )}

                  <button
                    id="tts-btn-stop"
                    type="button"
                    onClick={stop}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 active:bg-rose-900 text-slate-300 hover:text-rose-200 border border-slate-700 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                    title="Hentikan Audio (Stop)"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Minimized Compact Bar with Quick Presets Cycle */
          <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
            <span className="text-slate-300 truncate max-w-[130px] sm:max-w-[170px] font-medium text-[11px]">
              {isPlaying ? '▶ Membaca...' : '⏸ Dijeda'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const presetValues = [0.75, 1.0, 1.25, 1.5];
                  const currentIdx = presetValues.findIndex(v => Math.abs(v - rate) < 0.05);
                  const nextIdx = (currentIdx + 1) % presetValues.length;
                  setRate(presetValues[nextIdx]);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold rounded-lg border border-slate-700 cursor-pointer"
                title="Klik untuk ubah kecepatan (0.75x -> 1x -> 1.25x -> 1.5x)"
              >
                {rate}×
              </button>

              {isPlaying ? (
                <button
                  type="button"
                  onClick={pause}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resume}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Play
                </button>
              )}

              <button
                type="button"
                onClick={stop}
                className="px-2 py-1 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-[11px] font-bold rounded-lg border border-slate-700 cursor-pointer"
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
