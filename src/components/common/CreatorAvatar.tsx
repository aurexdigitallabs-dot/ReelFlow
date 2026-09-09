import React, { useState } from 'react';
import { Creator } from '../../types';

interface CreatorAvatarProps {
  creator?: Creator;
  creators?: Creator[];
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
}

export const SingleAvatar: React.FC<{
  name: string;
  username?: string;
  profileImage?: string;
  sizeClass: string;
  borderClass?: string;
}> = ({ name, username, profileImage, sizeClass, borderClass = '' }) => {
  const [imgError, setImgError] = useState(false);
  const initialLetter = (name || 'U').trim().charAt(0).toUpperCase() || 'U';

  const bgGradients = [
    'from-indigo-600 to-purple-600',
    'from-blue-600 to-cyan-600',
    'from-emerald-600 to-teal-600',
    'from-rose-600 to-pink-600',
    'from-purple-600 to-pink-600'
  ];
  const charCode = initialLetter.charCodeAt(0) || 0;
  const gradient = bgGradients[charCode % bgGradients.length];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-bold ${sizeClass} ${borderClass}`}
      title={username ? `${name} (@${username})` : name}
    >
      {profileImage && !imgError ? (
        <img
          src={profileImage}
          alt={name}
          className="w-full h-full object-cover relative z-10"
          onError={() => setImgError(true)}
        />
      ) : null}
      
      {/* Fallback Initial Letter Badge */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-bold uppercase z-0 shadow-inner`}>
        {initialLetter}
      </div>
    </div>
  );
};

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
            <SingleAvatar
              key={c.id || idx}
              name={c.name}
              username={c.username}
              profileImage={c.profileImage}
              sizeClass={sizeMap[size]}
              borderClass={borderClass}
            />
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
            {creators.map((c) => c.name).join(' + ')}
          </span>
        )}
      </div>
    );
  }

  // Single Creator rendering
  if (!creator) return null;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <SingleAvatar
        name={creator.name}
        username={creator.username}
        profileImage={creator.profileImage}
        sizeClass={sizeMap[size]}
      />

      {showNames && (
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-200 truncate">{creator.name}</span>
          {creator.username && (
            <span className="text-[10px] text-gray-400 truncate">@{creator.username}</span>
          )}
        </div>
      )}
    </div>
  );
};

