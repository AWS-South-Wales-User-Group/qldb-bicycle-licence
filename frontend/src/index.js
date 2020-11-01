import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import API from "@aws-amplify/api";

API.configure({
  API: {
    endpoints: [
      {
        endpoint:
          "https://....execute-api.eu-west-1.amazonaws.com/...",
        name: "ApiGatewayRestApi",
        region: "eu-west-1",
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
