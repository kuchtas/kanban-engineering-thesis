import React, { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
// CSS
import "./CardListsContainer.css";
// Components
import { Grid, Card as MaterialUICard, Typography } from "@material-ui/core";
import AddCard from "../components/AddCard";
import AddTodoCardDialog from "../components/AddTodoCardDialog";
import AddDoingCardDialog from "../components/AddDoingCardDialog";
import AddDoneCardDialog from "../components/AddDoneCardDialog";
import UserCardDialog from "./UserCardDialog";
import UserCard from "../components/UserCard";
// GraphQL
import { DataStore } from "@aws-amplify/datastore";
import { Card } from "../models/index";

const CardListsContainer = () => {
  const { cardsToDo, cardsDoing, cardsDone } = useSelector(
    (state) => state.cards
  );
  const { subscription } = useSelector((state) => state.chosenCard);
  const [openTodoCardDialog, setAddTodoCardDialog] = useState(false);
  const [openDoingCardDialog, setAddDoingCardDialog] = useState(false);
  const [openDoneCardDialog, setAddDoneCardDialog] = useState(false);
  const [showUserCardDialog, setShowUserCardDialog] = useState(false);
  let cardSubscription;
  const openAddTodoCardDialog = () => {
    setAddTodoCardDialog(true);
  };
  const closeAddTodoCardDialog = () => {
    setAddTodoCardDialog(false);
  };

  const openAddDoingCardDialog = () => {
    setAddDoingCardDialog(true);
  };
  const closeAddDoingCardDialog = () => {
    setAddDoingCardDialog(false);
  };

  const openAddDoneCardDialog = () => {
    setAddDoneCardDialog(true);
  };
  const closeAddDoneCardDialog = () => {
    setAddDoneCardDialog(false);
  };
  
  const loadChosenCard = async (id) => {
    const cardQuery = await DataStore.query(Card, (c) => c.id("eq", id));

    if (cardQuery !== undefined)
      store.dispatch({ type: "chosencard/added", payload: cardQuery[0] });
  };

  const openUserCardDialog = (id) => {
    loadChosenCard(id);
    cardSubscription = DataStore.observe(Card, (c) => c.id("eq", id)).subscribe(
      (c) => {
        console.log(c.opType);
        if (c.opType === "DELETE") closeUserCardDialog();
        loadChosenCard(id);
      }
    );
    store.dispatch({ type: "chosencard/setsub", payload: cardSubscription });
    setShowUserCardDialog(true);
  };
  const closeUserCardDialog = () => {
    console.log("unsubscribing from", subscription);
    try{
      subscription.unsubscribe();
    }
    catch{
      console.log("Error unsubscribing from the chosen card");
    }
    setShowUserCardDialog(false);
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
          className="card-list-todo"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="todo-header"
          >
            <Typography>TO DO</Typography>
          </MaterialUICard>
          <Grid item className="card-list">
            {cardsToDo.map((card) => {
              return (
                <UserCard
                  id={card.id}
                  title={card.title}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  status={card.status}
                  description={card.description}
                  tag={card.tag}
                  users={card.users}
                  openCard={openUserCardDialog}
                  key={card.id}
                />
              );
            })}
            <AddCard createCard={openAddTodoCardDialog} />
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className="card-list-doing"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="doing-header"
          >
            <Typography>DOING</Typography>
          </MaterialUICard>
          <Grid item className="card-list">
            {cardsDoing.map((card) => {
              return (
                <UserCard
                  id={card.id}
                  title={card.title}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  status={card.status}
                  description={card.description}
                  tag={card.tag}
                  users={card.users}
                  openCard={openUserCardDialog}
                  key={card.id}
                />
              );
            })}
            <AddCard createCard={openAddDoingCardDialog} />
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          className="card-list-done"
        >
          <MaterialUICard
            variant="outlined"
            className="card-list-header"
            key="done-header"
          >
            <Typography>DONE</Typography>
          </MaterialUICard>
          <Grid item className="card-list">
            {cardsDone.map((card) => {
              return (
                <UserCard
                  id={card.id}
                  title={card.title}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  status={card.status}
                  description={card.description}
                  tag={card.tag}
                  users={card.users}
                  openCard={openUserCardDialog}
                  key={card.id}
                />
              );
            })}
            <AddCard createCard={openAddDoneCardDialog} />
          </Grid>
        </Grid>
      </Grid>
      <AddTodoCardDialog
        openAddTodoCardDialog={openTodoCardDialog}
        closeAddTodoCardDialog={closeAddTodoCardDialog}
      />
      <AddDoingCardDialog
        openAddDoingCardDialog={openDoingCardDialog}
        closeAddDoingCardDialog={closeAddDoingCardDialog}
      />
      <AddDoneCardDialog
        openAddDoneCardDialog={openDoneCardDialog}
        closeAddDoneCardDialog={closeAddDoneCardDialog}
      />
      <UserCardDialog
        showUserCardDialog={showUserCardDialog}
        closeUserCardDialog={closeUserCardDialog}
      />
    </React.Fragment>
  );
};

export default CardListsContainer;
