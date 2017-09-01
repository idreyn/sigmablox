const React = require("react");
const {render} = require("react-dom");
const _ = require("underscore");

const {parse} = require("./expression.js");
const {Container, renderExpn} = require("./components.jsx");

require("browserify-css");
require("../css/style.css");

function doRender() {
    render(<App/>, appRoot);
}

const expn = parse(`
	(+ 3 (frac 4 (- 6 (empty))))
`);

class App extends React.Component {
    render() {
        return <Container>
        	{renderExpn(expn, doRender)}
        </Container>;
    }
}

var appRoot;
document.addEventListener("DOMContentLoaded", function() {
    appRoot = document.getElementById("root");
    doRender();
});

window.expn = expn;