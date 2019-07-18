// vanilla javascript version for a reference
(function appFactory(window) {
  'use strict';

  const rules = {
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
  }

  const getRandomNum = max => Math.floor(Math.random() * Math.floor(max));

  const ignored = str => 'aeiouhywx'.includes(str);

  const exceptions = str => ['ck', 'ch', 'sh', 'ph', 'th'].includes(str);

  // transforms numbers based on the rules e.g. 42 => [[r], [n]]
  const transformNumbers = arr => arr.map((n) => rules[n]);

  // checks for exceptions and filter out ignored e.g. [s,h,i,m] => [sh,m]
  // and e.g. doubbles assess -> [ss,ss] > 00
  const transformLetters = arr => arr.reduce((acc, val, i) => {
    let adjacentLetters = val + arr[i + 1];
    if (exceptions(adjacentLetters)) {
      acc.push(adjacentLetters);
    } else if (!ignored(val)) {
      // if not in ignored or double and previous wasn't 'ck' already,
      // otherwise it will add 'ck' and 'k'
      if (arr[i - 1] + val !== 'ck' && val !== arr[i - 1]) {
        acc.push(val);
      }
    }
    return acc;
  }, [])

  // const solved = document.createEvent('CustomEvent');

  const compareValues = (q, a) => {
    // @param {String} q - question
    // @param {String} a - answer (user input)
    let transformedQ;
    let transformedA;

    if (Number.isInteger(q)) {
      // if input is a number, transform input numbers to an arr of letters
      // e.g. 42 => [[r], [n]]
      transformedQ = transformNumbers(Array.from(q.toString()));
      transformedA = transformLetters(Array.from(a));
    } else {
      // if input is a word, check for ignored letters and any exceptions returning an arr,
      // reverse variables for a test below q <-> a
      transformedQ = transformNumbers(Array.from(a));
      transformedA = transformLetters(Array.from(q));
    }

    if (transformedQ.length == transformedA.length) {
      // for every letter in A(arr) lets find a match in Q(arr) of arrays
      return transformedA.every((v, i) => transformedQ[i].includes(v));
    } else {
      return false;
    }
  }

  const makePuzzle = (str) => {
    const id = getRandomNum(100);
    const fragment = document.createDocumentFragment();
    const newDiv = document.createElement('div');
    const styledNewDiv = newDiv.style;

    styledNewDiv.margin = '30px';
    styledNewDiv.fontSize = '20px';

    newDiv.setAttribute('id', 'q' + id);

    const label = document.createElement('label');
    const styledLabel = label.style;

    styledLabel.display = 'block';
    styledLabel.textAlign = 'center';
    styledLabel.marginBottom = '30px';

    label.innerHTML = str + '<br>';

    newDiv.appendChild(label);

    const input = document.createElement('input');

    input.setAttribute('id', 'a' + id);
    input.setAttribute('name', 'answer');

    isNaN(str) ?
      input.setAttribute('type', 'number') :
      input.setAttribute('type', 'text')

    const styledInput = input.style;
    styledInput.outlineStyle = 'solid';
    styledInput.width = '100px';

    input.addEventListener('input', function (e) {
      let result = compareValues(str, input.value);
      if (result) {
        styledInput.outlineColor = '#05ffb0';

        window.app.pubsub.publish('solved', {
          id
        });
      } else {
        styledInput.outlineColor = 'red';
      }
    })

    input.addEventListener('change', function (e) {
      // change color back to normal if input is empty
      if (!input.value) {
        styledInput.outlineColor = 'black';
      }
    })

    newDiv.appendChild(input);

    fragment.appendChild(newDiv);

    return fragment;
  }

  const addPuzzles = (p) => {
    const app = document.getElementById('app');
    app.appendChild(p);
  }

  const delPuzzle = (id) => {
    const puzzle = document.getElementById('q' + id);
    puzzle.remove();
  }

  const genPuzzles = (n, arr, max = 100) => {
    /*
     * @param {Integer} n - number of puzzles to make
     * @param {Array} arr - words
     * @param {Integer} max - max random integer, (0 - 99) default
     */
    const len = arr.length;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      let p = getRandomNum(2) ? arr[getRandomNum(len)] : getRandomNum(max);
      let q = makePuzzle(p);
      fragment.appendChild(q);
    }
    return fragment;
  }

  try {
    // Use pegs from the wiki & generate 6 puzzles
    const words = sessionStorage.getItem('pegs').split(' ');
    addPuzzles(genPuzzles(8, words));
    // Once solved makePuzzle func will fire an event.
    // Let's listen for that event and delete the solved puzzle,
    // after that add a new one also.
    window.app.pubsub.subscribe('solved', function solved(obj) {
      var id = obj.id;
      setTimeout(() => delPuzzle(id), 3000);
      setTimeout(() => addPuzzles(genPuzzles(1, words)), 4000);
    })
  } catch (error) {
    console.warn('Something is wrong, ', error);
    addPuzzles(genPuzzles(1, ['Error']));
  }

})(window);