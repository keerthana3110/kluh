'use client';

/**
 * ElevenLabs TTS Narrator — Single-voice, no overlap
 * Uses ElevenLabs API if NEXT_PUBLIC_ELEVENLABS_API_KEY is set.
 * Falls back to Web Speech API otherwise.
 */

const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
const ELEVENLABS_API_KEY  = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY  || '';

let currentAudio: HTMLAudioElement | null = null;
let isSpeaking = false; // global lock — only one voice at a time

/** Stop ALL audio immediately (ElevenLabs + browser TTS) */
export const stopKeynoteVoice = () => {
  isSpeaking = false;

  // Stop ElevenLabs audio element
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }

  // Stop browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/** ElevenLabs TTS — returns Promise that resolves when audio ends */
const speakViaElevenLabs = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    // Kill everything currently playing first
    stopKeynoteVoice();
    isSpeaking = true;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.52,
              similarity_boost: 0.88,
              style: 0.30,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn(`ElevenLabs error ${response.status}: ${response.statusText}`);
        isSpeaking = false;
        return resolve();
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudio = audio;

      const done = () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        isSpeaking = false;
        resolve();
      };

      audio.onended = done;
      audio.onerror = done;

      await audio.play().catch(done);
    } catch (err) {
      console.warn('ElevenLabs TTS failed:', err);
      isSpeaking = false;
      resolve();
    }
  });
};

/** Browser Web Speech API fallback */
const speakViaBrowser = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();

    // Always kill any running speech first
    window.speechSynthesis.cancel();
    isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('en') && (
        v.name.includes('Natural') || v.name.includes('Google') ||
        v.name.includes('Samantha') || v.name.includes('Daniel')
      ));
    if (preferred) utterance.voice = preferred;

    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      isSpeaking = false;
      resolve();
    };

    utterance.onend = done;
    utterance.onerror = done;

    window.speechSynthesis.speak(utterance);

    // Chrome stall watchdog — check every 500ms if speech stopped without firing onend
    const watchdog = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(watchdog);
        done();
      }
    }, 500);

    utterance.onend = () => { clearInterval(watchdog); done(); };
  });
};

/**
 * Main export — speaks text and waits until done.
 * Uses ElevenLabs if API key present, else browser TTS.
 * Always kills any previous audio before starting.
 */
export const speakAndWait = (text: string, isMuted: boolean = false): Promise<void> => {
  if (isMuted) {
    stopKeynoteVoice();
    return Promise.resolve();
  }
  if (ELEVENLABS_API_KEY) return speakViaElevenLabs(text);
  return speakViaBrowser(text);
};
