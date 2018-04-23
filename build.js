var babel = require('babel-core'),
	fs = require('fs');

var result = babel.transformFileSync('games.js');


console.log(result.code);
fs.writeFile('games.build.js', result.code, (err) => {if (err) throw err;});
