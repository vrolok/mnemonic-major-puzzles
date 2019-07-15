var app = app || {};

(function () {
	'use strict';

	app.Puzzle = Backbone.Model.extend({
		defaults: {
			title: '',
			solved: false
		},
		toggle: function () {
			this.set('solved', !this.get('solved'));
		}
	});
}());
