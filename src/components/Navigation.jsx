import React from "react";
import "./Navigation.css";
import { Toolbar, Button, Typography } from "@material-ui/core";
import { Auth, DataStore } from "aws-amplify";
import { useSelector } from "react-redux";

const Navigation = ({ history }) => {
  const { user } = useSelector((state) => state.user);

  const logOut = async () => {
    await DataStore.clear();
    localStorage.clear();
    Auth.signOut();
    window.location.reload();
  };

  const handleClick = () => history.push("/");

  return (
    <div className="page-header-wrapper" onClick={handleClick}>
      <Toolbar className="page-header" disableGutters={true}>
            <Typography variant="h5" className="page-header-title">
                  Kanbannos
            </Typography>
            {user && <Typography className="navigation-username">{user.name}</Typography>}
            <Button className="sign-out-button" onClick={logOut}>
              Sign out
            </Button>
      </Toolbar>
    </div>
  );
};

export default Navigation;
