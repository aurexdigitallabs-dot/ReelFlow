import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ReelFlowLogo } from './ReelFlowLogo';
import { RotateCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ReelFlow Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-gray-100 selection:bg-indigo-500">
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center gap-5">
            <ReelFlowLogo size="md" showSubtitle={false} />

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                An unexpected error occurred while loading this view.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-left overflow-x-auto text-[11px] font-mono text-rose-400">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
