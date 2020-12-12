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
import "./StatisticsViewHeader.css";
import { deleteButtonTheme } from "../themes/deleteButtonTheme";
import { boardTitleEditTheme } from "../themes/boardTitleEditTheme";

const StatisticsViewHeader = ({
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
      className="statistics-view-page-header-container"
      disableGutters={true}
    >
      <MuiThemeProvider theme={boardTitleEditTheme}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            key="statistics-title-form"
            variant="outlined"
            className="statistics-view-page-header-title"
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
        className="statistics-view-page-header-button-timeline"
        variant="outlined"
        color="primary"
        onClick={() => history.push(`/board/${id}/timeline`)}
      >
        timeline
      </Button>
      <Button
        className="statistics-view-page-header-button-statistics"
        variant="outlined"
        color="primary"
        onClick={() => history.push(`/board/${id}`)}
      >
        Board
      </Button>
      <Button
        className="statistics-view-page-header-button-members"
        variant="outlined"
        color="primary"
        onClick={openMemberAdditionDialog}
      >
        Members
      </Button>
      <MuiThemeProvider theme={deleteButtonTheme}>
        <Button
          className="statistics-view-page-header-button-delete"
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

export default StatisticsViewHeader;
