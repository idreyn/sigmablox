const {parse} = require("./expression.js");

module.exports = {
	simple: parse(`
		(+ 5 (frac 3 (- 2 (frac 3 (empty)))))
	`),
};