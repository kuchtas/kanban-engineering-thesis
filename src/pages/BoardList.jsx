import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Board, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./BoardList.css";
import { Grid, Card, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";

const BoardList = ({history}) => {
  const { user } = useSelector((state) => state.user);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBoards = async () => {
    if (user !== null) {
      const boardsQuery = await DataStore.query(Board, (b) =>
        b.users("contains", user.name)
      );
      console.log(JSON.stringify(boardsQuery));
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

  const openBoard = (board) =>{
    history.push(`/board/${board.id}`);
  }

  return (
    <div className="board-list-page-container">
      {loading ? (
        <div>
          <Navigation history={history} />
          <Loading />
        </div>
      ) : (
        <div>
          <Navigation history={history} />
          <div id="board-list-page">
            <Grid container className="board-list-container" spacing={2}>
              {boards.map((board) => (
                <Grid
                  alignContent="stretch"
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={4}
                  className="board-list-element"
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
                alignContent="stretch"
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={4}
                className="board-list-element"
              >
                <Card
                  variant="outlined"
                  className="board-list-card-add radial-out"
                  onClick={createBoard}
                >
                  <AddIcon fontSize="large" />
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
