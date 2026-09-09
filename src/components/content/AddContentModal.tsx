import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, ShootStatus, PostStatus } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { getTodayString } from '../../utils/dateUtils';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { AlertCircle, Check, Sparkles, Calendar } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/seedData';

export const AddContentModal: React.FC = () => {
  const {
    isAddContentOpen,
    setIsAddContentOpen,
    addContentPrefill,
    stores,
    creators,
    categories,
    addContent,
    currentStoreId
  } = useApp();

  const todayStr = getTodayString();
  const activeCategories = categories.length > 0 ? categories : INITIAL_CATEGORIES;

  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [storeId, setStoreId] = useState(currentStoreId !== 'all' ? currentStoreId : stores[0]?.id || '');
  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id || '');
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [shootDate, setShootDate] = useState(todayStr);
  const [postDate, setPostDate] = useState(todayStr);
  const [priority, setPriority] = useState<Priority>('Normal');
  const [notes, setNotes] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [dateWarning, setDateWarning] = useState('');

  // Handle prefill or reset when modal opens
  useEffect(() => {
    if (isAddContentOpen) {
      setErrorMsg('');
      setDateWarning('');

      if (addContentPrefill) {
        if (addContentPrefill.title) setTitle(addContentPrefill.title);
        if (addContentPrefill.concept) setConcept(addContentPrefill.concept);
        if (addContentPrefill.storeId) setStoreId(addContentPrefill.storeId);
        if (addContentPrefill.categoryId) setCategoryId(addContentPrefill.categoryId);
        if (addContentPrefill.creatorIds) setSelectedCreatorIds(addContentPrefill.creatorIds);
        if (addContentPrefill.shootDate) setShootDate(addContentPrefill.shootDate);
        if (addContentPrefill.postDate) setPostDate(addContentPrefill.postDate);
      } else {
        setTitle('');
        setConcept('');
        setStoreId(currentStoreId !== 'all' ? currentStoreId : stores[0]?.id || '');
        setCategoryId(activeCategories[0]?.id || '');
        setSelectedCreatorIds(creators[0] ? [creators[0].id] : []);
        setShootDate(todayStr);
        setPostDate(todayStr);
        setPriority('Normal');
        setNotes('');
        setReferenceUrl('');
      }
    }
  }, [isAddContentOpen, addContentPrefill, currentStoreId, stores, activeCategories, creators, todayStr]);

  // Date validation check
  useEffect(() => {
    if (shootDate && postDate && postDate < shootDate) {
      setDateWarning('⚠️ Post date is set BEFORE shoot date. Is this intentional?');
    } else {
      setDateWarning('');
    }
  }, [shootDate, postDate]);

  const toggleCreator = (cId: string) => {
    if (selectedCreatorIds.includes(cId)) {
      if (selectedCreatorIds.length === 1) return; // Require at least one creator
      setSelectedCreatorIds(selectedCreatorIds.filter(id => id !== cId));
    } else {
      setSelectedCreatorIds([...selectedCreatorIds, cId]);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!concept.trim()) {
      setErrorMsg('Please enter a content concept.');
      return;
    }

    if (selectedCreatorIds.length === 0) {
      setErrorMsg('Please select at least one creator.');
      return;
    }

    const itemTitle = title.trim() || concept.trim().slice(0, 40) + '...';

    setIsSubmitting(true);
    try {
      await addContent({
        storeId,
        title: itemTitle,
        concept: concept.trim(),
        categoryId,
        creatorIds: selectedCreatorIds,
        shootDate,
        postDate,
        shootStatus: 'Scheduled' as ShootStatus,
        postStatus: 'Pending' as PostStatus,
        priority,
        notes: notes.trim() || undefined,
        referenceUrl: referenceUrl.trim() || undefined
      });

      setIsAddContentOpen(false);
    } catch (err) {
      setErrorMsg('Failed to save content item. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isAddContentOpen}
      onClose={() => setIsAddContentOpen(false)}
      title="Create New Content"
      subtitle="Schedule shoots, assign creators, and plan post dates"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Store Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Store / Brand *
          </label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-gray-100 py-1">
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Content Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Content Title / Catchy Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. iPhone 18 Camera Zoom Challenge"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Content Concept */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Content Concept / Script Brief *
          </label>
          <textarea
            required
            rows={3}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Customer asks for a single piece of food to be packed in a luxury box..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Content Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {activeCategories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900 text-gray-100 py-1">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multi-Creator Searchable Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Assign Creator(s) * <span className="text-[10px] text-gray-500 font-normal">(Tap to select single or multiple)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {creators.map((c) => {
              const isSelected = selectedCreatorIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCreator(c.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-gray-100'
                      : 'bg-slate-950 border-slate-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <CreatorAvatar creator={c} size="sm" showNames />
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates Grid: Shoot Date & Post Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Shoot Date *
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none shrink-0" />
              <input
                type="date"
                required
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                className="w-full pl-9 pr-2 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Post Date *
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none shrink-0" />
              <input
                type="date"
                required
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                className="w-full pl-9 pr-2 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>
        </div>


        {dateWarning && (
          <div className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            {dateWarning}
          </div>
        )}

        {/* Priority Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Priority
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Low', 'Normal', 'High', 'Urgent'] as Priority[]).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-semibold rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-gray-400 border border-slate-800 hover:text-gray-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reference & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Reference URL (Optional)
            </label>
            <input
              type="url"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://instagram.com/reel/..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Production Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Props needed, venue details..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Sparkles className="w-4 h-4" /> {isSubmitting ? 'Creating Content...' : 'Create Content'}
        </button>
      </form>
    </BottomSheet>
  );
};
