var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.Model.extend({
		el: '#container',

		statsTemplate: _.template($('#stats-template').html()),

		events: {
			'keypress .puzzle': 'compareValues'
		},

		initialize: function () {
			this.$app = this.$('#app');

		}
	})
}(jQuery));
