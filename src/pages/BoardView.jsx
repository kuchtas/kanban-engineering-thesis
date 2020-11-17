import React, { useEffect, useState } from "react";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
import store from '../store';
// CSS
import "./BoardView.css";
// Components 
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError";
import CardListsContainer from "../components/CardListsContainer";
import BoardViewHeader from "../components/BoardViewHeader";

const BoardView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { board } = useSelector((state) => state.board);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);

  const loadBoard = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    store.dispatch({ type: "board/loaded", payload: boardQuery[0] });
    setLoadingBoard(false);
  };

  const loadCards = async () => {
    const cardsToDoQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "TODO")
    );
    store.dispatch({ type: "cards/todoloaded", payload: cardsToDoQuery });

    const cardsDoingQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "DOING")
    );
    store.dispatch({ type: "cards/doingloaded", payload: cardsDoingQuery });

    const cardsDoneQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "DONE")
    );
    store.dispatch({ type: "cards/doneloaded", payload: cardsDoneQuery });
    setLoadingCards(false);
  };

  useEffect(() => {
    if (loadingBoard) loadBoard();
    if (loadingCards) loadCards();
  });

  useEffect(() => {
    if (!loadingBoard) setUserValid(board.users.includes(user.name));
  }, [board]);

  return (
    <React.Fragment>
      {loadingCards || loadingBoard ? (
        <div className="board-view-page">
          {/* display spinner when loading */}
          <Navigation history={history} />
          <Loading />
        </div>
      ) : userValid ? (
        <div className="board-view-page">
          {/* if all is loaded and user is a part of the board display it */}
          <Navigation history={history} />
          <BoardViewHeader boardName={board.title} />
          <CardListsContainer />
        </div>
      ) : (
        <div className="board-view-page-invalid-user-error">
          {/* if user is not a part of the board they cannot see it */}
          <Navigation history={history} />
          <InvalidUserError history={history} />
        </div>
      )}
    </React.Fragment>
  );
};

export default BoardView;
