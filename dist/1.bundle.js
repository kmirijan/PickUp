(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(78);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(62)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(78, function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function() {
		var newContent = __webpack_require__(78);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	})(__WEBPACK_OUTDATED_DEPENDENCIES__); });

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(61)(false);
// imports


// module
exports.push([module.i, "#head1:hover{\r\n}\r\n.link{\r\n    color:yellow;\r\n}\r\ninput{\r\n\twidth:200px;\r\n    padding: 10px 40px;\r\n    margin: 10px 10px;\r\n    border: none;\r\n    border-radius: 5px;\r\n}\r\ninput:active{\r\n\topacity:0.8;\r\n}\r\nbutton{\r\n    background-color: white;\r\n    color: black;\r\n    padding: 10px 10px 10px 10px;\r\n    margin: 10px 10px;\r\n    border: none;\r\n    border-radius: 5px;\r\n    cursor: pointer;\r\n}\r\nbutton:hover{\r\n\t background-color: yellow;\r\n\t color: white;\r\n}\r\n#form{\r\n    padding:0px 0px 0px 0px;\r\n}\r\n#panel{\r\n    margin: 0px 200px 0px 200px;\r\n}\r\n#top{\r\n    text-align:center;\r\n    padding: 10px 0px 10px 0px;\r\n    margin: 0px 0px 0px 0px;\r\n    font-size:large;\r\n    background-color:black;\r\n    color:white;\r\n}\r\n#banner{\r\n\ttext-align:center;\r\n    padding: 5px 10px 5px 10px;\r\n    background-color:rgba(57, 46, 157, 0.4);\r\n    border-radius:5px;\r\n    font-size:x-large;\r\n\tcolor:white;\r\n    margin: 0px 0px 0px 0px;\r\n}\r\n#banner:hover{\r\n\tfont-style: oblique;\r\n}\r\n#page{\r\n\ttext-align:center;\r\n    padding: 10px 10px 10px 10px;\r\n    background-color:rgba(0, 0, 0, 0.7);\r\n    border-radius:5px;\r\n    color:white;\r\n}\r\n#main{\r\n\tpadding: 10px 10px 10px 10px;\r\n\tmargin: 0px 200px 0px 200px;\r\n\tbackground-color:rgba(57, 46, 157, 0.3);\r\n\tborder-radius:5px;\r\n}\r\n#map{\r\n    height: 70%;\r\n    width: 100%;\r\n    background-color: grey;\r\n}\r\nbody{\r\n\tfont-family:\"Trebuchet MS\", Helvetica, sans-serif;\r\n    margin: 0px 0px 0px 0px;\r\n}", ""]);

// exports


/***/ })

}]);