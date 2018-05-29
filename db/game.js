var mongoose = require('mongoose');

var Game = mongoose.model('Game', {
	sport: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
  name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
  location: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
  id: {
		type: Number,
	},
  owner:{
		type: String,
		minlength: 1,
		trim: true
	},
  players: [{
		type: String,
		trim: true
	}],
	isprivate:{
		type: Boolean,
		required:true
	},
	coords: {
		type : {type: String},
		coordinates: [{
			lng: Number,
			lat: Number
		}]
	},
	startTime: {type: Number},
	gameLength: {type: Number}
});

module.exports = {Game};
