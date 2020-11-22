import React, { useState } from "react";
// Redux
import { useSelector } from "react-redux";
// CSS
import "./CardListsContainer.css";
// Components
import { Grid, Card as MaterialUICard, Typography } from "@material-ui/core";
import AddCard from "../components/AddCard";
import AddTodoCardDialog from "../components/AddTodoCardDialog";
import AddDoingCardDialog from "../components/AddDoingCardDialog";
import AddDoneCardDialog from "../components/AddDoneCardDialog";

const CardListsContainer = () => {
  const { cardsToDo, cardsDoing, cardsDone } = useSelector(
    (state) => state.cards
  );
  const [openTodoCardDialog, setAddTodoCardDialog] = useState(false);
  const [openDoingCardDialog, setAddDoingCardDialog] = useState(false);
  const [openDoneCardDialog, setAddDoneCardDialog] = useState(false);

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
                <Typography>{card.title}</Typography>
                <Typography>{card.startDate}</Typography>
                <Typography>{card.endDate}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={openAddTodoCardDialog} />
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
                <Typography>{card.title}</Typography>
                <Typography>{card.startDate}</Typography>
                <Typography>{card.endDate}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={openAddDoingCardDialog} />
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
                <Typography>{card.title}</Typography>
                <Typography>{card.startDate}</Typography>
                <Typography>{card.endDate}</Typography>
              </MaterialUICard>
            );
          })}
          <AddCard createCard={openAddDoneCardDialog} />
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
    </React.Fragment>
  );
};

export default CardListsContainer;
