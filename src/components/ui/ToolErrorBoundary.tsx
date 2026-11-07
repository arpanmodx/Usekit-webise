import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ToolErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tool rendering caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    // If it was a chunk loading / dynamic import failure, reload the window once to fetch fresh assets
    if (this.state.error?.message?.includes('fetch dynamically imported module') || this.state.error?.name === 'TypeError') {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tool Temporarily Reloading
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              A newer version of this tool was published. Click the button below to load the latest bundle into your browser.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={this.handleRetry}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Tool</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
