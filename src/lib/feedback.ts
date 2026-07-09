type FeedbackKind = 'add' | 'subtract' | 'winner'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return null

  if (!audioContext) {
    audioContext = new AudioContextClass()
  }

  return audioContext
}

function tone(
  context: AudioContext,
  frequency: number,
  startsAt: number,
  duration: number,
  gainValue: number,
): void {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startsAt)
  gain.gain.setValueAtTime(0.0001, startsAt)
  gain.gain.exponentialRampToValueAtTime(gainValue, startsAt + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startsAt)
  oscillator.stop(startsAt + duration + 0.01)
}

function playSound(kind: FeedbackKind): void {
  const context = getAudioContext()
  if (!context) return

  void context.resume()
  const now = context.currentTime

  if (kind === 'add') {
    tone(context, 520, now, 0.06, 0.05)
    tone(context, 660, now + 0.045, 0.07, 0.045)
    return
  }

  if (kind === 'subtract') {
    tone(context, 330, now, 0.085, 0.04)
    return
  }

  tone(context, 523.25, now, 0.12, 0.05)
  tone(context, 659.25, now + 0.1, 0.12, 0.05)
  tone(context, 783.99, now + 0.2, 0.22, 0.06)
}

function vibrate(kind: FeedbackKind): void {
  if (!('vibrate' in navigator)) return

  if (kind === 'winner') {
    navigator.vibrate([35, 45, 35, 45, 70])
    return
  }

  navigator.vibrate(kind === 'add' ? 18 : 12)
}

export function triggerFeedback(kind: FeedbackKind, soundEnabled: boolean): void {
  vibrate(kind)
  if (soundEnabled) playSound(kind)
}
