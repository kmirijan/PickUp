const mongoose = require('mongoose');

var Team = mongoose.model('Team', {
  sport: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ''
  },
  captain: {
    type: String,
    required: true
  },
  members: [{
		type: String
	}],
  games:[{
    type: String,
  }],
  maxPlayers: {
    type: Number
  }
});

module.exports = {Team};
