const {expn} = require("./expression.js");
const {makeCursorView, makeCursor, findViewForExpn} = require("./cursor.js");
const samples = require("./samples.js");

const SELECT_EXPN = "SELECT_EXPN";
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

const selectExpn = (target) => ({
	type: SELECT_EXPN,
	target,
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

const initialStateFor = (expn) => {
	const cursorView = makeCursorView(expn);
	const cursor = makeCursor(cursorView);
	return {expn, cursorView, cursor};
}

const initialState = initialStateFor(samples.simple);

const expnEditor = (state = initialState, action) => {
	if (action.type === SELECT_EXPN) {
		return {
			...state,
			cursor: makeCursor(
				findViewForExpn(
					action.target,
					state.cursorView
				)
			),
		}
	}
	if (action.type === REPLACE_EXPN) {
		const expn = state.expn.replace(
			action.target,
			action.replacement,
			true
		);
		const cursorView = makeCursorView(expn);
		const cursor = makeCursor(cursorView);
		return {expn, cursorView, cursor};
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

module.exports = {replaceExpn, removeExpn, selectExpn, cursorSucc, cursorPred, expnEditor};