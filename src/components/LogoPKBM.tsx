import React, { useState } from 'react';
import { MASTER_LEMBAGA } from '../data/lembagaConfig';
import { GraduationCap } from 'lucide-react';

interface LogoPKBMProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textVariant?: 'light' | 'dark' | 'auto';
  className?: string;
  imageClassName?: string;
}

export const LogoPKBM: React.FC<LogoPKBMProps> = ({
  size = 'md',
  showText = false,
  textVariant = 'auto',
  className = '',
  imageClassName = ''
}) => {
  const [imgError, setImgError] = useState(false);
  const [useFallbackUrl, setUseFallbackUrl] = useState(false);

  // Size mappings
  const sizeMap = {
    xs: { box: 'w-7 h-7', textTitle: 'text-xs', textSub: 'text-[9px]' },
    sm: { box: 'w-9 h-9', textTitle: 'text-sm', textSub: 'text-[10px]' },
    md: { box: 'w-11 h-11', textTitle: 'text-base', textSub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', textTitle: 'text-lg', textSub: 'text-xs' },
    xl: { box: 'w-20 h-20', textTitle: 'text-xl', textSub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const textColorClass =
    textVariant === 'light'
      ? 'text-white'
      : textVariant === 'dark'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  const subTextColorClass =
    textVariant === 'light'
      ? 'text-amber-300'
      : textVariant === 'dark'
      ? 'text-slate-500'
      : 'text-slate-500 dark:text-slate-400';

  const imageSrc = useFallbackUrl
    ? MASTER_LEMBAGA.logo.thumbnail_url
    : MASTER_LEMBAGA.logo.primary_url;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${currentSize.box} rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
      >
        {!imgError ? (
          <img
            src={imageSrc}
            alt={MASTER_LEMBAGA.nama}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
              if (!useFallbackUrl) {
                setUseFallbackUrl(true);
              } else {
                setImgError(true);
              }
            }}
            className={`w-full h-full object-contain rounded-xl transition-all duration-200 ${imageClassName}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap className="w-2/3 h-2/3" />
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-tight min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`font-black tracking-tight ${currentSize.textTitle} ${textColorClass} truncate`}>
              {MASTER_LEMBAGA.nama}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider shrink-0">
              NPSN: {MASTER_LEMBAGA.npsn}
            </span>
          </div>
          <p className={`${currentSize.textSub} ${subTextColorClass} font-medium mt-0.5 truncate`}>
            {MASTER_LEMBAGA.tagline} • {MASTER_LEMBAGA.subjudul}
          </p>
        </div>
      )}
    </div>
  );
};
