# 🎙️ MeetingMind AI — Voice & Meeting Intelligence Engine

> Sub-second audio transcription, executive briefings, and automated action item extraction powered by Groq Whisper & Compound AI.


---

## ⚡ Overview

**`MeetingMind AI`** eliminates manual meeting documentation. It captures audio from live voice memos, uploaded recordings (`.mp3`, `.wav`, `.m4a`, `.webm`), or pasted transcripts, processes the conversation using Groq Whisper (`whisper-large-v3-turbo`) in sub-second latency, and extracts:

* 📋 **Executive Summary:** High-level executive overview covering key objectives and outcomes.
* ✅ **Action Item Tracker:** Assigned owners, deadlines, priority levels (High/Medium/Low), and interactive completion checkmarks.
* 🎯 **Key Decisions Log:** Concrete, audit-ready decisions finalized during the session.
* 💡 **Topic Deep-Dives:** Structured breakdown of individual discussion threads.
* ✉️ **Ready-to-Send Follow-up Email:** Pre-drafted recap ready for instant attendee distribution.

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      MeetingMind UI                         │
│  [ Preset Demos ] ── [ Live Voice Memo ] ── [ Audio Upload ]│
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  Web Audio / Blobs   │        │   Raw Transcripts    │
    └──────────┬───────────┘        └──────────┬───────────┘
               │                               │
               ▼                               │
    ┌──────────────────────────────────┐       │
    │ Groq Whisper Turbo (/transcribe) │       │
    │  (Sub-second Speech-to-Text STT) │       │
    └──────────────────┬───────────────┘       │
                       │                       │
                       ▼                       ▼
    ┌──────────────────────────────────────────────────────────┐
    │      Groq Compound Reasoning Engine (/analyze)           │
    │  (JSON Schema Extraction: Summary, Actions, & Email)     │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │               Interactive Intelligence Board             │
    │   • Action Items Board with Priority Filters             │
    │   • 1-Click Copyable Recap Email & Task Markdown         │
    └──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React
* **Speech-to-Text (STT):** Groq Whisper Turbo (`whisper-large-v3-turbo`)
* **Reasoning & Extraction (LLM):** Groq (`groq/compound-mini` / `groq/compound`)
* **Audio Capture:** HTML5 `MediaRecorder` API & Web Audio Streams

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/eugeneleroy29/meetingmind-ai.git
cd meetingmind-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 👤 Author

* **Eugene Leroy** ([@eugeneleroy29](https://github.com/eugeneleroy29))
* **Commercial Flagship SaaS:** [ForgeCV](https://www.forgecv.org)
