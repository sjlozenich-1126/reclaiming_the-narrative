import { User } from 'firebase/auth';
import { LogIn, LogOut, Moon, ShieldCheck, Sun, Type, X } from 'lucide-react';
import { AppRoute } from '../types/journal';

interface SettingsDrawerProps {
  open: boolean;
  darkMode: boolean;
  largeText: boolean;
  user: User | null;
  isAdmin: boolean;
  authError: string | null;
  onClose: () => void;
  onToggleDarkMode: () => void;
  onToggleLargeText: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function SettingsDrawer({
  open,
  darkMode,
  largeText,
  user,
  isAdmin,
  authError,
  onClose,
  onToggleDarkMode,
  onToggleLargeText,
  onSignIn,
  onSignOut,
  onNavigate,
}: SettingsDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[2px] no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Reader & Editorial Settings"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 w-full max-w-md h-full overflow-y-auto bg-[#F8F7F4] dark:bg-[#151513] border-l-2 border-[#0A0A0A] dark:border-[#F5F4F0] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-5 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                Preferences &amp; Access
              </p>
              <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
                Journal Settings
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="w-10 h-10 inline-flex items-center justify-center border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Appearance & Reading Controls */}
          <div className="py-6 space-y-6 border-b border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-[#F87171] mt-0.5 shrink-0" />
                ) : (
                  <Sun className="w-5 h-5 text-[#E21B1B] mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className="font-sans text-base font-semibold text-[#0A0A0A] dark:text-[#F5F4F0]">
                    Dark Mode Edition
                  </h3>
                  <p className="text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] mt-0.5 leading-relaxed">
                    Switch between warm archival newsprint and midnight ink reading mode.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={darkMode}
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center border transition-colors ${
                  darkMode
                    ? 'bg-[#DC2626] border-[#F87171]'
                    : 'bg-white border-[#0A0A0A]'
                }`}
              >
                <span className="sr-only">Toggle Dark Mode</span>
                <span
                  className={`inline-block h-5 w-5 transform transition-transform ${
                    darkMode
                      ? 'translate-x-6 bg-white'
                      : 'translate-x-1 bg-[#0A0A0A]'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Type className="w-5 h-5 text-[#0A0A0A]/70 dark:text-[#9D9A91] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-sans text-base font-semibold text-[#0A0A0A] dark:text-[#F5F4F0]">
                    Expanded Reading Measure
                  </h3>
                  <p className="text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] mt-0.5 leading-relaxed">
                    Increase article body typography size for sustained long-form reading.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={largeText}
                onClick={onToggleLargeText}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center border transition-colors ${
                  largeText
                    ? 'bg-[#E21B1B] border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#F87171]'
                    : 'bg-white border-[#0A0A0A] dark:bg-[#0C0C0B] dark:border-[#F5F4F0]/40'
                }`}
              >
                <span className="sr-only">Toggle Expanded Reading Size</span>
                <span
                  className={`inline-block h-5 w-5 transform transition-transform ${
                    largeText
                      ? 'translate-x-6 bg-white'
                      : 'translate-x-1 bg-[#0A0A0A] dark:bg-[#9D9A91]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Author & Editorial Admin Section */}
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E21B1B] dark:text-[#F87171]" />
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                Editorial Administration
              </h3>
            </div>

            {user ? (
              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#0C0C0B] p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#F5F4F0]">
                    {user.displayName || 'Authenticated Account'}
                  </p>
                  <p className="font-mono text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] truncate">
                    {user.email}
                  </p>
                </div>

                {isAdmin ? (
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#E21B1B] dark:text-[#F87171] font-bold">
                      Verified Editorial Admin Access Active
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate({ view: 'admin' });
                      }}
                      className="w-full py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] transition-colors"
                    >
                      Open Editorial Publishing Desk
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] leading-relaxed">
                    This account does not have editorial administrator permissions for publishing articles.
                  </p>
                )}

                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A] dark:text-[#F5F4F0] hover:border-[#0A0A0A] dark:hover:border-[#F5F4F0]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#0C0C0B] p-4 space-y-3">
                <p className="text-sm text-[#0A0A0A]/80 dark:text-[#D4D2CC] leading-relaxed">
                  Author sign-in for <strong>Shane J. Lozenich</strong> to compose articles, upload figures, manage custom tags, and review newsletter subscribers.
                </p>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#0A0A0A] text-[#F8F7F4] dark:bg-[#F5F4F0] dark:text-[#0A0A0A] hover:bg-[#E21B1B] hover:text-white dark:hover:bg-[#DC2626] dark:hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Sign In with Google
                </button>
              </div>
            )}

            {authError && (
              <p className="text-xs text-[#E21B1B] dark:text-[#F87171] leading-relaxed">
                {authError}
              </p>
            )}
          </div>
        </div>

        <div className="pt-5 border-t border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20 font-mono text-[11px] uppercase tracking-[0.1em] text-[#0A0A0A]/60 dark:text-[#9D9A91]">
          <p>Reclaiming the Narrative · Shane J. Lozenich</p>
        </div>
      </aside>
    </div>
  );
}
