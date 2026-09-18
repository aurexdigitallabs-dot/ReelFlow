import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { BottomSheet } from '../common/BottomSheet';
import { r2Service } from '../../services/r2Service';
import { UserPlus, Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface AddCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCreatorModal: React.FC<AddCreatorModalProps> = ({ isOpen, onClose }) => {
  const { addCreator, stores, creators } = useApp();
  const { showToast } = useUI();
  const { currentUser, userRole } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(stores.map((s) => s.id));
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setName('');
    setUsername('');
    setProfileImageUrl('');
    setAvatarFile(null);
    setPhone('');
    setEmail('');
    setBio('');
    setErrorMsg('');
    setEmailError('');
    setSubmitStatus('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setErrorMsg('Please enter creator name.');
      return;
    }

    if (emailError) {
      setErrorMsg('Please fix validation errors before submitting.');
      return;
    }

    if (email.trim() && creators.some(c => c.email?.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('A creator with this email already exists.');
      setEmailError('A creator with this email already exists.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setIsSuccess(false);

    console.group('🚀 [AddCreator Flow] Starting Creator Submission');
    console.log('1️⃣ Auth State:', {
      uid: currentUser?.uid || 'Not logged in',
      email: currentUser?.email || 'No email',
      role: userRole
    });
    console.log('2️⃣ Form Data:', {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      selectedStoresCount: selectedStoreIds.length,
      hasAvatarFile: !!avatarFile,
      avatarFileName: avatarFile?.name,
      avatarFileSizeKB: avatarFile ? Math.round(avatarFile.size / 1024) : 0
    });

    try {
      let finalAvatar = profileImageUrl.trim();

      if (avatarFile) {
        setSubmitStatus('Processing avatar image...');
        console.log('3️⃣ Uploading avatar via r2Service...');
        finalAvatar = await r2Service.uploadFile(avatarFile, 'creators');
        console.log('3️⃣ Avatar Result:', {
          isHttp: finalAvatar.startsWith('http'),
          isBase64: finalAvatar.startsWith('data:'),
          length: finalAvatar.length,
          previewUrl: finalAvatar.substring(0, 60) + '...'
        });
      }

      if (!finalAvatar) {
        finalAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
      }

      setSubmitStatus('Saving creator to roster...');
      const handle = username.trim().replace(/^@/, '');

      const payload = {
        name: name.trim(),
        username: handle || name.toLowerCase().replace(/\s+/g, '_'),
        profileImage: finalAvatar,
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        status: 'Active' as const,
        storeIds: selectedStoreIds
      };

      console.log('4️⃣ Sending payload to Firestore addCreator...', payload);

      try {
        const createdId = await addCreator(payload);
        console.log('5️⃣ Created Creator Document successfully! ID:', createdId);
      } catch (dbErr: any) {
        console.error('❌ [AddCreator Flow] Firestore Write Failed:', {
          code: dbErr?.code,
          message: dbErr?.message,
          name: dbErr?.name,
          details: dbErr
        });

        // Rollback uploaded image if database save fails
        if (avatarFile && finalAvatar.startsWith('http')) {
          console.log('🔄 [AddCreator Flow] Rolling back uploaded R2 image...');
          await r2Service.deleteFile(finalAvatar);
        }
        throw dbErr; // Rethrow to show error in UI
      }

      setIsSuccess(true);
      setSubmitStatus('Saved successfully!');
      showToast(`Creator "${name.trim()}" added successfully!`, 'success');
      console.log('🎉 [AddCreator Flow] Flow completed successfully!');
      console.groupEnd();

      setTimeout(() => {
        resetForm();
        onClose();
      }, 600);
    } catch (err: any) {
      console.groupEnd();
      console.error('❌ [AddCreator Flow] Error adding creator:', err);

      let userFacingError = err?.message || 'Failed to save creator.';
      if (err?.code === 'permission-denied') {
        userFacingError = `[Permission Denied] Firestore rejected the write. Please deploy the updated firestore.rules to Firebase Console (Rules tab -> Publish).`;
      } else if (err?.code === 'resource-exhausted') {
        userFacingError = `[Resource Exhausted] The creator document or avatar is too large for Firestore.`;
      } else if (err?.code) {
        userFacingError = `[${err.code}] ${err.message}`;
      }

      setErrorMsg(userFacingError);
      showToast('Failed to save creator: ' + (err?.code || 'Check rules/network'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Add New Creator" subtitle="Add a social media creator to your agency roster">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Creator Name *</label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Instagram Username</label>
          <input
            type="text"
            disabled={isSubmitting}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. alex_vlogs"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Upload Creator Avatar (Cloudflare R2)</label>
          <input
            type="file"
            accept="image/*"
            disabled={isSubmitting}
            onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
            className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Or Avatar Image URL</label>
          <input
            type="url"
            disabled={isSubmitting}
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              disabled={isSubmitting}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                if (newEmail.trim() && creators.some(c => c.email?.toLowerCase() === newEmail.trim().toLowerCase())) {
                  setEmailError('Email already exists in roster');
                } else {
                  setEmailError('');
                }
              }}
              placeholder="alex@agency.com"
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none disabled:opacity-60 ${
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

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Creator Bio / Niche</label>
          <input
            type="text"
            disabled={isSubmitting}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Specialist in food reviews, lifestyle, street comedy..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-slate-900 pb-2 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800 mt-2 z-10 shadow-[0_-8px_16px_rgba(15,23,42,0.8)]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 disabled:opacity-60'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" /> Saved!
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{submitStatus || 'Saving...'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Save Creator
              </>
            )}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};
