import React from 'react';
import { Creator } from '../../types';

interface CreatorAvatarProps {
  creator?: Creator;
  creators?: Creator[];
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
}

export const CreatorAvatar: React.FC<CreatorAvatarProps> = ({
  creator,
  creators,
  size = 'md',
  showNames = false
}) => {
  const sizeMap = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm'
  };

  const borderClass = 'border-2 border-slate-900';

  // Multi Creator Stack rendering
  if (creators && creators.length > 0) {
    const displayList = creators.slice(0, 3);
    const extraCount = creators.length - displayList.length;

    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2 overflow-hidden shrink-0">
          {displayList.map((c, idx) => (
            <div
              key={c.id || idx}
              className={`relative inline-block rounded-full overflow-hidden bg-slate-700 text-white font-semibold ${sizeMap[size]} ${borderClass}`}
              title={`${c.name} (@${c.username})`}
            >
              {c.profileImage ? (
                <img
                  src={c.profileImage}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on image load error
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 text-white font-bold uppercase -z-10">
                {c.name.charAt(0)}
              </div>
            </div>
          ))}
          {extraCount > 0 && (
            <div
              className={`flex items-center justify-center rounded-full bg-slate-800 text-gray-300 font-semibold ${sizeMap[size]} ${borderClass}`}
            >
              +{extraCount}
            </div>
          )}
        </div>

        {showNames && (
          <span className="text-xs font-medium text-gray-300 truncate max-w-[90px] xs:max-w-[140px]">
            {creators.map(c => c.name).join(' + ')}
          </span>
        )}
      </div>
    );
  }

  // Single Creator rendering
  if (!creator) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative inline-block rounded-full overflow-hidden bg-slate-700 text-white font-semibold shrink-0 ${sizeMap[size]}`}
        title={`${creator.name} (@${creator.username})`}
      >
        {creator.profileImage ? (
          <img
            src={creator.profileImage}
            alt={creator.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 text-white font-bold uppercase -z-10">
          {creator.name.charAt(0)}
        </div>
      </div>

      {showNames && (
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-200 truncate">{creator.name}</span>
          <span className="text-[10px] text-gray-400 truncate">@{creator.username}</span>
        </div>
      )}
    </div>
  );
};
