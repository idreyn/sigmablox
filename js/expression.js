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
		replace(target, replacement, removeReplacement = true) {
			return expn(
				this.type,
				...this.operands.map(
					o => {
						if(o === target) {
							return replacement
						} else if (o === replacement) {
							return expn("empty");
						} else {
							return o.replace ? 
								o.replace(target, replacement) :
								o;
						}
					}
				)
			);
		},
		hasChild(e) {
			return e === this || this.operands.filter(
				(o) => o.hasChild? o.hasChild(e) : false
			).length > 0;
		},
		get left() { return operands[0]; },
		get right() { return operands[1]; },
	};
}

module.exports = {
	expn,
	parse: (str) => parseS(parse(str))
};