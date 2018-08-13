import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
//import "./bootstrap.min.css";
import Home from "./Home";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();