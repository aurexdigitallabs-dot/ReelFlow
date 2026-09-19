import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';
import { BrandAdmin } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { SingleAvatar } from '../common/CreatorAvatar';
import { Shield, Plus, Mail, Trash2, Edit2, Check, UserCheck, AlertCircle, Loader2, Store as StoreIcon, ShieldCheck } from 'lucide-react';

interface BrandAdminsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAdminsModal: React.FC<BrandAdminsModalProps> = ({ isOpen, onClose }) => {
  const { stores, brandAdmins, addBrandAdmin, updateBrandAdmin, deleteBrandAdmin, sendBrandAdminOnboardingEmail } = useApp();
  const { showToast, showConfirm } = useUI();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<BrandAdmin | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setSelectedStoreIds([]);
    setErrorMsg('');
    setIsAddingNew(false);
    setEditingAdmin(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAddingNew(true);
    // By default select the first store if available
    if (stores.length > 0) {
      setSelectedStoreIds([stores[0].id]);
    }
  };

  const handleStartEdit = (admin: BrandAdmin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setSelectedStoreIds(admin.assignedStoreIds || []);
    setIsAddingNew(false);
    setErrorMsg('');
  };

  const toggleStoreSelection = (storeId: string) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter both name and email.');
      return;
    }

    if (selectedStoreIds.length === 0) {
      setErrorMsg('Please assign at least one brand/store to this admin.');
      return;
    }

    const emailClean = email.trim().toLowerCase();

    // Check duplicate
    if (
      !editingAdmin &&
      brandAdmins.some((a) => a.email.toLowerCase() === emailClean)
    ) {
      setErrorMsg('A brand admin with this email already exists.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (editingAdmin) {
        await updateBrandAdmin(editingAdmin.id, {
          name: name.trim(),
          email: emailClean,
          assignedStoreIds: selectedStoreIds
        });
        showToast(`Brand Admin "${name.trim()}" updated successfully!`, 'success');
      } else {
        await addBrandAdmin({
          name: name.trim(),
          email: emailClean,
          assignedStoreIds: selectedStoreIds,
          status: 'Active',
          onboarded: false
        });
        showToast(`Brand Admin "${name.trim()}" created & invite email triggered!`, 'success');
      }
      resetForm();
    } catch (err: any) {
      console.error('Error saving brand admin:', err);
      setErrorMsg(err?.message || 'Failed to save brand admin.');
      showToast('Failed to save brand admin', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (admin: BrandAdmin) => {
    showConfirm({
      title: 'Remove Brand Admin',
      message: `Are you sure you want to remove "${admin.name}" as Brand Admin? They will lose access to assigned brands.`,
      isDestructive: true,
      confirmText: 'Remove Admin',
      onConfirm: async () => {
        try {
          await deleteBrandAdmin(admin.id);
          showToast(`Brand Admin "${admin.name}" removed.`, 'info');
        } catch (err) {
          showToast('Failed to remove admin.', 'error');
        }
      }
    });
  };

  const handleSendInvite = async (admin: BrandAdmin) => {
    setSendingEmailId(admin.id);
    try {
      const res = await sendBrandAdminOnboardingEmail(admin);
      if (res.success) {
        if (res.warning) {
          showToast(res.warning, 'info');
        } else {
          showToast(`Onboarding invite email sent to ${admin.email}!`, 'success');
        }
      } else {
        showToast(res.error || 'Failed to send invite email.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to send invite email.', 'error');
    } finally {
      setSendingEmailId(null);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Brand Admins & Access Control"
      subtitle="Onboard brand admins who can only access their assigned stores/brands"
      maxHeight="90vh"
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-100 text-xs">Brand Admin Roster</h4>
              <p className="text-[10px] text-gray-400">
                {brandAdmins.length} registered brand admin(s)
              </p>
            </div>
          </div>

          {!isAddingNew && !editingAdmin && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" /> Add Brand Admin
            </button>
          )}
        </div>

        {/* Add / Edit Form Drawer */}
        {(isAddingNew || editingAdmin) && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 flex flex-col gap-3 animate-fade-in shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-gray-200 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                {editingAdmin ? `Edit Admin: ${editingAdmin.name}` : 'New Brand Admin Setup'}
              </span>
              <button
                type="button"
                onClick={resetForm}
                className="text-[11px] text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Admin Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Admin Email (Google Account) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@brandclient.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Admin will log in with this Google email to access assigned brands.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1.5">
                Assign Brands / Stores * ({selectedStoreIds.length} selected)
              </label>
              {stores.length === 0 ? (
                <p className="text-gray-500 text-[11px]">No stores available. Please create a store first.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1">
                  {stores.map((store) => {
                    const isSelected = selectedStoreIds.includes(store.id);
                    return (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => toggleStoreSelection(store.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate text-xs font-medium">{store.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {editingAdmin ? 'Save Changes' : 'Create & Send Invite Email'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* List of Registered Brand Admins */}
        <div className="flex flex-col gap-2.5">
          {brandAdmins.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-gray-500">
              <Shield className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No Brand Admins onboarded yet.</p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Click "+ Add Brand Admin" to onboard client managers with store-scoped access.
              </p>
            </div>
          ) : (
            brandAdmins.map((admin) => {
              const assignedStores = stores.filter((s) =>
                (admin.assignedStoreIds || []).includes(s.id)
              );
              const isSending = sendingEmailId === admin.id;

              return (
                <div
                  key={admin.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex flex-col gap-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SingleAvatar name={admin.name} sizeClass="w-9 h-9 text-xs" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-gray-100 text-xs truncate">
                            {admin.name}
                          </h5>
                          <span className="badge px-1.5 py-0.2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[9px] font-semibold">
                            Brand Admin
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 truncate">{admin.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(admin)}
                        className="p-1.5 text-gray-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Admin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(admin)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Brands Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1 mr-1">
                      <StoreIcon className="w-3 h-3 text-indigo-400" /> Assigned Brands:
                    </span>
                    {assignedStores.length === 0 ? (
                      <span className="text-[10px] text-amber-400 italic">No stores assigned</span>
                    ) : (
                      assignedStores.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-medium text-gray-300"
                        >
                          {s.name}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Onboarding Status & Email Invite Action */}
                  <div className="flex items-center justify-between pt-1">
                    {admin.onboarded ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                        <UserCheck className="w-3 h-3" /> Account Onboarded
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10px] text-amber-300 font-medium">
                          Onboarding Pending
                        </span>
                      </div>
                    )}

                    {!admin.onboarded && (
                      <button
                        type="button"
                        disabled={isSending}
                        onClick={() => handleSendInvite(admin)}
                        className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 active:scale-95 disabled:opacity-50 cursor-pointer"
                        title={`Send onboarding invite email to ${admin.email}`}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3" /> Send Invite Email
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
