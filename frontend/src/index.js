import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
//import "./bootstrap.min.css";
import Home from "@Routes/Home.jsx";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
