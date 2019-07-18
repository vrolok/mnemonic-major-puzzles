/* global Backbone, jQuery, _ */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#container',

    template: _.template($('#score-template').html()),

    events: {
      'click input[type=radio]': 'changedRadio'
    },

    initialize() {
      this.$app = this.$('#app');
      this.$stats = this.$('#stats');

      this.listenTo(app.puzzles, 'change:solved', this.addRandom);
      this.listenTo(app.puzzles, 'sync', this.addSome);
      this.listenTo(app.puzzles, 'all', _.debounce(this.render, 0));

    },

    render() {
      var solved = app.puzzles.completed().length;
      this.$stats.html(this.template({ completed: solved }));

      return this;
    },

    async _addOne(model) {
      const view = new app.PuzzleView({ model });
      await this.$app.append(view.render().el);

      view.on('solved', this.solved);
    },

    async addSome() {
      // add 6 random puzzles, some from a collection & some with a num
      await this.addWordPuzzle(null, 6);
    },

    async addRandom() {
      // add 1 random puzzle after one is solved
      _.random(0, 1)
        ? await this.addWordPuzzle(this, 1)
        : await this.addNumPuzzle();
    },
    
    async addWordPuzzle(context, n) {
      const size = n || 1;
      await app.puzzles.sample(size).map(this._addOne, this);
    },
    
    async addNumPuzzle() {
      const m = await app.puzzles.create({ title: _.random(0, 100) });
      this._addOne(m);
    },

    async solved() {
      await this.el.remove();
    },
      
    changedRadio(e) {
      this.stopListening(app.puzzles, 'change:solved');
      const filter = $(e.target).val();
      switch (filter) {
        case 'words':
          this.listenTo(app.puzzles, 'change:solved', this.addWordPuzzle);
          break;
        case 'numbers':
          this.listenTo(app.puzzles, 'change:solved', this.addNumPuzzle);
          break;
        case 'random':
          this.listenTo(app.puzzles, 'change:solved', this.addRandom);
          break;
      }
    }
  });
}(jQuery));
