import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { MeetingAnalysis } from '@/types/meeting';

// Active models verified on your Groq workspace
const CANDIDATE_MODELS = [
  'groq/compound-mini',
  'groq/compound',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b',
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured in .env.local' },
        { status: 500 }
      );
    }

    const { transcript, meetingContext } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required for analysis' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are an elite Executive Chief of Staff and Technical Program Manager.
Your job is to analyze transcripts of team meetings, sales calls, or brainstorms, and extract highly structured, actionable intelligence.

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "title": "Concise, descriptive meeting title",
  "executiveSummary": "A clear 2-3 paragraph executive summary covering key objectives, main discussion points, and outcomes.",
  "keyDecisions": [
    "List of concrete decisions finalized during the meeting"
  ],
  "actionItems": [
    {
      "id": "act-1",
      "task": "Specific actionable task description",
      "owner": "Person or team responsible (or 'Unassigned' if not specified)",
      "priority": "High",
      "deadline": "Clear deadline or timeframe (e.g. 'By Friday EOD', 'Next Sprint', 'ASAP')"
    }
  ],
  "keyTopics": [
    {
      "topic": "Topic Name",
      "summary": "Key discussion summary for this topic"
    }
  ],
  "sentimentAndTone": "Brief assessment of meeting tone, team alignment, and momentum.",
  "followUpEmail": "A professionally formatted email ready to send to attendees summarizing the meeting and action items."
}`;

    const userPrompt = `Meeting Context (Optional): ${meetingContext || 'General Team Sync'}

Full Meeting Transcript:
"""
${transcript}
"""

Extract the meeting intelligence and return ONLY the JSON object.`;

    let completion: any = null;
    let lastError: any = null;

    // Automatic fallback across verified models
    for (const model of CANDIDATE_MODELS) {
      try {
        completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        });
        if (completion?.choices?.[0]?.message?.content) {
          break; // Success
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying next candidate:`, err?.message || err);
        lastError = err;
      }
    }

    if (!completion || !completion.choices?.[0]?.message?.content) {
      throw new Error(lastError?.message || 'All candidate models failed to respond.');
    }

    const rawContent = completion.choices[0].message.content.trim();
    const analysis: MeetingAnalysis = JSON.parse(rawContent);

    // Ensure IDs and completion state exist on action items
    if (analysis.actionItems) {
      analysis.actionItems = analysis.actionItems.map((item, idx) => ({
        ...item,
        id: item.id || `act-${idx + 1}`,
        completed: false,
      }));
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Meeting Analysis API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze meeting transcript' },
      { status: 500 }
    );
  }
}