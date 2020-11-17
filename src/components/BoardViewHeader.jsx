import React, { useState } from "react";
// Components
import { Toolbar, Button, Typography } from "@material-ui/core";
// CSS
import "./BoardViewHeader.css";

const BoardViewHeader = ({ boardName }) => {
  return (
    <Toolbar
      className="board-view-page-header-container"
      disableGutters={false}
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
        See members
      </Button>
      <Button
        className="board-view-page-header-button-delete"
        variant="outlined"
        color="primary"
      >
        Delete board
      </Button>
    </Toolbar>
  );
};

export default BoardViewHeader;
