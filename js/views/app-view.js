/*global Backbone, jQuery, _, ENTER_KEY*/
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({
		el: '#container',

		template: _.template($('#stats-template').html()),

		events: {
			'todo': 'todo'
		},

		initialize: function () {
			this.$app = this.$('#app');
			this.$footer = this.$('#footer #stats');

			this.listenTo(app.puzzles, 'add', this.addOne);
			this.listenTo(app.puzzles, 'sync', this.addSome);
			this.listenTo(app.puzzles, 'all', _.debounce(this.render, 0));			
			app.puzzles.fetch({ reset: true });
		},

		render: function $$renderView() {
			var solved = app.puzzles.completed().length;

			this.$footer.html(this.template({ completed: solved }));

			return this;
		},
		
		async addOne (puzzle) {
			var view = new app.PuzzleView({ model: puzzle })
			await this.$app.append(view.render().el);
			
			view.on('solved', this.solved);
		},
		
		async addSome (puzzles) {
			// add 4 random pegs from a collection
			await puzzles.sample(4).map(this.addOne, this);
		},
		
		async solved () {
			await this.el.remove();
		}
	})
}(jQuery));
