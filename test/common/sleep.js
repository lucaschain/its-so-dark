const { equal } = require('chai').assert
const { sleep } = require('../../noflow/common/sleep')

describe('sleep', () => {
  describe('#sleep()', () => {
    it('executes a function that sleeps for x miliseconds', function() {
        let sleepPromise = sleep(1000);
        sleepPromise.then(response => {
            equal(false, true);
        }).catch(error => {
            equal(false, true);
        })
    })
  })
})
