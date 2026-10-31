import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  Mail,
  Building,
  Clock,
  Shield,
  Save,
  Check,
  Calendar,
  Sparkles,
  FileBarChart2,
  Inbox
} from 'lucide-react';
import { mailMindApi } from '../services/api';
import { UserProfile } from '../services/types';

export const ProfilePage: React.FC = () => {
  const { onRefreshApp } = useOutletContext<any>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const p = await mailMindApi.getUserProfile();
        setProfile(p);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      await mailMindApi.updateUserProfile(profile);
      setSaveSuccess(true);
      onRefreshApp();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading user profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>User Profile & Workspace Account</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage your personal executive details, organization affiliation, and email preferences
        </p>
      </div>

      {/* Profile Overview Card with Avatar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {profile.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
          <p className="text-xs text-slate-600 pt-1">
            {profile.organization} · Connected since {profile.connectedSince}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.timezone}</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>SOC2 Secure Mode Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lifetime Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-400 uppercase font-semibold text-[10px]">
            Lifetime Emails Analyzed
          </span>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {profile.emailsProcessedAllTime.toLocaleString()}
          </p>
          <span className="text-slate-500 text-[11px]">Via n8n Automation</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-400 uppercase font-semibold text-[10px]">
            Executive Briefs Sent
          </span>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {profile.reportsSentAllTime}
          </p>
          <span className="text-slate-500 text-[11px]">Daily & Weekly digests</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="text-slate-400 uppercase font-semibold text-[10px]">
            Estimated Time Recovered
          </span>
          <p className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
            ~142 hrs
          </p>
          <span className="text-slate-500 text-[11px]">Eliminated manual inbox triage</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
          Personal Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Executive Role / Title
            </label>
            <input
              type="text"
              required
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Organization / Company
            </label>
            <input
              type="text"
              value={profile.organization}
              onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Preferred Timezone
            </label>
            <input
              type="text"
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Profile updated!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
