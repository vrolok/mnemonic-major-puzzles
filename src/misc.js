var app = app || {};

(function () {
  'use strict';

  app.misc = {
    rules: {
      0: ['s', 'z'],
      1: ['t', 'd', 'th'],
      2: ['n'],
      3: ['m'],
      4: ['r'],
      5: ['l'],
      6: ['j', 'ch', 'sh'],
      7: ['c', 'k', 'ck', 'q', 'g'],
      8: ['v', 'f', 'ph'],
      9: ['p', 'b']
    },

    ignored(str) {
      return 'aeiouhywx'.includes(str);
    },

    exceptions(str) {
      return ['ck', 'ch', 'sh', 'ph', 'th'].includes(str);
    },

    // transforms numbers based on the rules e.g. 42 => [[r], [n]]
    transformNumbers(arr) {
      return arr.map((n) => this.rules[n]);
    },

    // checks for exceptions and filter out ignored e.g. [s,h,i,m] => [sh,m]
    // and e.g. doubbles assess -> [ss, ss] > 00
    transformLetters(arr) {
      return arr.reduce((acc, val, i) => {
        let adjacentLetters = val + arr[i + 1];
        if (this.exceptions(adjacentLetters)) {
          acc.push(adjacentLetters);
        } else if (!this.ignored(val)) {
          // if not in ignored or double and previous wasn't 'ck' already,
          // otherwise it will add 'ck' and 'k'
          if (arr[i - 1] + val !== 'ck' && val !== arr[i - 1]) {
            acc.push(val);
          }
        }
        return acc;
      }, []);
    }
  };
})();
