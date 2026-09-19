import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { r2Service } from '../../services/r2Service';
import { Store, BrandKit, BrandLogo, BrandFont, SocialHandle, ContactInfo } from '../../types';
import { Palette, UploadCloud, Link as LinkIcon, Building2, Save, Loader2, Plus, X, Globe, Mail, Info, Type, Share2, Trash2, Phone, MapPin, Download } from 'lucide-react';

const STANDARD_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Oswald', 'Playfair Display', 'Merriweather', 'Nunito'
];

const SOCIAL_PLATFORMS = [
  'Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'Facebook', 'LinkedIn', 'Pinterest', 'Snapchat', 'Other'
];

const STANDARD_LOGO_VARIANTS = [
  'Primary', 'Dark', 'Light', 'Icon Only', 'Monochrome'
];

export const BrandKitView: React.FC = () => {
  const { stores, currentStoreId, updateStore } = useApp();
  const { canManageCreators } = useAuth();
  const { showToast } = useUI();

  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    currentStoreId !== 'all' ? currentStoreId : stores[0]?.id || ''
  );

  useEffect(() => {
    if (currentStoreId !== 'all') {
      setSelectedStoreId(currentStoreId);
    }
  }, [currentStoreId]);

  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const brandKit = selectedStore?.brandKit || {
    logos: [],
    fonts: [],
    website: '',
    socialHandles: [],
    contactInfo: '',
    instructions: ''
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editLogos, setEditLogos] = useState<BrandLogo[]>([]);
  const [editFonts, setEditFonts] = useState<BrandFont[]>([]);
  const [editWebsite, setEditWebsite] = useState('');
  const [editSocials, setEditSocials] = useState<SocialHandle[]>([]);
  const [editContact, setEditContact] = useState<ContactInfo>({ email: '', mobileNumber: '', address: '' });
  const [editInstructions, setEditInstructions] = useState('');
  
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; variant: string }[]>([]);

  useEffect(() => {
    if (selectedStore) {
      const bk = selectedStore.brandKit;
      
      // Migrate legacy string[] to BrandLogo[]
      const mappedLogos = (bk?.logos || []).map((l: any) => 
        typeof l === 'string' ? { url: l, variant: 'Primary' } : l
      );
      setEditLogos(mappedLogos);

      // Migrate legacy string[] to BrandFont[]
      const mappedFonts = (bk?.fonts || []).map((f: any) => 
        typeof f === 'string' ? { name: f } : f
      );
      setEditFonts(mappedFonts);

      setEditWebsite(bk?.website || '');
      
      // Migrate legacy string to SocialHandle[]
      let mappedSocials: SocialHandle[] = [];
      if (bk?.socialHandles) {
        if (Array.isArray(bk.socialHandles)) {
          mappedSocials = bk.socialHandles;
        } else if (typeof bk.socialHandles === 'string') {
          mappedSocials = [{ platform: 'Other', url: bk.socialHandles }];
        }
      }
      setEditSocials(mappedSocials);

      let mappedContact = { email: '', mobileNumber: '', address: '' };
      if (typeof bk?.contactInfo === 'string') {
        mappedContact.email = bk.contactInfo;
      } else if (bk?.contactInfo) {
        mappedContact = {
          email: bk.contactInfo.email || '',
          mobileNumber: bk.contactInfo.mobileNumber || '',
          address: bk.contactInfo.address || ''
        };
      }
      setEditContact(mappedContact);
      setEditInstructions(bk?.instructions || '');
      setSelectedFiles([]);
      setIsEditing(false);
    }
  }, [selectedStore]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
      if (validFiles.length < files.length) {
        showToast('Some files were ignored (max 5MB)', 'error');
      }
      setSelectedFiles(prev => [
        ...prev, 
        ...validFiles.map(f => ({ file: f, variant: 'Primary' }))
      ]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateSelectedFileVariant = (index: number, variant: string) => {
    setSelectedFiles(prev => prev.map((f, i) => i === index ? { ...f, variant } : f));
  };

  const removeExistingLogo = (url: string) => {
    setEditLogos(prev => prev.filter(l => l.url !== url));
  };

  const updateExistingLogoVariant = (url: string, variant: string) => {
    setEditLogos(prev => prev.map(l => l.url === url ? { ...l, variant } : l));
  };

  // Fonts
  const addStandardFont = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    if (font && !editFonts.find(f => f.name === font)) {
      setEditFonts(prev => [...prev, { name: font }]);
    }
    e.target.value = '';
  };

  const handleCustomFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('Font file too large (max 10MB)', 'error');
        return;
      }
      
      setIsSubmitting(true);
      try {
        const url = await r2Service.uploadFile(file, 'stores');
        setEditFonts(prev => [...prev, { name: file.name.split('.')[0], url }]);
        showToast('Custom font uploaded', 'success');
      } catch (err) {
        console.error(err);
        showToast('Failed to upload font', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const removeFont = (index: number) => {
    setEditFonts(prev => prev.filter((_, i) => i !== index));
  };

  // Socials
  const addSocial = () => {
    setEditSocials(prev => [...prev, { platform: 'Instagram', url: '' }]);
  };

  const updateSocial = (index: number, field: 'platform' | 'url', value: string) => {
    setEditSocials(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSocial = (index: number) => {
    setEditSocials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedStore) return;
    setIsSubmitting(true);
    try {
      let finalLogos = [...editLogos];

      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(f => r2Service.uploadFile(f.file, 'stores'));
        const newUrls = await Promise.all(uploadPromises);
        const newLogos: BrandLogo[] = newUrls.map((url, i) => ({
          url,
          variant: selectedFiles[i].variant
        }));
        finalLogos = [...finalLogos, ...newLogos];
      }

      // Filter out empty social handles
      const validSocials = editSocials.filter(s => s.url.trim());

      const newBrandKit: BrandKit = {
        logos: finalLogos,
        fonts: editFonts,
        website: editWebsite.trim(),
        socialHandles: validSocials,
        contactInfo: editContact,
        instructions: editInstructions.trim(),
      };

      await updateStore(selectedStore.id, { brandKit: newBrandKit as any });

      showToast('Brand Kit updated successfully!', 'success');
      setIsEditing(false);
      setSelectedFiles([]);
      setEditLogos(finalLogos);
      setEditSocials(validSocials);
    } catch (err: any) {
      console.error('Error saving brand kit:', err);
      showToast('Failed to save Brand Kit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const downloadAsset = async (url: string, filename: string) => {
    try {
      showToast('Starting download...', 'success');
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  if (!selectedStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Palette className="w-12 h-12 text-gray-700 mb-4" />
        <h2 className="text-lg font-bold text-gray-200">No Store Selected</h2>
        <p className="text-xs text-gray-400 mt-2 max-w-sm">
          Please select a brand/store from the sidebar or dropdown to view its Brand Kit.
        </p>
      </div>
    );
  }

  // Gracefully handle legacy brandKit mappings for UI display
  const displayLogos: BrandLogo[] = (brandKit.logos || []).map((l: any) => typeof l === 'string' ? { url: l, variant: 'Primary' } : l);
  const displayFonts: BrandFont[] = (brandKit.fonts || []).map((f: any) => typeof f === 'string' ? { name: f } : f);
  let displaySocials: SocialHandle[] = [];
  if (brandKit.socialHandles) {
    if (Array.isArray(brandKit.socialHandles)) {
      displaySocials = brandKit.socialHandles;
    } else if (typeof brandKit.socialHandles === 'string') {
      displaySocials = [{ platform: 'Other', url: brandKit.socialHandles }];
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 flex items-center gap-2">
            <Palette className="w-6 h-6 text-pink-400" />
            Brand Kit
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Access logos, fonts, and guidelines for {selectedStore.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {stores.length > 1 && currentStoreId === 'all' && (
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-900 border border-slate-700 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 appearance-none min-w-[150px]"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          {canManageCreators && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-xs font-bold transition-all shadow border border-slate-700"
            >
              Edit Kit
            </button>
          )}
          {canManageCreators && isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Kit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Logos Section */}
          <section className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> Brand Logos
            </h3>

            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {editLogos.map((logo, i) => (
                    <div key={i} className="relative rounded-xl bg-slate-950 border border-slate-800 flex flex-col p-3 group">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex flex-col gap-1 w-full">
                          <select
                            value={!STANDARD_LOGO_VARIANTS.includes(logo.variant) ? 'Other' : logo.variant}
                            onChange={(e) => updateExistingLogoVariant(logo.url, e.target.value === 'Other' ? '' : e.target.value)}
                            className="px-2 py-1 text-[10px] bg-slate-900 border border-slate-700 rounded text-gray-200 focus:outline-none"
                          >
                            {STANDARD_LOGO_VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
                            <option value="Other">Other...</option>
                          </select>
                          {!STANDARD_LOGO_VARIANTS.includes(logo.variant) && (
                            <input
                              type="text"
                              value={logo.variant}
                              onChange={(e) => updateExistingLogoVariant(logo.url, e.target.value)}
                              placeholder="Variant Name"
                              className="px-2 py-1 text-[10px] bg-slate-950 border border-slate-700 rounded text-gray-200 focus:outline-none focus:border-indigo-500 w-full"
                              autoFocus
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeExistingLogo(logo.url)}
                          className="w-5 h-5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="h-32 flex items-center justify-center p-2 bg-white/5 rounded-lg border border-dashed border-slate-700/50">
                        <img src={logo.url} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                      </div>
                    </div>
                  ))}

                  {selectedFiles.map((f, i) => (
                    <div key={`new-${i}`} className="relative rounded-xl bg-indigo-900/20 border border-indigo-500/30 flex flex-col p-3 group">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex flex-col gap-1 w-full">
                          <select
                            value={!STANDARD_LOGO_VARIANTS.includes(f.variant) ? 'Other' : f.variant}
                            onChange={(e) => updateSelectedFileVariant(i, e.target.value === 'Other' ? '' : e.target.value)}
                            className="px-2 py-1 text-[10px] bg-indigo-950 border border-indigo-500/50 rounded text-indigo-200 focus:outline-none"
                          >
                            {STANDARD_LOGO_VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
                            <option value="Other">Other...</option>
                          </select>
                          {!STANDARD_LOGO_VARIANTS.includes(f.variant) && (
                            <input
                              type="text"
                              value={f.variant}
                              onChange={(e) => updateSelectedFileVariant(i, e.target.value)}
                              placeholder="Variant Name"
                              className="px-2 py-1 text-[10px] bg-indigo-950 border border-indigo-500/50 rounded text-indigo-200 focus:outline-none focus:border-indigo-400 w-full"
                              autoFocus
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeSelectedFile(i)}
                          className="w-5 h-5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="h-32 flex flex-col items-center justify-center p-2 bg-indigo-500/5 rounded-lg border border-dashed border-indigo-500/30">
                         <span className="text-[10px] font-bold text-indigo-300 text-center break-all line-clamp-2">{f.file.name}</span>
                         <span className="text-[9px] text-gray-400 mt-2 bg-slate-900 px-2 py-0.5 rounded-full">Pending Upload</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-2xl cursor-pointer transition-all mt-2">
                  <UploadCloud className="w-5 h-5 text-indigo-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-300">Click to add logos</span>
                  <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, SVG up to 5MB</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayLogos.length > 0 ? (
                  displayLogos.map((logo, i) => (
                    <div key={i} className="group flex flex-col gap-2">
                      <div className="relative aspect-square rounded-xl bg-white/5 border border-slate-800 flex items-center justify-center p-4">
                        <img src={logo.url} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-xl backdrop-blur-sm">
                          <button onClick={() => window.open(logo.url, '_blank')} className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg border border-slate-700 w-3/4 hover:bg-slate-700 transition-colors">
                            View Original
                          </button>
                          <button onClick={() => downloadAsset(logo.url, `brand_logo_${logo.variant.replace(/\s+/g, '_').toLowerCase()}.png`)} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow w-3/4 flex items-center justify-center gap-1.5 hover:bg-indigo-500 transition-colors">
                            <Download className="w-3 h-3" /> Download
                          </button>
                          <button onClick={() => copyToClipboard(logo.url)} className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg border border-slate-700 w-3/4 hover:bg-slate-700 transition-colors">
                            Copy Link
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="inline-block px-2 py-0.5 bg-slate-800 text-gray-300 text-[10px] font-bold rounded-md">
                          {logo.variant}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic col-span-full">No logos uploaded yet.</p>
                )}
              </div>
            )}
          </section>

          {/* Instructions Section */}
          <section className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" /> Brand Guidelines & Notes
            </h3>
            {isEditing ? (
              <textarea
                rows={5}
                value={editInstructions}
                onChange={e => setEditInstructions(e.target.value)}
                placeholder="Describe tone of voice, visual rules, etc..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            ) : (
              <div className="text-xs text-gray-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800 min-h-[100px]">
                {brandKit.instructions || <span className="text-gray-400 italic">No specific instructions provided. Please follow general brand guidelines and maintain a consistent, professional tone.</span>}
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar Info */}
        <div className="flex flex-col gap-6">
          <section className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" /> Typography
            </h3>
            
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {editFonts.map((font, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-200">{font.name}</span>
                        {font.url && <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Custom</span>}
                      </div>
                      <button onClick={() => removeFont(i)} className="text-gray-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {editFonts.length === 0 && <span className="text-xs text-gray-500 italic">No fonts added</span>}
                </div>
                
                <div className="flex items-center gap-2">
                  <select 
                    onChange={addStandardFont} 
                    className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Standard Font...</option>
                    {STANDARD_FONTS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  
                  <label className="shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-[10px] font-bold cursor-pointer transition-colors border border-slate-700 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5" /> Upload File
                    <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleCustomFontUpload} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {displayFonts.length > 0 ? (
                  displayFonts.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <span className="text-xs font-semibold text-purple-300">{f.name}</span>
                      {f.url && (
                        <button 
                          onClick={() => downloadAsset(f.url as string, `font_${f.name.replace(/\s+/g, '_').toLowerCase()}`)} 
                          className="text-purple-400 hover:text-purple-200"
                          title="Download Font"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">Not specified</span>
                )}
              </div>
            )}
          </section>

          <section className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-sky-400" /> Links & Socials
            </h3>
            
            <div className="flex flex-col gap-5">
              {/* Website */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editWebsite}
                    onChange={e => setEditWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <div className="text-xs">
                    {brandKit.website ? (
                      <a href={brandKit.website} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1.5 break-all">
                        <Globe className="w-3.5 h-3.5 shrink-0" /> {brandKit.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">Not specified</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Contact Info */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Contact Info</label>
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={editContact.email}
                      onChange={e => setEditContact(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email (e.g. hello@brand.com)"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="tel"
                      value={editContact.mobileNumber}
                      onChange={e => setEditContact(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      placeholder="Mobile Number"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      rows={2}
                      value={editContact.address}
                      onChange={e => setEditContact(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Address"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-gray-300 flex flex-col gap-2">
                    {brandKit.contactInfo ? (
                      <>
                        {typeof brandKit.contactInfo === 'string' ? (
                           <span className="flex items-center gap-1.5">
                             <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {brandKit.contactInfo}
                           </span>
                        ) : (
                          <>
                            {brandKit.contactInfo.email && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {brandKit.contactInfo.email}
                              </span>
                            )}
                            {brandKit.contactInfo.mobileNumber && (
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {brandKit.contactInfo.mobileNumber}
                              </span>
                            )}
                            {brandKit.contactInfo.address && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {brandKit.contactInfo.address}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    ) : <span className="text-gray-500 italic">Not specified</span>}
                  </div>
                )}
              </div>

              {/* Social Handles */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  Social Handles
                  {isEditing && (
                    <button onClick={addSocial} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 normal-case tracking-normal">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  )}
                </label>
                
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    {editSocials.map((social, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={social.platform}
                          onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                          className="w-1/3 px-2 py-2 text-[10px] font-semibold bg-slate-950 border border-slate-800 rounded-lg text-gray-200 focus:outline-none"
                        >
                          {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input
                          type="text"
                          value={social.url}
                          onChange={(e) => updateSocial(i, 'url', e.target.value)}
                          placeholder="Link or @"
                          className="flex-1 px-2 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500"
                        />
                        <button onClick={() => removeSocial(i)} className="text-gray-500 hover:text-rose-400 shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {editSocials.length === 0 && <span className="text-xs text-gray-500 italic">No social handles</span>}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {displaySocials.length > 0 ? (
                      displaySocials.map((social, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-500">{social.platform}</span>
                          <a href={social.url.startsWith('http') ? social.url : `https://${social.platform.toLowerCase()}.com/${social.url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline break-all">
                            {social.url}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">Not specified</span>
                    )}
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
