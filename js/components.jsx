const React = require("react");
const classNames = require("classNames");
const {DragSource, DropTarget, DragDropContext} = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const DRAG_TYPE = "TILE";

const renderExpn = (expn, refresh, i=0, onReplace=null) => {
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
			isRoot={onReplace === null}
			key={i}
			expn={expn}
			onReplaceExpn={onReplace}
			refresh={refresh}
			children={expn.operands.map(
				(e, i) => renderExpn(e, refresh, i, expn.replaceOf(i))
			)}
		/>;
	}
	return expn;
}

const TileKind = (name, render) => DropTarget(
	DRAG_TYPE,
	{
		drop({onReplaceExpn, expn}, monitor) {
			if (!monitor.didDrop()) {
				return {replaceMe: onReplaceExpn, targetExpn: expn};
			}
		},
		canDrop({expn}, monitor) {
			return expn.type === "empty" && !monitor.getItem().expn.hasChild(expn);
		},
	},
	(connect, monitor) => {
		return {
			connectDropTarget: connect.dropTarget(),
			isOver: monitor.isOver({shallow: true}),
		};
	}
)(DragSource(
	DRAG_TYPE,
	{
		beginDrag({expn}) {
			console.log("beginDrag");
			return {expn};
		},
		endDrag({expn, onReplaceExpn, refresh}, monitor) {
			if (monitor.didDrop()) {
				const {replaceMe, targetExpn} = monitor.getDropResult();
				if (targetExpn !== expn) {
					console.log("here we are going far to save all that we love", expn);
					replaceMe(expn);
					onReplaceExpn(null);
					refresh();
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
			const {overrideSize} = this.props;
			// react-dnd props
			const {connectDragSource, connectDropTarget, isOver} = this.props;
			return connectDropTarget(connectDragSource(<div
				className={classNames(
					"tile",
					"tile-" + name,
					isOver && "tile-over"
				)}
				style={overrideSize}
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

const Container = DragDropContext(HTML5Backend)(class extends React.Component {
	render() {
		return <div>
			{this.props.children}
		</div>;
	}
});

module.exports = {renderExpn, Container};