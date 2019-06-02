// @flow

import { partial } from 'ramda'
import { Map } from 'immutable'

export type Synth = {
  beep: Function,
  chord: Function,
}

const createOscillator = (
  audioContext: AudioContext,
  frequency: number
): OscillatorNode => {
  const oscillator = audioContext.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  oscillator.connect(audioContext.destination)

  return oscillator
}

const beep = (audioContext: AudioContext, frequency: number, duration: number = 200): void => {
  const oscillator = createOscillator(audioContext, frequency)
  oscillator.start()
  setTimeout(() => oscillator.stop(), duration)
}

export const createSynth = () => {
  const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.destination

  return {
    beep: partial(beep, [audioContext]),
    chord: (frequencies: number[], duration: number = 200) => {
      frequencies.forEach(frequency => {
        beep(audioContext, frequency, duration)
      })
    }
  }
}
