'use client';

import React, { useState } from 'react';
import { MeetingAnalysis } from '@/types/meeting';
import { ActionItemsBoard } from './ActionItemsBoard';
import {
  FileText,
  CheckCircle,
  Mail,
  Layers,
  Sparkles,
  Copy,
  Check,
  Activity,
  ListTodo,
} from 'lucide-react';

interface MeetingIntelligenceViewProps {
  analysis: MeetingAnalysis;
  rawTranscript?: string;
}

export const MeetingIntelligenceView: React.FC<MeetingIntelligenceViewProps> = ({
  analysis,
  rawTranscript,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'actions' | 'topics' | 'email' | 'transcript'>('summary');
  const [actionItems, setActionItems] = useState(analysis.actionItems || []);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(analysis.followUpEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Metadata Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Meeting Intelligence
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{analysis.title}</h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Tone: <strong className="text-slate-200">{analysis.sentimentAndTone}</strong></span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'summary'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Executive Summary & Decisions
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'actions'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            Action Items ({actionItems.length})
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'topics'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Key Topics ({analysis.keyTopics?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'email'
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Follow-Up Email Draft
          </button>

          {rawTranscript && (
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'transcript'
                  ? 'bg-slate-700 text-slate-100 border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Transcript
            </button>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Executive Summary */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Executive Summary
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {analysis.executiveSummary}
            </div>
          </div>

          {/* Key Decisions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Key Decisions Made
            </h3>
            <div className="space-y-2.5">
              {analysis.keyDecisions?.map((dec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{dec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <ActionItemsBoard items={actionItems} onToggleItem={toggleActionItem} />
      )}

      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.keyTopics?.map((topic, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Topic {idx + 1}
              </span>
              <h4 className="text-base font-bold text-slate-100 mt-1 mb-2">{topic.topic}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{topic.summary}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'email' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Ready-to-Send Follow-up Email</h3>
              <p className="text-xs text-slate-400">Pre-drafted executive recap ready for attendee distribution</p>
            </div>
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-medium transition-all shadow-md cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEmail ? 'Copied to Clipboard' : 'Copy Email'}
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {analysis.followUpEmail}
          </div>
        </div>
      )}

      {activeTab === 'transcript' && rawTranscript && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-slate-100 mb-3">Raw Transcript</h3>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-400 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
            {rawTranscript}
          </div>
        </div>
      )}
    </div>
  );
};