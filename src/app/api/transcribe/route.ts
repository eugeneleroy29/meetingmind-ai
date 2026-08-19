import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured in .env.local' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('file') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided in request' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    // Try whisper-large-v3-turbo first, fallback to whisper-large-v3
    let transcriptionText = '';
    try {
      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-large-v3-turbo',
        response_format: 'verbose_json',
        language: 'en',
      });
      transcriptionText = transcription.text;
    } catch (primaryErr) {
      console.warn('Whisper Turbo failed, retrying with whisper-large-v3:', primaryErr);
      const fallback = await groq.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-large-v3',
        response_format: 'verbose_json',
        language: 'en',
      });
      transcriptionText = fallback.text;
    }

    return NextResponse.json({
      success: true,
      transcript: transcriptionText.trim(),
    });
  } catch (error: any) {
    console.error('Transcription API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}