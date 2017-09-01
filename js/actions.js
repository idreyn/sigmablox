const {expn} = require("./expression.js");
const samples = require("./samples.js");

const REPLACE_EXPN = "REPLACE_EXPN";

// Some action creators
const replaceExpn = (target, replacement) => ({
	type: REPLACE_EXPN,
	target,
	replacement,
});

const removeExpn = (target) => replaceExpn(
	target,
	expn("empty")
);

const initialState = {
	expn: samples.simple,
};

const expnEditor = (state = initialState, action) => {
	if (action.type === REPLACE_EXPN) {
		return {
			...state,
			expn: state.expn.replace(action.target, action.replacement, true),
		};
	}
	return state;
}

module.exports = {replaceExpn, removeExpn, expnEditor};