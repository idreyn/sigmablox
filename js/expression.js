const parse = require("s-expression");

function parseS(i) {
	if (i instanceof Array) {
		return expn(i[0], ...i.slice(1).map(parseS));
	} else {
		return expn("value", i);
	}
}

function expn(type, ...operands) {
	return {
		type,
		operands,
		replaceOf(i) {
			return sub => {
				this.operands = this.operands.map(
					(o, j) => i === j ? sub : o
				);
			}
		},
		removeOf(i) {
			return () => {
				const empty = expn("empty");
				this.replaceOf(i)(empty);
				return empty;
			}
		},
		get left() { return operands[0]; },
		get right() { return operands[1]; },
	};
}

module.exports = {
	parse: (str) => parseS(parse(str))
};