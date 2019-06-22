// @flow

import { partial } from 'ramda'
import { Map } from 'immutable'
import Tone from 'tone'

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

const beep = (
  audioContext: AudioContext,
  synth: Tone.Synth,
  frequency: number,
  duration: number = 200
): void => {
  //const oscillator = createOscillator(audioContext, frequency)
  //oscillator.start()
  //setTimeout(() => oscillator.stop(), duration)
  synth.triggerAttackRelease(frequency, '16n')
}

const buildToneSynth = (): Tone.Synth => {
  const distortion = new Tone.Distortion(0.3)
  const tremolo = new Tone.Tremolo().start()
  const autoWah = new Tone.AutoWah(220, 6, 0)
  const comp = new Tone.Compressor(-50, 3)
  const lowPass = new Tone.Filter(210, "lowpass")

  return new Tone.Synth().chain(
    distortion,
    //tremolo,
    //autoWah,
    lowPass,
    comp,
    Tone.Master
  )
}

export const createSynth = () => {
  const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.destination
  const synth = buildToneSynth()

  return {
    beep: partial(beep, [audioContext, synth]),
    chord: (frequencies: number[], duration: number = 200) => {
      frequencies.forEach(frequency => {
        beep(audioContext, frequency, duration)
      })
    }
  }
}
