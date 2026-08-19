'use client';

import React, { useState } from 'react';
import { AudioUploader } from '@/components/AudioUploader';
import { MeetingIntelligenceView } from '@/components/MeetingIntelligenceView';
import { MeetingAnalysis } from '@/types/meeting';
import { Sparkles, Brain, ArrowUpRight, Zap } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');

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
    } catch (err: any) {
      alert(`Analysis Error: ${err.message}`);
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
                Groq Whisper & LLaMA 3.3
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/eugeneleroy29"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
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
          <Zap className="w-3.5 h-3.5" />
          Sub-Second Audio Transcription & Action Item Extraction
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Turn Raw Audio & Meetings into Actionable Intelligence
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
          Record voice memos or upload team calls. Groq Whisper and LLaMA 3.3 extract executive summaries,
          assign action items with deadlines, and draft distribution emails in seconds.
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
                Parsing discussion threads, extracting decisions, and assigning action item owners
              </p>
            </div>
          </div>
        )}

        {/* Intelligence View */}
        {analysis && !isLoading && (
          <MeetingIntelligenceView analysis={analysis} rawTranscript={currentTranscript} />
        )}
      </div>
    </main>
  );
}