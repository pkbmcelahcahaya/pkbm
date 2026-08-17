// Text-to-Speech (TTS) Service for Accessibility and Learning Content Audio Reader

export interface TtsOptions {
  rate?: number; // 0.5 to 2.0 (default 1.0)
  pitch?: number; // 0.5 to 1.5 (default 1.0)
  lang?: string; // default 'id-ID'
  title?: string;
  onBoundary?: (charIndex: number, word: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export type TtsStatus = 'idle' | 'playing' | 'paused';

type Listener = (state: {
  status: TtsStatus;
  currentText: string;
  currentTitle: string;
  rate: number;
}) => void;

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private status: TtsStatus = 'idle';
  private currentText = '';
  private currentTitle = '';
  private rate = 1.0;
  private listeners: Set<Listener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private chunks: string[] = [];
  private currentChunkIndex = 0;
  private activeOptions: TtsOptions | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public getBestIndonesianVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    // Prioritize Indonesian voices (id-ID, id, indonesian, google bahasa indonesia)
    const idVoice = voices.find(
      v =>
        v.lang === 'id-ID' ||
        v.lang.startsWith('id') ||
        v.name.toLowerCase().includes('indonesia') ||
        v.name.toLowerCase().includes('bahasa')
    );
    if (idVoice) return idVoice;

    // Fallback to default or first available
    return voices.find(v => v.default) || (voices.length > 0 ? voices[0] : null);
  }

  private splitIntoChunks(text: string): string[] {
    // Split long text into manageable sentences (under 180 chars) to prevent browser SpeechSynthesis cutoff
    const sentences = text
      .replace(/\r\n/g, '\n')
      .replace(/\n+/g, '. ')
      .split(/(?<=[.?!;:])\s+/);

    const chunks: string[] = [];
    let current = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      if ((current + ' ' + trimmed).length > 160) {
        if (current) chunks.push(current.trim());
        current = trimmed;
      } else {
        current = current ? current + ' ' + trimmed : trimmed;
      }
    }

    if (current) chunks.push(current.trim());
    return chunks.length > 0 ? chunks : [text];
  }

  private notify() {
    const state = {
      status: this.status,
      currentText: this.currentText,
      currentTitle: this.currentTitle,
      rate: this.rate
    };
    this.listeners.forEach(fn => fn(state));
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn({
      status: this.status,
      currentText: this.currentText,
      currentTitle: this.currentTitle,
      rate: this.rate
    });
    return () => this.listeners.delete(fn);
  }

  public speak(text: string, options: TtsOptions = {}) {
    if (!this.isSupported() || !this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // Clean text from Markdown / HTML tags
    const cleanedText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    // If already playing the same text, toggle pause/play
    if (this.currentText === cleanedText && this.status === 'playing') {
      this.pause();
      return;
    } else if (this.currentText === cleanedText && this.status === 'paused') {
      this.resume();
      return;
    }

    // Stop current speech
    this.stop();

    this.currentText = cleanedText;
    this.currentTitle = options.title || 'Materi Pembelajaran';
    this.rate = options.rate || this.rate || 1.0;
    this.activeOptions = options;

    this.chunks = this.splitIntoChunks(cleanedText);
    this.currentChunkIndex = 0;

    this.playCurrentChunk();
  }

  private playCurrentChunk() {
    if (!this.synth || this.currentChunkIndex >= this.chunks.length) {
      this.status = 'idle';
      this.currentText = '';
      this.currentTitle = '';
      this.notify();
      if (this.activeOptions?.onEnd) {
        this.activeOptions.onEnd();
      }
      return;
    }

    const chunkText = this.chunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    const idVoice = this.getBestIndonesianVoice();

    if (idVoice) {
      utterance.voice = idVoice;
      utterance.lang = idVoice.lang;
    } else {
      utterance.lang = this.activeOptions?.lang || 'id-ID';
    }

    utterance.rate = this.rate;
    utterance.pitch = this.activeOptions?.pitch || 1.0;

    utterance.onstart = () => {
      this.status = 'playing';
      this.notify();
    };

    utterance.onend = () => {
      this.currentChunkIndex++;
      if (this.currentChunkIndex < this.chunks.length) {
        this.playCurrentChunk();
      } else {
        this.status = 'idle';
        this.currentText = '';
        this.currentTitle = '';
        this.notify();
        if (this.activeOptions?.onEnd) {
          this.activeOptions.onEnd();
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS utterance error:', e);
        if (this.activeOptions?.onError) {
          this.activeOptions.onError(e);
        }
      }
      this.status = 'idle';
      this.notify();
    };

    this.currentUtterance = utterance;
    this.status = 'playing';
    this.synth.cancel(); // safety cancel before speak
    this.synth.speak(utterance);
    this.notify();
  }

  public pause() {
    if (!this.synth) return;
    if (this.status === 'playing') {
      this.synth.pause();
      this.status = 'paused';
      this.notify();
    }
  }

  public resume() {
    if (!this.synth) return;
    if (this.status === 'paused') {
      this.synth.resume();
      this.status = 'playing';
      this.notify();
    }
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.status = 'idle';
    this.currentUtterance = null;
    this.currentChunkIndex = 0;
    this.chunks = [];
    this.notify();
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, newRate));
    if (this.status === 'playing' && this.currentText) {
      // restart remaining from current chunk with new rate
      if (this.synth) this.synth.cancel();
      this.playCurrentChunk();
    } else {
      this.notify();
    }
  }

  public getState() {
    return {
      status: this.status,
      currentText: this.currentText,
      currentTitle: this.currentTitle,
      rate: this.rate,
      isSupported: this.isSupported()
    };
  }
}

export const ttsService = new TextToSpeechService();
