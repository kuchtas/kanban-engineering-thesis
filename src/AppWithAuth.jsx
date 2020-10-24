import React from "react";
import "./AppWithAuth.css";
import {
  AmplifyAuthenticator,
  AmplifyConfirmSignUp,
  AmplifySignIn,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import App from "./App";

function AppWithAuth() {
  return (
    <div>
      <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignUp
          slot="sign-up"
          headerText="Sign up to your Kanbannos account"
          usernameAlias="email"
          formFields={[
            {
              type: "email",
              required: true,
            },
            {
              type: "password",
              required: true,
            },
          ]}
        />
        <AmplifySignIn
          slot="sign-in"
          usernameAlias="email"
          headerText="Sign in to your Kanbannos account"
        
        />
        <AmplifyConfirmSignUp
          slot="confirm-sign-up"
          headerText="Thank you for registering to Kanbannos! Please check your e-mail for the verification link."
          formFields={null}
          submitButtonText={"Sign in"}
          handleSubmit={null}
        />
        <App />
      </AmplifyAuthenticator>
    </div>
  );
}

export default AppWithAuth;
