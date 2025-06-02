
// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

console.log("REDIRECT_URI:", process.env.REACT_APP_OIDC_REDIRECT_URI);


const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_QsWItsLZ5",
  client_id: "430l854cf5agq8o7n5qt1q4fmn",
  redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: process.env.REACT_APP_OIDC_LOGOUT_URI,
  response_type: "code",
  scope: "openid email",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);