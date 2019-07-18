/* global Backbone, jQuery, _ */
var app = app || {};

(function ($) {
  'use strict';

  app.PuzzleView = Backbone.View.extend({

    tagName: 'div',
    className: 'puzzle',

    template: _.template($('#puzzle-template').html()),

    events: {
      'input': 'compareValues',
      'focusout .edit': 'clearValues'
    },

    initilize: function $$initilizePV() {
      this.render();
    },

    render: function $$renderPV() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    clearValues() {
      this.$('input.edit').val('');
    },

    compareValues: _.debounce(async function $$compareValues() {
      const transformNumbers = app.misc.transformNumbers.bind(app.misc);
      const transformLetters = app.misc.transformLetters.bind(app.misc);

      const q = this.el.innerText;
      const a = this.$('input.edit').val();

      //      console.log(`type ${typeof q} q value: ${q}`);
      //      console.log(`type ${typeof a} a value: ${a}`);

      let transformedQ;
      let transformedA;
      let result;

      if (Number.isInteger(+q) && a) {
        // if "q" input is a number, transform it to an arr of letters
        // e.g. 42 => [[r], [n]]
        transformedQ = transformNumbers(Array.from(q));
        transformedA = transformLetters(Array.from(a));
      } else if (a) {
        // if input is a word, check for ignored letters and any exceptions returning an arr,
        // reverse variables for a test below q <-> a
        transformedQ = transformNumbers(Array.from(a));
        transformedA = transformLetters(Array.from(q));
      }

      try {
        if (transformedQ.length === transformedA.length) {
          // for every letter in A(arr) lets find a match in Q(arr) of arrays
          result = await transformedA.every((v, i) => transformedQ[i].includes(v));
        }

        if (result) {
          await this.trigger('solved');
          await this.model.toggleSolved();
        }
      } catch (err) {
        // fail & console out without interrupt
        console.log(err);
      }

      return false;
    }, 300)
  });
}(jQuery));
