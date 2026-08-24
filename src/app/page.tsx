'use client';

import React, { useState } from 'react';
import { AudioUploader } from '@/components/AudioUploader';
import { MeetingIntelligenceView } from '@/components/MeetingIntelligenceView';
import { MeetingAnalysis } from '@/types/meeting';
import { Sparkles, Brain, ArrowUpRight, Code, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [showAuditorMode, setShowAuditorMode] = useState(false);

  const handleAnalyzeMeeting = async (transcript: string, contextTitle?: string) => {
    setIsLoading(true);
    setCurrentTranscript(transcript);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          meetingContext: contextTitle || 'General Sync',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze meeting');

      setAnalysis(data.analysis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      alert(`Notice: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-lg tracking-tight">MeetingMind AI</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                Voice &amp; Meeting Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/eugeneleroy29"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg active:scale-95"
            >
              <span>Eugene Leroy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Sub-Second Audio Transcription &amp; Automated Action Items
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Turn Raw Audio &amp; Discussions into Actionable Next Steps
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
          Record a quick voice memo or upload team meetings. Get instant executive briefings, assigned tasks with deadlines, and ready-to-send follow-up emails in seconds.
        </p>
      </div>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Ingestion Panel */}
        <AudioUploader onAnalyze={handleAnalyzeMeeting} isLoading={isLoading} />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="p-4 bg-blue-600/20 rounded-full border border-blue-500/30">
              <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Extracting Meeting Intelligence...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Synthesizing discussion points, extracting decisions, and structuring action items
              </p>
            </div>
          </div>
        )}

        {/* Intelligence View */}
        {analysis && !isLoading && (
          <MeetingIntelligenceView analysis={analysis} rawTranscript={currentTranscript} />
        )}

        {/* Collapsible Developer & Auditor Drawer */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAuditorMode(!showAuditorMode)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-all"
          >
            <span className="flex items-center gap-2">
              <Code size={14} className="text-blue-400" />
              🔬 Developer &amp; System Telemetry Mode
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-mono">
              {showAuditorMode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {showAuditorMode && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4 text-xs font-mono text-slate-400">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Transcription Engine</p>
                  <p className="text-sky-300 font-bold mt-1 flex items-center gap-1.5">
                    <Activity size={12} className="text-sky-400" /> whisper-large-v3-turbo
                  </p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Extraction Fallback Cascade</p>
                  <p className="text-blue-300 font-bold mt-1">groq/compound-mini &rarr; gpt-oss-120b</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Audio Container Support</p>
                  <p className="text-emerald-300 font-bold mt-1">WebM, MP3, WAV, M4A, Text</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Auditor Note: Transcripts undergo 1-shot structured JSON extraction with deterministic schema constraints, generating priority-tagged action items, topic clustering, and sentiment indicators with sub-second execution.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}