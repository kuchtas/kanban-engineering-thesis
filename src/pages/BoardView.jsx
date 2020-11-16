import React, { useEffect, useState } from "react";
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
import { useSelector } from "react-redux";
import store from '../store';
import "./BoardView.css";

import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError"

const BoardView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { board } = useSelector((state) => state.board);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cards, setCards] = useState([]);

  const loadBoard = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    console.log("boardQuery: ", JSON.stringify(boardQuery));
    store.dispatch({ type: "board/loaded", payload: boardQuery[0] });
    setLoadingBoard(false);
  };

  const loadCards = async () => {
    const cardsQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id)
    );
    console.log("cardsQuery: ", JSON.stringify(cardsQuery));
    setCards(cardsQuery);
    setLoadingCards(false);
  };

  const createCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: match.params.id,
        title: "A card added to first board in boards list",
        status: "DOING",
        startDate: "2020-11-10",
        endDate: "2020-12-31",
      })
    );
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    loadCards();
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
