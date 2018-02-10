const {parse} = require("./expression.js");

module.exports = {
	simple: parse(`
		(frac (* 2 6) (+ 5 (* 10 (frac 3 (- 2 (frac 3 (empty)))))))
	`),
};