import React, { useState, useEffect } from "react";
// GraphQL
import { Board } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Components
import {
  Toolbar,
  Button,
  MuiThemeProvider,
  TextField,
  ClickAwayListener,
} from "@material-ui/core";
// Redux
import { useSelector } from "react-redux";
// CSS
import "./TimelineViewHeader.css";
import { deleteButtonTheme } from "../themes/deleteButtonTheme";
import { boardTitleEditTheme } from "../themes/boardTitleEditTheme";

const TimelineViewHeader = ({
  openBoardDeletionDialog,
  openMemberAdditionDialog,
  history,
}) => {
  const { id, title } = useSelector((state) => state.board);
  const [editableTitle, setEditableTitle] = useState(title);

  useEffect(() => {
    setEditableTitle(title);
  }, [title]);

  const handleClickAway = async () => {
    const newTitle = editableTitle.trim();

    if (
      newTitle !== title &&
      newTitle !== null &&
      newTitle !== "" &&
      newTitle.length < 120
    ) {
      const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

      await DataStore.save(
        Board.copyOf(boardQuery[0], (updated) => {
          updated.title = newTitle;
        })
      );
      // store.dispatch({ type: "board/changedtitle", payload: newTitle })
    } else {
      setEditableTitle(title);
    }
  };
  return (
    <Toolbar
      className="timeline-view-page-header-container"
      disableGutters={true}
    >
      <MuiThemeProvider theme={boardTitleEditTheme}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            key="timeline-title-form"
            variant="outlined"
            className="timeline-view-page-header-title"
            margin="dense"
            onChange={(e) => setEditableTitle(e.target.value)}
            error={editableTitle?.length > 120}
            onKeyPress={(e) => {
              if (e.key === "Enter" && editableTitle.length < 120) {
                handleClickAway();
              }
            }}
            value={editableTitle}
          ></TextField>
        </ClickAwayListener>
      </MuiThemeProvider>
      <Button
        className="timeline-view-page-header-button-board"
        variant="outlined"
        color="primary"
        onClick={() => history.push(`/board/${id}`)}
      >
        Board
      </Button>
      <Button
        className="timeline-view-page-header-button-statistics"
        variant="outlined"
        color="primary"
        onClick={() => history.push(`/board/${id}/statistics`)}
      >
        Statistics
      </Button>
      <Button
        className="timeline-view-page-header-button-members"
        variant="outlined"
        color="primary"
        onClick={openMemberAdditionDialog}
      >
        See members
      </Button>
      <MuiThemeProvider theme={deleteButtonTheme}>
        <Button
          className="timeline-view-page-header-button-delete"
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

export default TimelineViewHeader;
