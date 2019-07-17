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
    },
    
    save() {
      // prevent saving anything back to a fake url with data, aka pegs.json file.
      return true;
    }
  });
}());
