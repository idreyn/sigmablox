const React = require("react"); 
const classNames = require("classNames");
const {connect, Provider} = require("react-redux");
const {DragDropContext} = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const {replaceExpn, removeExpn} = require("../actions.js");
const {renderExpn} = require("./components.jsx");

const mapStateToProps = state => ({
	expn: state.expn,
});

const mapDispatchToProps = dispatch => ({
	onReplaceExpn: (target, replacement) => {
		dispatch(replaceExpn(target, replacement));
	},
	onRemoveExpn: (target) => {
		dispatch(removeExpn(target));
	},
});

const Container = connect(
	mapStateToProps,
	mapDispatchToProps
)(DragDropContext(HTML5Backend)(class extends React.Component {
	render() {
		const {expn, store, onReplaceExpn, onRemoveExpn} = this.props;
		return <Provider store={store}>
			{renderExpn(expn, {onReplaceExpn, onRemoveExpn})}
		</Provider>;
	}
}));

module.exports = {Container};