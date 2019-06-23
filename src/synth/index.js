// @flow

import { partial } from 'ramda'
import { Map } from 'immutable'
import Tone from 'tone'

export type Synth = {
  beep: (number) => void
}

const beep = (
  audioContext: AudioContext,
  synth: Tone.Synth,
  frequency: number
): void => {
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

export const createSynth = (): Synth => {
  const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.destination
  const synth = buildToneSynth()

  return {
    beep: partial(beep, [audioContext, synth])
  }
}
