import React from 'react';

interface ReelFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const ReelFlowLogo: React.FC<ReelFlowLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconBoxSize =
    size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : size === 'lg'
      ? 'w-10 h-10 rounded-2xl'
      : 'w-8 h-8 rounded-xl';

  const textSizes =
    size === 'sm'
      ? 'text-xs sm:text-sm'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-sm sm:text-base';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ReelFlow Distinct Product Logo Icon */}
      <div
        className={`${iconBoxSize} bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25 shrink-0`}
      >
        <svg className="w-1/2 h-1/2 fill-current" viewBox="0 0 24 24">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-4 8l-4 4V8l4 4z" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className={`${textSizes} font-black tracking-tight text-white leading-none`}>
          ReelFlow
        </span>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-1 flex items-center gap-1">
            by{' '}
            <img
              src="/Icon Only .png"
              alt="Aurex Digitals"
              className="w-3 h-3 object-contain inline opacity-85"
            />{' '}
            Aurex Digitals
          </span>
        )}
      </div>
    </div>
  );
};
