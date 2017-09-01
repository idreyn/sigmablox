const React = require("react"); 
const classNames = require("classNames");
const {DragSource, DropTarget} = require("react-dnd");

const DRAG_TYPE = "TILE";

const renderExpn = (expn, handlers, isRoot = true, i = 0) => {
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
		return <Tile
			{...handlers}
			expn={expn}
			isRoot={isRoot}
			key={i}
			children={expn.operands.map(
				(e, i) => renderExpn(e, handlers, false, i)
			)}
		/>;
	}
	return expn;
}

const TileKind = (name, render) => DropTarget(
	DRAG_TYPE,
	{
		drop({expn, onReplaceExpn}, monitor) {
			if (!monitor.didDrop()) {
				return {
					replaceMe: (replacement) => 
						onReplaceExpn(expn, replacement),
					targetExpn: expn,
				};
			}
		},
		canDrop({expn}, monitor) {
			return (
				expn.type === "empty" && 
				!monitor.getItem().expn.hasChild(expn)
			);
		},
	},
	(connect, monitor) => {
		return {
			connectDropTarget: connect.dropTarget(),
			isOver: monitor.isOver({shallow: true}),
			canDrop: monitor.canDrop(),
		};
	}
)(DragSource(
	DRAG_TYPE,
	{
		beginDrag({expn}) {
			return {expn};
		},
		endDrag({expn, onRemoveExpn}, monitor) {
			if (monitor.didDrop()) {
				const {replaceMe, targetExpn} = monitor.getDropResult();
				if (targetExpn !== expn) {
					replaceMe(expn);
				}
			}
		},
		canDrag({expn, isRoot}) {
			return expn.type !== "empty" && !isRoot;
		},
	},
	(connect, monitor) => {
		return {
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		};
	}
)(
	class extends React.Component {
		render() {
			// Regular ol' props
			const {cursor, expn} = this.props;
			// react-dnd props
			const {
				connectDragSource,
				connectDropTarget,
			} = this.props;
			const {
				canDrop,
				isDragging,
				isOver,
			} = this.props;
			return connectDropTarget(connectDragSource(<div
				className={classNames(
					"tile",
					"tile-" + name,
					isOver && canDrop && "tile-drop-accept",
					isDragging && "tile-dragging",
					cursor.currentExpn === expn && "tile-cursor",
				)}
				onDragStart={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				ref={(me) => this.element = me}
			>
				{render(this.props)}
			</div>));
		}
	}
));

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

module.exports = {renderExpn};