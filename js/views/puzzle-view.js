/*global Backbone, jQuery, _, ENTER_KEY*/
var app = app || {};

(function ($) {
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

	// ===================================================
	// ===================================================
	
	app.PuzzleView = Backbone.View.extend({
		tagName: 'div',
		className: 'puzzle',
		
		template: _.template($('#puzzle-template').html()),
		
		events: {
			'input': 'compareValues'
		},
		
		initilize: function () {
			this.render();
		},
		
		render: function() {
			this.$el.html(this.template(this.model.toJSON()))
			return this;
		},

		async compareValues () {
			const q = this.el.innerText;
			const a = this.$('.edit').val();
			let transformedQ;
			let transformedA;
			let result;

			if (Number.isInteger(q)) {
				// if input is a number, transform input numbers to an arr of letters
				// e.g. 42 => [[r], [n]]
				transformedQ = transformNumbers(Array.from(q.toString()));
				transformedA = transformLetters(Array.from(a));
			} 
			else {
				// if input is a word, check for ignored letters and any exceptions returning an arr,
				// reverse variables for a test below q <-> a
				transformedQ = transformNumbers(Array.from(a));
				transformedA = transformLetters(Array.from(q));
			}

			if (transformedQ.length === transformedA.length) {
				// for every letter in A(arr) lets find a match in Q(arr) of arrays
				result = await transformedA.every((v, i) => transformedQ[i].includes(v))
			}

			if (result) {
				this.model.toggle();
				this.trigger('solved');
			}
		}
	})
}(jQuery));
