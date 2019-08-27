const { equal } = require('chai').assert
const { range } = require('../../noflow/common/random')

describe('random', () => {
  describe('#range()', () => {
    it('generates a random number between from and to', function() {
      const from = 5
      const to = 10

      const result = range(from, to)

      equal(result > from, true)
      equal(result < to, true)
    })
  })
})
