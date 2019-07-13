var app = app || {};

(function () {
  'use strict';

  app.Puzzle = Backbone.Model.extend({
    defaults: {
      title: '',
      solved: false
    },
    toggle: function () {
      this.save({
        solved: !this.get('solved')
      });
    }
  });
}());
