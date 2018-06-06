const request = require('request');

exports.getWeather = (lat, long, callback) =>{

	request({
		url: `https://api.darksky.net/forecast/2dbc6364f6be072abffb985656522972/${lat},${long}`,
		json: true
	}, (error, response, body) => {
		if(!error && response.statusCode === 200){
			callback(body);
		} else {
			callback('Unable to connect to servers');
		}
	});
};
