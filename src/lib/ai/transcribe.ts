import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export interface TranscriptResult {
  text: string;
  words: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

export async function transcribeAudio(
  audioBuffer: ArrayBuffer,
  filename = "recording.webm"
): Promise<TranscriptResult> {
  const blob = new Blob([audioBuffer], { type: "audio/webm" });
  const file = new File([blob], filename, { type: "audio/webm" });

  const response = await getOpenAI().audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const words = (response.words ?? []).map((w) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));

  return {
    text: response.text,
    words,
  };
}
