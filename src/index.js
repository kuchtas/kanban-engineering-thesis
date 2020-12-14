import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWithAuth from "./AppWithAuth";
import Amplify, { DataStore } from "aws-amplify";
import awsExports from "./aws-exports";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./service-worker";

Amplify.configure(awsExports);
DataStore.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();
