import React, { useState, useEffect} from "react";
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
import "./BoardViewHeader.css";
import {deleteButtonTheme} from "../themes/deleteButtonTheme";
import { boardTitleEditTheme } from "../themes/boardTitleEditTheme";

const BoardViewHeader = ({ openBoardDeletionDialog, openMemberAdditionDialog }) => {
  const { id, title } = useSelector((state) => state.board);
  const [editableTitle, setEditableTitle] = useState(title);

  const handleClickAway = async () =>{
    const newTitle = editableTitle.trim()
    
    if(newTitle !== title && newTitle !== null && newTitle !== ""){
      const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

      await DataStore.save(
        Board.copyOf(boardQuery[0], (updated) => {
          updated.title = newTitle;
        })
      );
      // store.dispatch({ type: "board/changedtitle", payload: newTitle })
    }
    else{
      setEditableTitle(title);
    }
  }
  return (
    <Toolbar className="board-view-page-header-container" disableGutters={true}>
      <MuiThemeProvider theme={boardTitleEditTheme}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            key="board-title-form"
            variant="outlined"
            className="board-view-page-header-title"
            margin="dense"
            onChange={(e) => setEditableTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleClickAway();
              }
            }}
            value={editableTitle}
          ></TextField>
        </ClickAwayListener>
      </MuiThemeProvider>
      <Button
        className="board-view-page-header-button-members"
        variant="outlined"
        color="primary"
        onClick={openMemberAdditionDialog}
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
