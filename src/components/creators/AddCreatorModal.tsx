import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { r2Service } from '../../services/r2Service';
import { UserPlus, Upload } from 'lucide-react';

interface AddCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCreatorModal: React.FC<AddCreatorModalProps> = ({ isOpen, onClose }) => {
  const { addCreator, stores } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(stores.map((s) => s.id));
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);
    let finalAvatar = profileImageUrl.trim();

    if (avatarFile) {
      finalAvatar = await r2Service.uploadFile(avatarFile, 'creators');
    }

    if (!finalAvatar) {
      finalAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    }

    const handle = username.trim().replace(/^@/, '');

    await addCreator({
      name: name.trim(),
      username: handle || name.toLowerCase().replace(/\s+/g, '_'),
      profileImage: finalAvatar,
      phone: phone.trim(),
      email: email.trim(),
      bio: bio.trim(),
      status: 'Active',
      storeIds: selectedStoreIds
    });

    setIsUploading(false);
    setName('');
    setUsername('');
    setProfileImageUrl('');
    setAvatarFile(null);
    setPhone('');
    setEmail('');
    setBio('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add New Creator" subtitle="Add a social media creator to your agency Firebase database">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Creator Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Instagram Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. alex_vlogs"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Upload Creator Avatar (Cloudflare R2)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
            className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Or Avatar Image URL</label>
          <input
            type="url"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@agency.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Creator Bio / Niche</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Specialist in food reviews, lifestyle, street comedy..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> {isUploading ? 'Uploading to R2...' : 'Save Creator to Firebase'}
        </button>
      </form>
    </BottomSheet>
  );
};
