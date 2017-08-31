const React = require("react");
const classNames = require("classNames");
const createReactClass = require("create-react-class");

const makeTileManager = (refresh) => ({
	refresh,
	startDrag(e) {
		if (!this.dragged) {
			this.dragged = e;
			this.refresh();
		}
	},
	onStopDrag: (cb) => {
		this.stopDragCallbacks.forEach(cb => cb());
		this.stopDragCallbacks = [];
	},
	stopDragCallbacks: [],
	dragPlaceholder: null,
	dragged: null,
	dropTarget: null,
});

const renderExpn = (expn, manager, i=0, onRemove=null) => {
	if (expn.type) {
		const Tile = {
			"+": InfixOf("+"),
			"-": InfixOf("-"),
			"*": InfixOf("*"),
			"/": InfixOf("/"),
			"frac": Fraction,
			"exp": Sup,
			"empty": Empty,
			"value": Value
		}[expn.type];
		const isDragPlaceholder = manager.dragPlaceholder === expn;
		return <Tile
			isDragged={manager.dragged === expn}
			isDragPlaceholder={isDragPlaceholder}
			overrideSize={
				isDragPlaceholder ? manager.dragPlaceholderSize : null
			}
			key={i}
			manager={manager}
			onStartDrag={({width, height}) => {
				const empty = onRemove();
				manager.dragPlaceholder = onRemove;
				manager.dragPlaceholderSize = {width, height};
				manager.dropTarget = empty;
				manager.startDrag(expn);
			}}
			children={expn.operands.map(
				(e, i) => renderExpn(e, manager, i, expn.removeOf(i))
			)}
		/>;
	}
	return expn;
}

const TileKind = (name, render) => createReactClass({
	handleMouseDown(e) {
		const {onRemove, onStartDrag} = this.props;
		e.stopPropagation();
		onStartDrag(this.element.getBoundingClientRect());
	},

	handleMouseUp() {

	},

	render() {
		const {isDragged, isDragPlaceholder, overrideSize} = this.props;
		if (overrideSize) console.log(overrideSize);
		return <div
			className={classNames(
				"tile",
				"tile-" + name,
				isDragPlaceholder && "tile-drag-placeholder"
			)}
			draggable={true}
			style={overrideSize}
			onDragStart={this.handleMouseDown}
			onMouseUp={this.handleMouseUp}
			ref={(me) => this.element = me}
		>
			{render(this.props)}
		</div>;
	},
});

const Empty = TileKind(
	"empty",
	() => [<div key={0} className="tile-empty-bubble"/>]
);

const Value = TileKind(
	"value",
	({children}) => children
);

const Infix = TileKind(
	"infix",
	({op, children}) => children
		.reduce((acc, next) => acc.concat([next, op]), [])
		.slice(0, -1)
);

const InfixOf = op => rest => <Infix op={op} {...rest}/>;

const Fraction = TileKind(
	"fraction",
	({children}) => [
		<div key={0} className={"tile-fraction-top"}>{children[0]}</div>,
		<div key={1} className={"tile-fraction-bar"}/>,
		<div key={2} className={"tile-fraction-bottom"}>{children[1]}</div>
	]
);

const Group = TileKind(
	"group",
	({children}) => ["("].concat(children).concat(")")
);

const Sub = TileKind(
	"sub",
	({children}) => [
		<div key={0} className={"tile-sub-large"}>{children[0]}</div>,
		<sub key={1} className={"tile-sub-small"}>{children[1]}</sub>
	]
);

const Sup = TileKind(
	"sup",
	({children}) => [
		<div key={0} className={"tile-sup-large"}>{children[0]}</div>,
		<sup key={1} className={"tile-sup-small"}>{children[1]}</sup>
	]
);

module.exports = {renderExpn, makeTileManager};