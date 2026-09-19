import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Creator } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { AlertCircle, Trash2, Save, Loader2, UploadCloud, X, Mail } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { r2Service } from '../../services/r2Service';

interface EditCreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCreatorModal: React.FC<EditCreatorModalProps> = ({ creator, isOpen, onClose }) => {
  const { stores, updateCreator, deleteCreator, creators, sendCreatorOnboardingEmail } = useApp();
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [onboarded, setOnboarded] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

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
      setOnboarded(creator.onboarded === true);
      setAvatarFile(null);
      setPreviewUrl('');
      setUploadStatus('');
    }
  }, [creator, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setPreviewUrl('');
    setProfileImage('');
  };

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
      let finalAvatarUrl = profileImage.trim();

      if (avatarFile) {
        setUploadStatus('Uploading new profile image...');
        finalAvatarUrl = await r2Service.uploadFile(avatarFile, 'creators');
      }

      await updateCreator(creator.id, {
        name: name.trim(),
        username: username.trim().replace(/^@/, ''),
        profileImage: finalAvatarUrl || undefined,
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        status,
        onboarded,
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
      setUploadStatus('');
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
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
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
              form="edit-creator-form"
              disabled={isSubmitting || !!emailError}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {uploadStatus || 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      }
    >
      <form id="edit-creator-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {/* Profile Image Upload & Preview Section */}
        <div className="flex flex-col gap-2 p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <label className="block text-xs font-semibold text-gray-300">
            Profile Photo
          </label>
          
          <div className="flex items-center gap-3.5">
            {/* Avatar Preview */}
            <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner flex items-center justify-center group">
              {previewUrl || profileImage ? (
                <img
                  src={previewUrl || profileImage}
                  alt={name || 'Creator'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600/30 to-purple-600/30 text-indigo-300 font-bold text-lg">
                  {name.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}

              {(previewUrl || profileImage) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove photo"
                  className="absolute inset-0 bg-slate-950/70 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <label
                  htmlFor="edit-creator-photo-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold rounded-xl cursor-pointer transition-all active:scale-95 w-fit"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {previewUrl || profileImage ? 'Change Photo' : 'Upload New Photo'}
                </label>
                <input
                  id="edit-creator-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {(previewUrl || profileImage) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 truncate">
                {avatarFile ? avatarFile.name : 'Square image recommended (Max 5MB)'}
              </p>
            </div>
          </div>

          {/* Or Image URL Input */}
          <div className="mt-1 pt-2 border-t border-slate-900">
            <label className="block text-[10px] font-medium text-gray-400 mb-1">
              Or paste direct Image URL
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => {
                setProfileImage(e.target.value);
                if (e.target.value) setAvatarFile(null);
              }}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
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
            Account Status
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

        {/* Onboarding Status & Invite Trigger */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-300">
              Onboarding Status
            </label>
            {email && (
              <button
                type="button"
                disabled={isSendingInvite}
                onClick={async () => {
                  if (!creator) return;
                  setIsSendingInvite(true);
                  try {
                    const res = await sendCreatorOnboardingEmail({ ...creator, email: email.trim(), name: name.trim() });
                    if (res.success) {
                      if (res.warning) {
                        showToast(res.warning, 'info');
                      } else {
                        showToast(`Onboarding invite email sent to ${email.trim()}!`, 'success');
                      }
                    } else {
                      showToast(res.error || 'Failed to send invite', 'error');
                    }
                  } catch (e: any) {
                    showToast(e?.message || 'Failed to send invite', 'error');
                  } finally {
                    setIsSendingInvite(false);
                  }
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isSendingInvite ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                Send Invite Email Now
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnboarded(true)}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                onboarded
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-gray-400'
              }`}
            >
              ✓ Onboarded
            </button>
            <button
              type="button"
              onClick={() => setOnboarded(false)}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                !onboarded
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-gray-400'
              }`}
            >
              ⏳ Onboarding Pending
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

      </form>
    </BottomSheet>
  );
};
