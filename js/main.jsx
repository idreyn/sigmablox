const React = require("react");
const {render} = require("react-dom");
const _ = require("underscore");

const {parse} = require("./expression.js");
const {renderExpn, makeTileManager} = require("./components.jsx");

require("browserify-css");
require("../css/style.css");

function doRender() {
    render(<App/>, appRoot);
}

const manager = makeTileManager(doRender);
const expn = parse(`
	(+ 3 (frac 4 (- 6 (empty))))
`);

class App extends React.Component {
    render() {
        return renderExpn(expn, manager);
    }
}

var appRoot;
document.addEventListener("DOMContentLoaded", function() {
    appRoot = document.getElementById("root");
    doRender();
});

window.manager = manager;