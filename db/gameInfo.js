var mongoose = require ('mongoose');

var GameInfo = mongoose.model('GameInfo', {
	game: {
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
	user: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

module.exports = {GameInfo};
