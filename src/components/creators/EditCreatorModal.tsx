import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Creator } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { AlertCircle, Trash2, Save, Loader2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

interface EditCreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCreatorModal: React.FC<EditCreatorModalProps> = ({ creator, isOpen, onClose }) => {
  const { stores, updateCreator, deleteCreator, creators } = useApp();
  const { showConfirm, showToast } = useUI();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (creator && isOpen) {
      setErrorMsg('');
      setEmailError('');
      setName(creator.name || '');
      setUsername(creator.username || '');
      setProfileImage(creator.profileImage || '');
      setPhone(creator.phone || '');
      setEmail(creator.email || '');
      setBio(creator.bio || '');
      setStatus(creator.status || 'Active');
      setSelectedStoreIds(creator.storeIds || []);
    }
  }, [creator, isOpen]);

  const toggleStore = (sId: string) => {
    if (selectedStoreIds.includes(sId)) {
      setSelectedStoreIds(selectedStoreIds.filter((id) => id !== sId));
    } else {
      setSelectedStoreIds([...selectedStoreIds, sId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator || isSubmitting) return;

    if (!name.trim()) {
      setErrorMsg('Please enter creator full name.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Please enter Instagram handle.');
      return;
    }

    if (emailError) {
      setErrorMsg('Please fix validation errors before submitting.');
      return;
    }

    if (email.trim() && creators.some(c => c.id !== creator.id && c.email?.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('Another creator with this email already exists.');
      setEmailError('Another creator with this email already exists.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCreator(creator.id, {
        name: name.trim(),
        username: username.trim().replace(/^@/, ''),
        profileImage: profileImage.trim() || undefined,
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        status,
        storeIds: selectedStoreIds
      });

      showToast(`Creator "${name.trim()}" updated successfully!`, 'success');
      onClose();
    } catch (err: any) {
      console.error('Error updating creator:', err);
      setErrorMsg(`Failed to update creator: ${err?.message || 'Check network connection'}`);
      showToast('Failed to update creator', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!creator) return;
    showConfirm({
      title: 'Delete Creator',
      message: `Are you sure you want to delete creator "${creator.name}"?`,
      isDestructive: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteCreator(creator.id);
          showToast(`Creator "${creator.name}" deleted.`, 'info');
          onClose();
        } catch (err: any) {
          console.error('Error deleting creator:', err);
          setErrorMsg('Failed to delete creator.');
          showToast('Failed to delete creator', 'error');
        }
      }
    });
  };

  if (!creator) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Creator Profile"
      subtitle={`Update details for ${creator.name}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Username / Handle */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Instagram Handle (@username) *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="alex.creates"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Profile Image URL (Optional)
          </label>
          <input
            type="url"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555-0192"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                if (newEmail.trim() && creators.some(c => c.id !== creator.id && c.email?.toLowerCase() === newEmail.trim().toLowerCase())) {
                  setEmailError('Email already exists in roster');
                } else {
                  setEmailError('');
                }
              }}
              placeholder="alex@reelflow.com"
              className={`w-full px-3 py-2 text-xs bg-slate-950 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none ${
                emailError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
            {emailError && (
              <p className="text-[10px] text-rose-400 mt-1 pl-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailError}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Bio / Specialty Brief
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fashion & lifestyle reel creator..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Status
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus('Active')}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                status === 'Active'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-gray-400'
              }`}
            >
              🟢 Active
            </button>
            <button
              type="button"
              onClick={() => setStatus('Inactive')}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                status === 'Inactive'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-gray-400'
              }`}
            >
              ⚪ Inactive
            </button>
          </div>
        </div>

        {/* Store / Brand Assignments */}
        {stores.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Assigned Brands / Stores
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stores.map((s) => {
                const isSelected = selectedStoreIds.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleStore(s.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/50 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-gray-400'
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="sticky bottom-0 bg-slate-900 pb-2 flex items-center justify-between gap-3 pt-3 border-t border-slate-800 mt-2 z-10 shadow-[0_-8px_16px_rgba(15,23,42,0.8)]">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Creator
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </BottomSheet>
  );
};
