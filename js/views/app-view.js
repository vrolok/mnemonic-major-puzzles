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

      this.listenTo(app.puzzles, 'add', this.addOne);
      this.listenTo(app.puzzles, 'change:solved', this.addRandom);
      this.listenTo(app.puzzles, 'sync', this.addSome);
      this.listenTo(app.puzzles, 'all', _.debounce(this.render, 0));

      app.puzzles.fetch({ reset: true });
    },

    render() {
      var solved = app.puzzles.completed().length;
      this.$stats.html(this.template({ completed: solved }));

      return this;
    },

    async addOne(model) {
      const view = new app.PuzzleView({ model });
      await this.$app.append(view.render().el);

      view.on('solved', this.solved);
    },

    async addSome(collection) {
      // add 6 random puzzles, some from a collection & some with a num
      await this.makeWordPuzzle(collection, 6);
    },

    async addRandom(model) {
      // add 1 random puzzle after one is solved
      _.random(0, 1)
        ? await this.makeWordPuzzle(model.collection)
        : await this.makeNumPuzzle();
    },
    
    async makeWordPuzzle(collection, n) {
      debugger;
      const size = n || 1;
      await collection.sample(size).map(this.addOne, this);
    },
    
    async makeNumPuzzle() {
      await app.puzzles.create({ title: _.random(0, 100) });
    },

    async solved() {
      await this.el.remove();
    },
      
    changedRadio(e) {
      this.stopListening(app.puzzles, 'change:solved');
      const filter = $(e.target).val();
      switch (filter) {
        case 'words':
          this.listenTo(app.puzzles, 'change:solved', this.makeWordPuzzle);
          break;
        case 'numbers':
          this.listenTo(app.puzzles, 'change:solved', this.makeNumPuzzle);
          break;
        case 'random':
          this.listenTo(app.puzzles, 'change:solved', this.addRandom);
          break;
      }
    }
  });
}(jQuery));
