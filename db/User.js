const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var User = mongoose.model('User', {
  username: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  games: [{
		type: Number
	}],
  friends:[{
    username: String,
    req: String
  }],
  feed:[{
    type: String
  }],
  teams: [{
    type: String
  }],
  teamgames: [{
    type: Number
  }]
});

User.generateHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
};

User.validPassword =function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = {User};
