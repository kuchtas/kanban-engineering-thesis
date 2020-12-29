import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// GraphQl
import { Board } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "../styles/BoardList.css";
// Components
import { Grid } from "@material-ui/core";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import { loadBoards, createBoard } from "../utils/databaseActions";
import BoardListElement from "../components/BoardListElement";
import BoardListAddElement from "../components/BoardListAddElement";
import AddBoardDialog from "../components/AddBoardDialog";

const BoardList = ({ history }) => {
  const { user } = useSelector((state) => state.user);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateBoardDialog, setOpenCreateBoardDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const loadBoardsBoardList = async () => {
    const boardsQuery = await loadBoards(user.name);
    setBoards(boardsQuery);
    setLoading(false);
  };

  useEffect(() => {
    if (user !== null) {
      loadBoardsBoardList(user.name);
      const subscription = DataStore.observe(Board, (b) =>
        b.users("contains", user.name)
      ).subscribe((b) => {
        console.log(b.opType);
        loadBoardsBoardList(user.name);
      });

      return () => {
        console.log("unsubsribing from board table");
        subscription.unsubscribe();
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createBoardBoardList = async () => {
    createBoard(newBoardTitle, user.name);
    setOpenCreateBoardDialog(false);
  };

  const openBoard = (board) => {
    history.push(`/board/${board.id}`);
  };

  const openBoardCreationDialog = () => {
    setNewBoardTitle(null);
    setOpenCreateBoardDialog(true);
  };

  const closeBoardCreationDialog = () => {
    setOpenCreateBoardDialog(false);
  };

  const changeBoardTitle = (e) => {
    setNewBoardTitle(e.target.value.trim());
  };

  return (
    <div className="board-list-page-container">
      {loading ? (
        <>
          <Navigation history={history} />
          <Loading />
        </>
      ) : (
        <>
          <Navigation history={history} />
          <div id="board-list-page">
            <Grid container className="board-list-container" spacing={2}>
              {boards.map((board) => (
                <BoardListElement
                  board={board}
                  openBoard={openBoard}
                  key={board.id}
                />
              ))}
              <BoardListAddElement
                openBoardCreationDialog={openBoardCreationDialog}
              />
            </Grid>
          </div>
          <AddBoardDialog
            openCreateBoardDialog={openCreateBoardDialog}
            closeBoardCreationDialog={closeBoardCreationDialog}
            newBoardTitle={newBoardTitle}
            createBoardBoardList={createBoardBoardList}
            changeBoardTitle={changeBoardTitle}
            user={user}
          />
        </>
      )}
    </div>
  );
};

export default BoardList;
