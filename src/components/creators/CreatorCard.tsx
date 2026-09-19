import React, { useState } from 'react';
import { Creator } from '../../types';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { Phone, ChevronRight, Video, CheckCircle2, Clock, AtSign, Edit2, Mail, Loader2, UserCheck, AlertCircle } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onSelect: (creatorId: string) => void;
  onEdit?: (creator: Creator) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onSelect, onEdit }) => {
  const { content, sendCreatorOnboardingEmail } = useApp();
  const { showToast } = useUI();
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Derived content counts for this creator
  const assignedItems = content.filter((item) => item.creatorIds.includes(creator.id));
  const totalCount = assignedItems.length;
  const completedCount = assignedItems.filter((item) => item.postStatus === 'Posted').length;
  const pendingCount = assignedItems.filter(
    (item) => item.postStatus !== 'Posted' && item.postStatus !== 'Cancelled'
  ).length;

  const handleSendInvite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!creator.email) {
      showToast(`Cannot send invite: ${creator.name} has no email address.`, 'error');
      return;
    }

    setIsSendingInvite(true);
    try {
      const res = await sendCreatorOnboardingEmail(creator);
      if (res.success) {
        if (res.warning) {
          showToast(res.warning, 'info');
        } else {
          showToast(`Onboarding invite email sent to ${creator.email}!`, 'success');
        }
      } else {
        showToast(res.error || 'Failed to send invite email. Check Resend settings.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error sending invite', 'error');
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(creator.id)}
      className="glass-panel p-4 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all group relative"
    >
      {/* Top Header: Avatar, Name, Handle, Status, Edit */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CreatorAvatar creator={creator} size="lg" />
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors truncate">
              {creator.name}
            </h4>
            <a
              href={`https://instagram.com/${creator.username}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-400 hover:text-indigo-400 flex items-center gap-1 truncate"
            >
              <AtSign className="w-3 h-3 text-pink-500" />
              @{creator.username}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(creator);
              }}
              className="touch-target-44 p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title="Edit creator profile"
            >
              <Edit2 className="w-4 h-4 text-indigo-400" />
            </button>
          )}

          {/* Status Badge */}
          <span
            className={`badge px-2 py-0.5 text-[10px] ${
              creator.status === 'Active'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-gray-400 border border-slate-700'
            }`}
          >
            {creator.status}
          </span>
        </div>
      </div>

      {/* Bio excerpt if available */}
      {creator.bio && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic break-words">
          "{creator.bio}"
        </p>
      )}

      {/* Onboarding Pending Action Banner */}
      {!creator.onboarded ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between gap-2 px-2.5 py-2 bg-amber-500/10 border border-amber-500/25 rounded-xl transition-all"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-medium text-amber-300 truncate">Onboarding Pending</span>
          </div>
          <button
            type="button"
            disabled={isSendingInvite}
            onClick={handleSendInvite}
            className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-indigo-600/30 active:scale-95 disabled:opacity-50 cursor-pointer"
            title={`Send onboarding email to ${creator.email || 'creator'}`}
          >
            {isSendingInvite ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="w-3 h-3" />
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
          <UserCheck className="w-3 h-3 text-emerald-400" />
          <span>Account Onboarded</span>
        </div>
      )}

      {/* Content Counts Grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <Video className="w-3 h-3 text-indigo-400" /> Total
          </span>
          <span className="text-sm font-extrabold text-gray-100 mt-0.5">{totalCount}</span>
        </div>

        <div className="flex flex-col items-center border-x border-slate-800/80">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
          </span>
          <span className="text-sm font-extrabold text-emerald-400 mt-0.5">{completedCount}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <Clock className="w-3 h-3 text-amber-400" /> Pending
          </span>
          <span className="text-sm font-extrabold text-amber-400 mt-0.5">{pendingCount}</span>
        </div>
      </div>

      {/* Footer Contact & View Profile Link */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-800/60 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1 truncate pr-2">
          {creator.phone && (
            <span className="flex items-center gap-1 text-[11px] truncate" title={creator.phone}>
              <Phone className="w-3 h-3 text-gray-500 shrink-0" /> <span className="truncate">{creator.phone}</span>
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 shrink-0">
          View Profile <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
