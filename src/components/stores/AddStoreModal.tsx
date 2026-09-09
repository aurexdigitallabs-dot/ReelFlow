import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { r2Service } from '../../services/r2Service';
import { Store, Upload } from 'lucide-react';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose }) => {
  const { addStore } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [logoEmoji, setLogoEmoji] = useState('🛍️');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);
    let logoUrl = logoEmoji;

    if (logoFile) {
      logoUrl = await r2Service.uploadFile(logoFile, 'stores');
    }

    await addStore({
      name: name.trim(),
      code: code.trim().toUpperCase() || name.substring(0, 4).toUpperCase(),
      logo: logoUrl,
      primaryColor,
      status: 'Active'
    });

    setIsUploading(false);
    setName('');
    setCode('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add New Brand / Store" subtitle="Add a client store to your agency database">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Brand / Store Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Paris Bakery & Café"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Store Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. PARIS"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Logo Emoji or Icon</label>
            <input
              type="text"
              value={logoEmoji}
              onChange={(e) => setLogoEmoji(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Upload Brand Logo to Cloudflare R2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setLogoFile(e.target.files[0])}
            className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Store className="w-4 h-4" /> {isUploading ? 'Uploading to R2...' : 'Create Brand / Store'}
        </button>
      </form>
    </BottomSheet>
  );
};
