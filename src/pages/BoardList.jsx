import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// GraphQl
import { Board, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./BoardList.css";
// Components
import { Grid, Card, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";

const BoardList = ({history}) => {
  const { user } = useSelector((state) => state.user);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateBoardDialog, setOpenCreateBoardDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState(null);


  const loadBoards = async () => {
    if (user !== null) {
      const boardsQuery = await DataStore.query(Board, (b) =>
        b.users("contains", user.name)
      );
      boardsQuery.sort((a, b) =>
        a._lastChangedAt > b._lastChangedAt ? -1 : 1
      );
      setBoards(boardsQuery);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [user]);

  const createBoard = async () => {
    const newBoard = await DataStore.save(
      new Board({
        title: newBoardTitle,
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
    setOpenCreateBoardDialog(false);
  };

  const openBoard = (board) =>{
    history.push(`/board/${board.id}`);
  }

  const openBoardCreationDialog = () => {
    setNewBoardTitle(null);
    setOpenCreateBoardDialog(true);
  };

  const closeBoardCreationDialog = () => {
    setOpenCreateBoardDialog(false);
  };

  return (
    <div className="board-list-page-container">
      {loading ? (
        <React.Fragment>
          <Navigation history={history} />
          <Loading />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Navigation history={history} />
          <div id="board-list-page">
            <Grid container className="board-list-container" spacing={2}>
              {boards.map((board) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  className="board-list-element"
                  key={board.id}
                >
                  <Card
                    variant="outlined"
                    className="board-list-card radial-out"
                    onClick={() => openBoard(board)}
                  >
                    <Typography>{board.title}</Typography>
                  </Card>
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                className="board-list-element"
              >
                <Card
                  variant="outlined"
                  className="board-list-card-add radial-out"
                  onClick={openBoardCreationDialog}
                >
                  <AddIcon fontSize="large" />
                </Card>
              </Grid>
            </Grid>
          </div>
          <Dialog
            className="create-board-dialog"
            open={openCreateBoardDialog}
            onClose={closeBoardCreationDialog}
          >
            <DialogTitle className="create-board-dialog-title">
              Name your new board
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This name will be visible for all of its users.
              </DialogContentText>
              <TextField
                className="create-board-dialog-textfield"
                autoFocus
                margin="normal"
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    createBoard();
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={closeBoardCreationDialog}
                color="primary"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button onClick={createBoard} color="primary" variant="outlined">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
};

export default BoardList;
