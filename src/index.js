import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "react-oidc-context";
import {AccessURL, AWSCognitoInfo} from "./General/Const"


const cognitoAuthConfig = {
  authority: AWSCognitoInfo.authority,
  client_id: AWSCognitoInfo.clientId,
  redirect_uri: AccessURL,
  response_type: "code",
  scope: "email openid phone",
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
