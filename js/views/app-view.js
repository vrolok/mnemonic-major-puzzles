/* global Backbone, jQuery, _ */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#container',

    template: _.template($('#score-template').html()),

    initialize() {
      this.$app = this.$('#app');
      this.$stats = this.$('#stats');

      this.listenTo(app.puzzles, 'add', this.addOne);
      this.listenTo(app.puzzles, 'change:solved', this.addAgain);
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
      await collection.sample(6).map(this.addOne, this);
    },

    async addAgain(model) {
      // add 1 random puzzle after one is solved
      _.random(0, 1)
        ? await model.collection.sample(1).map(this.addOne, this)
        : await this.makeNumPuzzle();
    },
    
    async makeNumPuzzle() {
      await app.puzzles.create({ title: _.random(0, 100) });
    },

    async solved() {
      await this.el.remove();
    }
  });
}(jQuery));
