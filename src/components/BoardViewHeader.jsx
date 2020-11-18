import React, { useState } from "react";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Components
import { Toolbar, Button, Typography, MuiThemeProvider } from "@material-ui/core";
// CSS
import "./BoardViewHeader.css";
import {deleteButtonTheme} from "../themes/deleteButtonTheme";

const BoardViewHeader = ({ boardName, openBoardDeletionDialog }) => {

  return (
    <Toolbar
      className="board-view-page-header-container"
      disableGutters={true}
    >
      <Typography
        variant="overline"
        className="board-view-page-header-title"
        noWrap={true}
      >
        {boardName}
      </Typography>
      <Button
        className="board-view-page-header-button-members"
        variant="outlined"
        color="primary"
      >
        Add a member
      </Button>
      <MuiThemeProvider theme={deleteButtonTheme}>  
        <Button
          className="board-view-page-header-button-delete"
          variant="outlined"
          color="primary"
          onClick={openBoardDeletionDialog}
        >
          Delete board
        </Button>
      </MuiThemeProvider>
    </Toolbar>
  );
};

export default BoardViewHeader;
