const sParse = require("s-expression");

const sExpnToExpn = (i) => {
	if (i instanceof Array) {
		return expn(i[0], ...i.slice(1).map(sExpnToExpn));
	} else {
		return expn("value", i);
	}
}

const parse = (str) => sExpnToExpn(sParse(str))

const expn = (type, ...operands) => {
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
								o.replace(target, replacement) : o;
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
	};
}

module.exports = {expn, parse}