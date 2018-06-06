var mongoose = require('mongoose');

var TeamGame = mongoose.model('TeamGame', {
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
  teams: [{
		type: String,
		trim: true
	}],
	isprivate:{
		type: Boolean,
		required:true
	}
});

module.exports = {TeamGame};
