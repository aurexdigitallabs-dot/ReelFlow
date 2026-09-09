import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Priority, ShootStatus, PostStatus } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { CreatorAvatar } from '../common/CreatorAvatar';
import { AlertCircle, Trash2, Save } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/seedData';
import { CustomSelect } from '../common/CustomSelect';
import { useUI } from '../../context/UIContext';

export const EditContentModal: React.FC = () => {
  const {
    editingContent,
    isEditContentOpen,
    closeEditContent,
    stores,
    creators,
    categories,
    updateContent,
    deleteContent
  } = useApp();
  const { canManageCreators } = useAuth();
  const { showConfirm } = useUI();

  const activeCategories = categories.length > 0 ? categories : INITIAL_CATEGORIES;

  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [storeId, setStoreId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [shootDate, setShootDate] = useState('');
  const [postDate, setPostDate] = useState('');
  const [shootStatus, setShootStatus] = useState<ShootStatus>('Scheduled');
  const [postStatus, setPostStatus] = useState<PostStatus>('Pending');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [notes, setNotes] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingContent && isEditContentOpen) {
      setErrorMsg('');
      setDateWarning('');
      setTitle(editingContent.title || '');
      setConcept(editingContent.concept || '');
      setStoreId(editingContent.storeId || stores[0]?.id || '');
      setCategoryId(editingContent.categoryId || activeCategories[0]?.id || '');
      setSelectedCreatorIds(editingContent.creatorIds || []);
      setShootDate(editingContent.shootDate || '');
      setPostDate(editingContent.postDate || '');
      setShootStatus(editingContent.shootStatus || 'Scheduled');
      setPostStatus(editingContent.postStatus || 'Pending');
      setPriority(editingContent.priority || 'Normal');
      setNotes(editingContent.notes || '');
      setReferenceUrl(editingContent.referenceUrl || '');
    }
  }, [editingContent, isEditContentOpen, stores, activeCategories]);

  // Date validation warning
  useEffect(() => {
    if (shootDate && postDate && postDate < shootDate) {
      setDateWarning('⚠️ Post date is set BEFORE shoot date.');
    } else {
      setDateWarning('');
    }
  }, [shootDate, postDate]);

  const toggleCreator = (cId: string) => {
    if (selectedCreatorIds.includes(cId)) {
      if (selectedCreatorIds.length === 1) return;
      setSelectedCreatorIds(selectedCreatorIds.filter(id => id !== cId));
    } else {
      setSelectedCreatorIds([...selectedCreatorIds, cId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent || isSubmitting) return;

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
      await updateContent(editingContent.id, {
        storeId,
        title: itemTitle,
        concept: concept.trim(),
        categoryId,
        creatorIds: selectedCreatorIds,
        shootDate,
        postDate,
        shootStatus,
        postStatus,
        priority,
        notes: notes.trim() || undefined,
        referenceUrl: referenceUrl.trim() || undefined
      });

      closeEditContent();
    } catch (err: any) {
      console.error('Error updating content item:', err);
      setErrorMsg(`Failed to update content item: ${err?.message || 'Check connection or permissions'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingContent) return;
    showConfirm({
      title: 'Delete Content',
      message: `Are you sure you want to delete "${editingContent.title}"?`,
      isDestructive: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteContent(editingContent.id);
          closeEditContent();
        } catch (err: any) {
          console.error('Error deleting content:', err);
          setErrorMsg('Failed to delete content.');
        }
      }
    });
  };

  const storeSelectOptions = stores.map((s) => ({
    value: s.id,
    label: s.name
  }));

  const categorySelectOptions = activeCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    color: cat.color
  }));

  const shootStatusOptions = [
    { value: 'Scheduled', label: '📅 Scheduled' },
    { value: 'Shot', label: '📸 Shot' },
    { value: 'Cancelled', label: '❌ Cancelled' }
  ];

  const postStatusOptions = [
    { value: 'Pending', label: '⏳ Pending Shoot' },
    { value: 'Editing', label: '🎬 In Editing' },
    { value: 'Ready', label: '✅ Ready to Post' },
    { value: 'Posted', label: '🚀 Published' },
    { value: 'Cancelled', label: '❌ Cancelled' }
  ];

  const priorityOptions: Priority[] = ['Low', 'Normal', 'High', 'Urgent'];

  if (!editingContent) return null;

  return (
    <BottomSheet
      isOpen={isEditContentOpen}
      onClose={closeEditContent}
      title="Edit Content Item"
      subtitle={`Updating item #${editingContent.id.slice(0, 6)}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Store / Brand */}
        <CustomSelect
          label="Store / Brand"
          required
          options={storeSelectOptions}
          value={storeId}
          onChange={setStoreId}
          placeholder="Select Store / Brand"
        />

        {/* Content Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Content Title / Catchy Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Collection Unboxing"
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
            placeholder="Describe the content idea..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Content Category */}
        <CustomSelect
          label="Content Category"
          required
          searchable
          searchPlaceholder="Search categories..."
          options={categorySelectOptions}
          value={categoryId}
          onChange={setCategoryId}
          placeholder="Select Content Category"
        />

        {/* Assign Creators */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Assigned Creators *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {creators.map((c) => {
              const isSelected = selectedCreatorIds.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleCreator(c.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <CreatorAvatar creator={c} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">@{c.username}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomSelect
            label="Shoot Status"
            options={shootStatusOptions}
            value={shootStatus}
            onChange={(val) => setShootStatus(val as ShootStatus)}
          />
          <CustomSelect
            label="Post Status"
            options={postStatusOptions}
            value={postStatus}
            onChange={(val) => setPostStatus(val as PostStatus)}
          />
        </div>

        {/* Shoot & Post Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Shoot Date *
            </label>
            <input
              type="date"
              required
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Post Date *
            </label>
            <input
              type="date"
              required
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {dateWarning && (
          <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
            {dateWarning}
          </p>
        )}

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Priority Level
          </label>
          <div className="flex items-center gap-2">
            {priorityOptions.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  priority === p
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Reference URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Reference Link / Asset URL (Optional)
          </label>
          <input
            type="url"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="https://tiktok.com/@..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Internal Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          {canManageCreators ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeEditContent}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </BottomSheet>
  );
};
