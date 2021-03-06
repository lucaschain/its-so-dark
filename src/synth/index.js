// @flow

import { partial } from 'ramda'
import { Map } from 'immutable'
import Tone from 'tone'

export type Synth = {
  beep: (number) => void,
  listener: Tone.Listener,
  panner: Tone.Panner3D
}

const beep = (
  audioContext: AudioContext,
  synth: Tone.Synth,
  frequency: number
): void => {
  synth.triggerAttackRelease(frequency, '16n')
}

const buildToneSynth = (output): Tone.Synth => {
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
    output
  )
}

export const createSynth = (): Synth => {
  const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.destination
  const panner = new Tone.Panner3D(0, 0, 0).connect(Tone.Master)
  panner.refDistance = 0.5
  const synth = buildToneSynth(panner)

  return {
    beep: partial(beep, [audioContext, synth]),
    listener: Tone.Listener,
    panner
  }
}
