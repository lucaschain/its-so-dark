// @flow
import { Map } from 'immutable'

export const onKeyDown = (
  callback: (string) => void
) => {
  document.addEventListener('keydown', (event: any) => {
    callback(event.key)
  })
}
