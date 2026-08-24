'use client';

import React, { useState } from 'react';
import { Mic, Square, UploadCloud, FileText, RotateCcw, Sparkles } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { PRESET_MEETINGS } from '@/data/presetMeetings';

interface AudioUploaderProps {
  onAnalyze: (transcript: string, contextTitle?: string) => Promise<void>;
  isLoading: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'record' | 'upload' | 'text'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_MEETINGS[0].id);
  const [rawText, setRawText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribeAndAnalyzeBlob = async (blob: Blob, fileName: string) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, fileName);

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transcription failed');

      await onAnalyze(data.transcript, 'Recorded Voice Memo');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transcription failed';
      alert(`Transcription Notice: ${msg}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const text = await file.text();
      setRawText(text);
      setActiveTab('text');
      return;
    }

    setUploadedFile(file);
  };

  const handleAnalyzeUpload = async () => {
    if (!uploadedFile) return;
    await handleTranscribeAndAnalyzeBlob(uploadedFile, uploadedFile.name);
  };

  const handleAnalyzePreset = async () => {
    const preset = PRESET_MEETINGS.find((p) => p.id === selectedPresetId);
    if (preset) {
      await onAnalyze(preset.transcript, preset.title);
    }
  };

  const handleAnalyzeRawText = async () => {
    if (!rawText.trim()) return;
    await onAnalyze(rawText.trim(), 'Direct Text Transcript');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      {/* Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-800 pb-4 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('preset')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'preset'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>✨ Sample Demos</span>
        </button>

        <button
          onClick={() => setActiveTab('record')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'record'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>🎙️ Record Voice</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-purple-400 shrink-0" />
          <span>📁 Upload Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'text'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
          <span>📝 Paste Notes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[220px] flex flex-col justify-between">
        {/* 1. Preset Tab */}
        {activeTab === 'preset' && (
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
              Select a 1-Click Demo Scenario
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {PRESET_MEETINGS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-slate-100 text-sm mb-1">{preset.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>⏱ {preset.duration}</span>
                    <span>•</span>
                    <span>👥 {preset.participants.length} speakers</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleAnalyzePreset}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Extracting Meeting Intelligence...' : 'Analyze Selected Meeting Now'}
            </button>
          </div>
        )}

        {/* 2. Record Tab */}
        {activeTab === 'record' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-mono font-bold text-slate-100 mb-2">
                {formatTimer(recordingTime)}
              </div>
              <p className="text-xs text-slate-400">
                {isRecording ? '🔴 Listening & Recording...' : audioBlob ? 'Audio captured' : 'Ready to record voice memo'}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading || isTranscribing}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  {audioBlob ? 'Record Again' : 'Start Recording'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold flex items-center gap-2 transition-all animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  Stop Recording
                </button>
              )}

              {audioUrl && !isRecording && (
                <button
                  onClick={resetRecording}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 border border-slate-700"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {audioUrl && !isRecording && (
              <div className="w-full flex flex-col items-center gap-4">
                <audio src={audioUrl} controls className="w-full max-w-md h-10" />
                <button
                  onClick={() => audioBlob && handleTranscribeAndAnalyzeBlob(audioBlob, 'memo.webm')}
                  disabled={isLoading || isTranscribing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  {isTranscribing
                    ? 'Transcribing with Whisper AI...'
                    : isLoading
                    ? 'Analyzing...'
                    : 'Transcribe & Extract Tasks'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-800/30 mb-4 text-center">
              <UploadCloud className="w-10 h-10 text-purple-400 mb-3 mx-auto" />
              <p className="font-bold text-slate-200 text-sm mb-1">
                {uploadedFile ? uploadedFile.name : 'Click to upload audio file or drag & drop here'}
              </p>
              <p className="text-xs text-slate-400">Supports .mp3, .wav, .m4a, .webm, or .txt/.md transcripts</p>
              <input
                type="file"
                accept="audio/*,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFile && (
              <button
                onClick={handleAnalyzeUpload}
                disabled={isLoading || isTranscribing}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                {isTranscribing
                  ? 'Transcribing audio with Whisper AI...'
                  : isLoading
                  ? 'Analyzing...'
                  : `Transcribe & Analyze ${uploadedFile.name}`}
              </button>
            )}
          </div>
        )}

        {/* 4. Text Tab */}
        {activeTab === 'text' && (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw conversation transcript, team meeting notes, or minutes here..."
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 mb-4 font-mono"
            />
            <button
              onClick={handleAnalyzeRawText}
              disabled={isLoading || !rawText.trim()}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Extracting Meeting Intelligence...' : 'Analyze Pasted Notes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};