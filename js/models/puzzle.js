var app = app || {};

(function () {
  'use strict';

  app.Puzzle = Backbone.Model.extend({
    defaults: {
      title: '',
      solved: false
    },

    toggleSolved() {
      this.set('solved', true);
    }
  });
}());
