import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n, SUPPORTED_LANGUAGES, LanguageCode } from '../../services/i18n';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown' | 'inline';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { language, setLanguage, currentOption } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              language === lang.code
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Bahasa / Change Language"
        className="flex items-center gap-1.5 p-3 sm:px-2.5 sm:py-1.5 min-h-12 sm:min-h-0 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-850 hover:lg:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="hidden sm:inline font-medium">{currentOption.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pilih Bahasa / Language</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 space-y-0.5 px-1 custom-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <p className="leading-tight">{lang.nativeName}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        {lang.name} {lang.dir === 'rtl' ? '(RTL)' : ''}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
