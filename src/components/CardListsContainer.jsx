import React, { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./CardListsContainer.css";
// Components
import { Grid, Card as MaterialUICard, Typography } from "@material-ui/core";
import AddCard from "../components/AddCard";

const CardListsContainer = () => {
  const { cardsToDo, cardsDoing, cardsDone } = useSelector(
    (state) => state.cards
  );
  const { id } = useSelector((state) => state.board);

  const createToDoCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: "A ToDo card",
        status: "TODO",
        startDate: "2020-11-10",
        endDate: "2020-12-31",
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    store.dispatch({ type: "cards/todoadded", payload: newCard });
  };

  const createDoingCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: "A Doing card",
        status: "DOING",
        startDate: "2020-11-10",
        endDate: "2020-12-31",
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    store.dispatch({ type: "cards/doingadded", payload: newCard });
  };

  const createDoneCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: "A Done card",
        status: "DONE",
        startDate: "2020-11-10",
        endDate: "2020-12-31",
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    store.dispatch({ type: "cards/doneadded", payload: newCard });
  };

  return (
    <React.Fragment>
      <Grid container className="card-lists-container">
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className="card-list-todo card-list"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="todo-header"
          >
            <Typography>TO DO</Typography>
          </MaterialUICard>
          {cardsToDo.map((card) => {
            return (
              <MaterialUICard
                variant="outlined"
                className="card-list-element"
                key={card.id}
              >
                <Typography>{card.status}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={createToDoCard} />
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className="card-list-doing card-list"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="doing-header"
          >
            <Typography>DOING</Typography>
          </MaterialUICard>
          {cardsDoing.map((card) => {
            return (
              <MaterialUICard
                variant="outlined"
                className="card-list-element"
                key={card.id}
              >
                <Typography>{card.status}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={createDoingCard} />
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className="card-list-done card-list"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="done-header"
          >
            <Typography>DONE</Typography>
          </MaterialUICard>
          {cardsDone.map((card) => {
            return (
              <MaterialUICard
                variant="outlined"
                className="card-list-element"
                key={card.id}
              >
                <Typography>{card.status}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={createDoneCard} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CardListsContainer;
