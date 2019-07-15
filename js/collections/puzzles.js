/*global Backbone */
var app = app || {};

(function () {
	'use strict';
	
	var Puzzles = Backbone.Collection.extend({
		model: app.Puzzle,
		url: '../../pegs.json',

		initialize() {
			this.fetch();
		},
		
		parse (response) {
			// reads from json and translates it to Puzzle models
			var results = [];
			var pegs = response.data.split(" ");
			for (let p of pegs) {
				results.push({ title: p });
			}
			return results;
		},
		
		completed () {
			return this.where({ solved: true })
		}
	});

	app.puzzles = new Puzzles();
}());
