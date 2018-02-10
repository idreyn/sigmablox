const RelativeCursorBehavior = {
	NAVIGATE_AROUND: "NAVIGATE_AROUND",
	NAVIGATE_AROUND_ONLY: "NAVIGATE_AROUND_ONLY",
	NAVIGATE_WITHIN_ONLY: "NAVIGATE_WITHIN_ONLY",
};

const cursorBehaviorForExpression = (expn) =>
	expn.type === "value" ?
		RelativeCursorBehavior.NAVIGATE_AROUND_ONLY :
		RelativeCursorBehavior.NAVIGATE_AROUND;

const makeCursorView = (expn, parent, index, isFirst, isLast) => {
	let view = {
		expn,
		parent,
		isFirst,
		isLast,
		index
	};
	view.children = !expn.atomic && (function() {
		const childViews = expn.operands.map(
			(o, i) => makeCursorView(
				o,
				view,
				i,
				i === 0,
				i === expn.operands.length - 1
			)
		);
		for (let i=0; i<childViews.length; i++) {
			childViews[i].nextSibling = childViews[i+1];
			childViews[i].prevSibling = childViews[i-1];
		}
		return childViews;
	})();
	if (!parent) {
		view.prevSibling = view;
		view.nextSibling = view;
	}
	return view;
};

const findViewForExpn = (expn, root) => {
	if (root.expn === expn) {
		return root;
	} else {
		for (let i=0; i<root.children.length; i++) {
			const foundView = findViewForExpn(expn, root.children[i]);
			if (foundView) {
				return foundView;
			}
		}
	}
	return null;
};

const makeCursor = (view) => {
	const {expn, parent, index, 
		isFirst, isLast, children, nextSibling, prevSibling} = view;
	return {
		expn,
		parent,
		successor() {
			let nextView;
			if (children && children.length > 0) {
				nextView = children[0];
			} else if (isLast) {
				nextView = (function() {
					let next = view;
					do { next = next.parent; } while(next.isLast);
					return next;
				})().nextSibling;
			}
			nextView = nextView || nextSibling || view;
			return makeCursor(nextView);
		},
		predecessor() {
			return makeCursor(prevSibling || parent || view);
		}
	}
};

module.exports = {makeCursor, makeCursorView, findViewForExpn};
