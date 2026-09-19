import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Creator } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { AlertCircle, Save, Loader2, UploadCloud } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { r2Service } from '../../services/r2Service';

interface CreatorSettingsModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorSettingsModal: React.FC<CreatorSettingsModalProps> = ({ creator, isOpen, onClose }) => {
  const { updateCreator } = useApp();
  const { showToast } = useUI();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [genre, setGenre] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (creator && isOpen) {
      setErrorMsg('');
      setName(creator.name || '');
      setUsername(creator.username || '');
      setProfileImage(creator.profileImage || '');
      setPhone(creator.phone || '');
      setBio(creator.bio || '');
      setInstagramId(creator.instagramId || '');
      setGenre(creator.genre || '');
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [creator, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image must be less than 2MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator || isSubmitting) return;

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Please enter your handle.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = profileImage;

      if (selectedFile) {
        try {
          // Upload to R2
          finalImageUrl = await r2Service.uploadFile(selectedFile, 'creators');
        } catch (uploadErr: any) {
          setErrorMsg(`Failed to upload image: ${uploadErr.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      await updateCreator(creator.id, {
        name: name.trim(),
        username: username.trim().replace(/^@/, ''),
        profileImage: finalImageUrl,
        phone: phone.trim(),
        bio: bio.trim(),
        instagramId: instagramId.trim().replace(/^@/, ''),
        genre: genre.trim(),
      });

      showToast('Profile updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setErrorMsg(`Failed to update profile: ${err?.message || 'Check network connection'}`);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!creator) return null;

  const currentDisplayImage = previewUrl || profileImage;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your creator details and photo"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="creator-settings-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Profile
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="creator-settings-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Image Section */}
        <div className="flex flex-col gap-2">
          <label className="block text-xs font-semibold text-gray-300">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
              {currentDisplayImage ? (
                <img src={currentDisplayImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {name.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="photo-upload" className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-gray-300 text-[10px] font-semibold rounded-lg cursor-pointer transition-colors w-fit">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload New Photo
              </label>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <span className="text-[10px] text-gray-500">Max 2MB. Square image recommended.</span>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Handle (@username) *</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Instagram ID */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Instagram ID / URL</label>
          <input
            type="text"
            value={instagramId}
            onChange={(e) => setInstagramId(e.target.value)}
            placeholder="@your_insta"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Genre / Niche</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Comedy, Tech, Fashion"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Bio / Specialty Brief</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

      </form>
    </BottomSheet>
  );
};
