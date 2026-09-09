import React from 'react';
import { useUI } from '../../context/UIContext';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const GlobalDialogs: React.FC = () => {
  const { alertState, confirmState, closeAlert, closeConfirm } = useUI();

  return (
    <>
      {/* Alert Modal */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeAlert} />
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {alertState.type === 'error' && <XCircle className="w-6 h-6 text-rose-500" />}
                {alertState.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-500" />}
                {alertState.type === 'success' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                {alertState.type === 'info' && <Info className="w-6 h-6 text-indigo-500" />}
                <h2 className="text-lg font-bold text-white">{alertState.title}</h2>
              </div>
              <button
                onClick={closeAlert}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              {alertState.message}
            </p>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={closeAlert}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => {
            if (confirmState.onCancel) confirmState.onCancel();
            closeConfirm();
          }} />
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {confirmState.isDestructive ? (
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                ) : (
                  <Info className="w-6 h-6 text-indigo-500" />
                )}
                <h2 className="text-lg font-bold text-white">{confirmState.title}</h2>
              </div>
              <button
                onClick={() => {
                  if (confirmState.onCancel) confirmState.onCancel();
                  closeConfirm();
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              {confirmState.message}
            </p>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  if (confirmState.onCancel) confirmState.onCancel();
                  closeConfirm();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {confirmState.cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => {
                  confirmState.onConfirm();
                  closeConfirm();
                }}
                className={`px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors ${
                  confirmState.isDestructive 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {confirmState.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
