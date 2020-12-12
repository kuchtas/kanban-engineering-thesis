import React from "react";
// Redux
import { useSelector } from "react-redux";
// GraphQL
import { Auth, DataStore } from "aws-amplify";
// Components
import {
  Toolbar,
  Button,
  Typography,
  MuiThemeProvider,
} from "@material-ui/core";
// CSS
import "./Navigation.css";
import { signOutButtonTheme } from "../themes/singOutButtonTheme";

const Navigation = ({ history }) => {
  const { user } = useSelector((state) => state.user);

  const logOut = async () => {
    await DataStore.clear();
    localStorage.clear();
    history.push("/home");
    Auth.signOut();
    window.location.reload();
  };

  const handleClick = () => history.push("/home");

  return (
    <div className="page-header-wrapper">
      <Toolbar className="page-header" disableGutters={true}>
        <Typography
          variant="h5"
          className="page-header-title"
          onClick={handleClick}
        >
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
