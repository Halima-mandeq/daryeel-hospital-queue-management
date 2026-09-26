// Web Audio API Hospital Announcement Chime
let audioCtx: AudioContext | null = null;

export function playHospitalChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Tone 1 (High bell chime)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.65);

    // Tone 2 (Higher resolution chime)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.22); // A5
    gain2.gain.setValueAtTime(0, now + 0.22);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.26);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.95);
  } catch {
    // Audio Context not allowed or unsupported; safe fallback without error
  }
}

/**
 * Natural Somali / English Audio Voice Announcer for Waiting Room TV & Calling
 * Plays chime first, followed by clear vocal announcement
 */
export function announceCallingPatient(
  ticketNumber: string, 
  roomName: string, 
  doctorName?: string, 
  lang: 'so' | 'en' = 'so'
): void {
  // 1. Play Chime
  playHospitalChime();

  // 2. Play vocal speech via SpeechSynthesis after chime completes
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    setTimeout(() => {
      try {
        window.speechSynthesis.cancel(); // Stop any pending utterances

        // Format spoken ticket for natural pronunciation (e.g., "E 0 1" instead of "E minus zero one")
        const formattedTicket = ticketNumber.replace('-', ' ');
        
        let announcementText = '';
        if (lang === 'so') {
          announcementText = doctorName 
            ? `Tikidh lambar ${formattedTicket}. Fadlan tag ${roomName}, ${doctorName}.`
            : `Tikidh lambar ${formattedTicket}. Fadlan u gudub ${roomName}.`;
        } else {
          announcementText = doctorName
            ? `Ticket number ${formattedTicket}. Please proceed to ${roomName}, ${doctorName}.`
            : `Ticket number ${formattedTicket}. Please proceed to ${roomName}.`;
        }

        const utterance = new SpeechSynthesisUtterance(announcementText);
        utterance.rate = 0.88; // Slower, clearer hospital tempo
        utterance.pitch = 1.05; // Friendly, clear chime pitch
        utterance.volume = 1.0;

        // Try to pick an appropriate language voice if available
        const voices = window.speechSynthesis.getVoices();
        const somaliVoice = voices.find(v => v.lang.startsWith('so') || v.lang.startsWith('ar') || v.lang.startsWith('sw'));
        const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        utterance.voice = somaliVoice || defaultVoice || null;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis voice announcement error:', err);
      }
    }, 750);
  }
}

