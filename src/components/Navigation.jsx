import React from "react";
import "./Navigation.css";
import {
  Toolbar,
  Button,
  Typography,
  MuiThemeProvider,
} from "@material-ui/core";
import { Auth, DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import {signOutButtonTheme} from "../themes/singOutButtonTheme";


const Navigation = ({ history }) => {
  const { user } = useSelector((state) => state.user);

  const logOut = async () => {
    await DataStore.clear();
    localStorage.clear();
    Auth.signOut();
    window.location.reload();
  };

  const handleClick = () => history.push("/home");

  return (
    <div className="page-header-wrapper" onClick={handleClick}>
      <Toolbar className="page-header" disableGutters={true}>
        <Typography variant="h5" className="page-header-title">
          Kanbannos
        </Typography>
        {user && (
          <Typography className="navigation-username">{user.name}</Typography>
        )}
        <MuiThemeProvider theme={signOutButtonTheme}>
            <Button className="sign-out-button" onClick={logOut}>
              Sign out
            </Button>
        </MuiThemeProvider>
      </Toolbar>
    </div>
  );
};

export default Navigation;
