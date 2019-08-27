// @flow
module.exports.range = (from: number, to: number): number => (
  from + (Math.random() * (to - from))
)
