import React from "react";
import "./Navigation.css";
import { Button, PageHeader } from "antd";
import { Auth, DataStore } from "aws-amplify";

const Navigation = () => {

  const logOut = async () => {
    await DataStore.clear();
    localStorage.clear();
    Auth.signOut();
    window.location.reload();
  };

  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        title="Kanbannos"
        ghost={false}
        className="site-page-header"
        extra={[
          <Button className="sign-out-button" key="1" onClick={logOut}>
            Sign out
          </Button>,
        ]}
      />
    </div>
  );
};

export default Navigation;
