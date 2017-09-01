const {expn} = require("./expression.js");
const {makeCursor} = require("./cursor.js");
const samples = require("./samples.js");

const REPLACE_EXPN = "REPLACE_EXPN";
// You are like a little baby. Watch this:
const CURSOR_SUCC = "CURSOR_SUCC";
const CURSOR_PRED = "CURSOR_PRED";

// Some action creators
const replaceExpn = (target, replacement) => ({
	type: REPLACE_EXPN,
	target,
	replacement,
});

const cursorSucc = () => ({
	type: CURSOR_SUCC,
});

const cursorPred = () => ({
	type: CURSOR_PRED,
});

const removeExpn = (target) => replaceExpn(
	target,
	expn("empty")
);

const initialStateFor = (expn) => ({
	expn: expn,
	cursor: makeCursor(expn),
});

const initialState = initialStateFor(samples.simple);

const expnEditor = (state = initialState, action) => {
	if (action.type === REPLACE_EXPN) {
		return {
			...state,
			expn: state.expn.replace(action.target, action.replacement, true),
		};
	}
	if (action.type === CURSOR_SUCC) {
		return {
			...state,
			cursor: state.cursor.successor(),
		};
	}
	if (action.type === CURSOR_PRED) {
		return {
			...state,
			cursor: state.cursor.predecessor(),
		};
	}
	return state;
}

module.exports = {replaceExpn, removeExpn, cursorSucc, cursorPred, expnEditor};