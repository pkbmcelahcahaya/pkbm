import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
  homeLabel?: string;
  showHome?: boolean;
  className?: string;
}

/**
 * Reusable Academic LMS Breadcrumb Navigation Component
 * Provides clean, chevron-separated breadcrumb navigation with Tailwind utility classes.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onHomeClick,
  homeLabel = 'Beranda',
  showHome = true,
  className = ''
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1.5 sm:space-x-2 text-xs text-gray-500 font-sans ${className}`}
    >
      {showHome && (
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onHomeClick ? (
            <button
              type="button"
              onClick={onHomeClick}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#172033] transition-colors cursor-pointer"
              title={homeLabel}
            >
              <Home className="w-3.5 h-3.5 text-gray-400 hover:text-[#172033]" />
              <span className="hidden sm:inline font-medium">{homeLabel}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-gray-500 font-medium">
              <Home className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline">{homeLabel}</span>
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
        </div>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.active;
        const targetUrl = item.path || item.href;

        return (
          <div key={index} className="flex items-center space-x-1.5 sm:space-x-2">
            {isLast ? (
              <span
                className="inline-flex items-center gap-1.5 font-semibold text-[#172033] truncate max-w-[200px] sm:max-w-[320px]"
                aria-current="page"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </span>
            ) : (
              <>
                {item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#172033] hover:underline font-medium transition-colors cursor-pointer truncate max-w-[140px] sm:max-w-[200px]"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </button>
                ) : targetUrl ? (
                  <a
                    href={targetUrl}
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#172033] hover:underline font-medium transition-colors truncate max-w-[140px] sm:max-w-[200px]"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-gray-500 truncate max-w-[140px] sm:max-w-[200px]">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
