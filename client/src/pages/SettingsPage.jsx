import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import {
  User,
  ShieldCheck,
  Trash2,
  Lock,
  CheckCircle,
  Database,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import DeleteAccountModal from '../components/DeleteAccountModal';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ totalScans: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      userAPI
        .getProfile()
        .then((res) => {
          if (res.data?.stats) setStats(res.data.stats);
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your authenticated identity, review zero-retention policies, and exercise full GDPR compliance controls.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-16 h-16 rounded-full ring-4 ring-brand-500/20 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-bold text-2xl flex items-center justify-center">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
                {user.name}
              </h2>
              {user.isDemoUser && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Demo User
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <span className="text-[11px] text-slate-400">
              Account created on {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Authentication Provider:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-500" />
              {user.googleId ? 'Google OAuth 2.0 (Verified)' : 'Local Session'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Saved Resume Analyses:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              {stats.totalScans} Scan Records Stored
            </p>
          </div>
        </div>
      </div>

      {/* Zero-Retention Guarantee & Privacy Policy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold font-heading text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Enterprise Zero-Retention File Policy
        </div>

        <p className="text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
          Your uploaded PDF or Word document is ingested into a transient in-memory RAM buffer. As soon as the layout-aware text extraction finishes, the binary buffer is actively destroyed from memory. <strong>No raw resume file is ever persisted to server storage or third-party cloud buckets.</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Strict per-user data isolation in MongoDB</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>HttpOnly, SameSite secure cookie sessions</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: GDPR Account & Data Deletion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone: Delete Account & All Data
          </h3>
          <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1 leading-relaxed">
            In compliance with GDPR "Right to be Forgotten", clicking this will cascade delete your user profile and permanently purge every resume analysis recorded under your account.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account & All Data
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
