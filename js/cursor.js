const RelativeCursorBehavior = {
	NAVIGATE_AROUND: "NAVIGATE_AROUND",
	NAVIGATE_AROUND_ONLY: "NAVIGATE_AROUND_ONLY",
	NAVIGATE_WITHIN_ONLY: "NAVIGATE_WITHIN_ONLY",
};

const cursorBehaviorForExpression = (expr) =>
	expr.type === "value" ?
		RelativeCursorBehavior.NAVIGATE_AROUND_ONLY :
		RelativeCursorBehavior.NAVIGATE_AROUND;

const makeCursor = (
	currentExpn,
	operandIndex = 0,
	getSuperPredecessor,
	getSuperSuccessor
) => ({
	currentExpn,
	operandIndex,
	returnHere() {
		return this;
	},
	previousOperand() {
		return currentExpn.operands[operandIndex - 1];
	},
	currentOperand() {
		return currentExpn.operands[operandIndex];
	},
	atStart(index) {
		const behavior = cursorBehaviorForExpression(currentExpn);
		index = index || operandIndex;
		if (index !== 0) {
			return false;
		}
		return true;
	},
	atEnd(index) {
		const behavior = cursorBehaviorForExpression(currentExpn);
		index = index || operandIndex;
		if (index < currentExpn.operands.length) {
			return false;
		}
		return true;
	},
	// Successor without any possibility of entering operands
	simpleSuccessorFor(index) {
		return (function() {
			if (this.atEnd(index)) {
				return getSuperSuccessor();
			}
			return makeCursor(
				currentExpn,
				index + 1,
				getSuperPredecessor,
				getSuperSuccessor
			);
		}).bind(this);
	},
	successor() {
		if (this.atEnd()) {
			return getSuperSuccessor();
		}
		if (cursorBehaviorForExpression(
			this.currentOperand()
		) === RelativeCursorBehavior.NAVIGATE_AROUND_ONLY) {
			return this.simpleSuccessorFor(operandIndex)();
		} else {
			return makeCursor(
				this.currentOperand(),
				0,
				this.returnHere.bind(this),
				this.simpleSuccessorFor(operandIndex)
			);
		}
	},
	simplePredecessorFor(index) {
		return (function() {
			if (this.atStart(index)) {
				return getSuperPredecessor();
			}
			return makeCursor(
				currentExpn,
				index - 1,
				getSuperPredecessor,
				getSuperSuccessor
			);
		}).bind(this);
	},
	predecessor() {
		if (this.atStart()) {
			return getSuperPredecessor();
		}
		if (cursorBehaviorForExpression(
			this.previousOperand()
		) === RelativeCursorBehavior.NAVIGATE_AROUND_ONLY) {
			return this.simplePredecessorFor(operandIndex)();
		} else {
			return makeCursor(
				this.previousOperand(),
				this.previousOperand().operands.length - 1,
				this.simplePredecessorFor(operandIndex),
				this.returnHere.bind(this)
			);
		}
	}
});

module.exports = {makeCursor};
