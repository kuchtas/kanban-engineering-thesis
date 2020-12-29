import { Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setClassByDeadlineCloseness } from "../utils/deadline";

import "../styles/BoardStatisticsContainer.css";
import CardTypesStatistics from "./CardTypesStatistics";
const BoardStatisticsContainer = () => {
  const { cards } = useSelector((state) => state.cards);
  const [missedTasks, setMissedTasks] = useState([]);
  const [cardsToDo, setCardsToDo] = useState([]);
  const [cardsDoing, setCardsDoing] = useState([]);
  const [cardsDone, setCardsDone] = useState([]);

  useEffect(() => {
    const newToDoCards = cards
      .filter((card) => card.status === "TODO")
      .map((a) => ({ ...a }));
    newToDoCards.forEach(
      (card) =>
        (card.timeLeftGroup = setClassByDeadlineCloseness(
          card.startDate,
          card.endDate
        ))
    );
    setCardsToDo(newToDoCards);

    const newDoingCards = cards
      .filter((card) => card.status === "DOING")
      .map((a) => ({ ...a }));
    newDoingCards.forEach(
      (card) =>
        (card.timeLeftGroup = setClassByDeadlineCloseness(
          card.startDate,
          card.endDate
        ))
    );
    setCardsDoing(newDoingCards);

    const newDoneCards = cards
      .filter((card) => card.status === "DONE")
      .map((a) => ({ ...a }));
    setCardsDone(newDoneCards);
  }, [cards]);

  useEffect(() => {
    const missedCards = [
      ...cardsToDo.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDoing.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDone.filter((card) => card.points[0] === "deadline-term-5"),
    ];
    setMissedTasks(missedCards);
  }, [cardsToDo, cardsDoing, cardsDone]);

  return (
    <Grid
      container
      xs={12}
      color="black"
      className="statistics-board-container"
    >
      <Grid container xs={12} className="statistics-board-total-container">
        <Grid item xs={6} className="statistics-board-total-cards">
          <Typography>
            Total number of tasks on this board: {cards.length}
          </Typography>
        </Grid>
        <Grid item xs={6} className="statistics-board-total-missed-cards">
          <Typography>
            Total number of missed tasks on this board: {missedTasks.length}
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} className="statistics-board-lists-container">
        <Grid
          container
          xs={4}
          className="statistics-board-todo-container enter-board-statistics-todo"
        >
          <Grid item xs={12} className="statistics-board-list-title">
            TO DO - {cardsToDo.length}
          </Grid>
          <CardTypesStatistics cards={cardsToDo} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-board-doing-container enter-board-statistics-doing"
        >
          <Grid item xs={12} className="statistics-board-list-title">
            DOING - {cardsDoing.length}
          </Grid>
          <CardTypesStatistics cards={cardsDoing} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-board-done-container enter-board-statistics-done"
        >
          <Grid item xs={12} className="statistics-board-list-title">
            DONE - {cardsDone.length}
          </Grid>
          <CardTypesStatistics cards={cardsDone} done="true" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BoardStatisticsContainer;
