import React, { useEffect, useState } from "react";
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";

import Navigation from "../components/Navigation";
import Loading from "../components/Loading";

const BoardView = ({ history, match }) => {
  const [loading, setLoading] = useState(true);
  const [board, setBoards] = useState([]);
  const [cards, setCards] = useState([]);

  const loadBoards = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    console.log("boardQuery: ", JSON.stringify(boardQuery));
    setBoards(boardQuery[0]);
  };

  const loadCards = async () => {
    const cardsQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id)
    );
    console.log("cardsQuery: ", JSON.stringify(cardsQuery));
    setCards(cardsQuery);
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      loadBoards();
      loadCards();
    }
  });

  return (
    <div className="board-view-page-container">
      {loading ? (
        <div className="board-view-page loading-div">
          <Navigation history={history} />
          <Loading />
        </div>
      ) : (
        <div className="board-view-page">
          <Navigation history={history} />
          <p>{JSON.stringify(board)}</p>
          <p>{JSON.stringify(cards)}</p>
        </div>
      )}
    </div>
  );
};

export default BoardView;
