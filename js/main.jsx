const React = require("react");
const {render} = require("react-dom");
const {createStore} = require("redux");

require("browserify-css");
require("../css/style.css");

const {expnEditor} = require("./actions.js");
const {Container} = require("./views/container.jsx");

function doRender() {
    render(<App/>, appRoot);
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			store: createStore(expnEditor),
		};
		window.c = this.state.store.getState().cursor;
	}

    render() {
        return <Container store={this.state.store}/>;
    }
}

var appRoot;
document.addEventListener("DOMContentLoaded", function() {
    appRoot = document.getElementById("root");
    doRender();
});