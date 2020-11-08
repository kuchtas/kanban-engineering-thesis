import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Board, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./BoardList.css";
import { Grid, Paper } from "@material-ui/core";

const BoardList = () => {
  const { user } = useSelector((state) => state.user);
  const [boards, setBoards] = useState([]);

  const loadBoards = async () => {
    console.log("loading boards...");
    if (user !== null) {
      const boardsQuery = await DataStore.query(Board, (b) =>
        b.users("contains", user.name)
      );
      console.log(JSON.stringify(boardsQuery));
      setBoards(boardsQuery);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [user]);

  const createBoard = async () => {
    const newBoard = await DataStore.save(
      new Board({
        title: "That is a new board!",
        users: [user.name],
        cards: [],
      })
    );

    const userQuery = await DataStore.query(User, (u) =>
      u.name("eq", user.name)
    );
    console.log("query", userQuery);

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        updated.boards = [...updated.boards, newBoard.id];
      })
    );
    loadBoards();
  };

  return (
    <div id="board-list-page">
      <Grid container className="board-list-container" spacing={2}>
        {boards.map((board) => (
          <Grid item xs={6} className="board-list-element">
            <Paper variant="elevation">{board.title}</Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BoardList;
