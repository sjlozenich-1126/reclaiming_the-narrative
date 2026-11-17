import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred in the journal view.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Journal ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      let friendlyMessage = this.state.message;
      try {
        const parsed = JSON.parse(this.state.message);
        if (parsed && parsed.error) {
          friendlyMessage = `Archive access notice (${parsed.operationType || 'operation'}): ${parsed.error}`;
        }
      } catch {
        // Use raw message
      }

      return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#0A0A0A] dark:bg-[#0C0C0B] dark:text-[#F5F4F0] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full border-2 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] mb-3">
              Editorial Archive Recovery
            </p>
            <h1 className="font-display text-3xl font-bold mb-3">
              Unable to render this folio
            </h1>
            <p className="text-sm leading-relaxed text-[#0A0A0A]/75 dark:text-[#D4D2CC] mb-6">
              {friendlyMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.hash = '#/';
              }}
              className="px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] transition-colors"
            >
              Return to Masthead
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
