// Web Audio API chime and notification utilities
export function playHospitalChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Melodic hospital notification chord: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.35, gain: 0.25 },
      { freq: 659.25, time: 0.2, dur: 0.35, gain: 0.25 },
      { freq: 783.99, time: 0.4, dur: 0.45, gain: 0.28 },
      { freq: 1046.50, time: 0.65, dur: 0.75, gain: 0.3 },
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime + note.time);
      gainNode.gain.exponentialRampToValueAtTime(note.gain, ctx.currentTime + note.time + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.time + note.dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });
  } catch (err) {
    console.warn('Could not play notification audio:', err);
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

export function sendBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch {}
  }
}
