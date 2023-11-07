import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import Tab from "./tabs";

const container = document.createElement("div");
document.body.appendChild(container);
if (!container) {
  throw new Error("Can not find AppContainer");
}
const root = createRoot(container);
root.render(
  <Router>
    <Tab />
  </Router>
);
// root.render(test);
