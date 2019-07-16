/* global Backbone, jQuery, _ */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#container',

    template: _.template($('#stats-template').html()),

    initialize: function () {
      this.$app = this.$('#app');
      this.$footer = this.$('#footer #stats');

      this.listenTo(app.puzzles, 'add', this.addOne);
      this.listenTo(app.puzzles, 'change:solved', this.addAgain);
      this.listenTo(app.puzzles, 'sync', this.addSome);
      this.listenTo(app.puzzles, 'all', _.debounce(this.render, 0));

      app.puzzles.fetch({ reset: true });
    },

    render: function $$renderView() {
      var solved = app.puzzles.completed().length;

      this.$footer.html(this.template({
        completed: solved
      }));

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

    makeNumPuzzle() {
      return app.puzzles.create({ title: _.random(0, 100) });
    },

    async solved() {
      await this.el.remove();
    },

    addAgain(model) {
      // add 1 random puzzle
      _.random(0, 1)
        ? model.collection.sample(1).map(this.addOne, this)
        : this.makeNumPuzzle();
    }

  });
}(jQuery));
