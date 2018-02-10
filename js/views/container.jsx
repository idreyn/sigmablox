const React = require("react"); 
const classNames = require("classNames");
const {connect, Provider} = require("react-redux");
const {DragDropContext} = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const {replaceExpn, removeExpn, selectExpn, cursorPred, cursorSucc} = require("../actions.js");
const {renderExpn} = require("./components.jsx");

const mapStateToProps = state => ({
	expn: state.expn,
	cursor: state.cursor,
});

const mapDispatchToProps = dispatch => ({
	onReplaceExpn: (target, replacement) => {
		dispatch(replaceExpn(target, replacement));
	},
	onSelectExpn: (target) => {
		dispatch(selectExpn(target));
	},
	onRemoveExpn: (target) => {
		dispatch(removeExpn(target));
	},
	onCursorPred: () => {
		dispatch(cursorPred());
	},
	onCursorSucc: () => {
		dispatch(cursorSucc());
	},
});

const Container = connect(
	mapStateToProps,
	mapDispatchToProps
)(DragDropContext(HTML5Backend)(class extends React.Component {
	handleKeyDown({keyCode}) {
		const {onCursorPred, onCursorSucc} = this.props;
		if (keyCode === 37) {
			onCursorPred();
		}
		if (keyCode === 39) {
			onCursorSucc();
		}
	}

	render() {
		const {expn, cursor, store, onReplaceExpn, onRemoveExpn, onSelectExpn} = this.props;
		return <div onKeyDown={this.handleKeyDown.bind(this)} tabIndex="0">
			<Provider store={store}>
				{renderExpn(expn, {onReplaceExpn, onRemoveExpn, onSelectExpn, cursor})}
			</Provider>
		</div>;
	}
}));

module.exports = {Container};