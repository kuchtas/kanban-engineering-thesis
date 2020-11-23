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
import UserCardDialog from "./UserCardDialog";
import UserCard from "../components/UserCard";

const CardListsContainer = () => {
  const { cardsToDo, cardsDoing, cardsDone } = useSelector(
    (state) => state.cards
  );
  const [openTodoCardDialog, setAddTodoCardDialog] = useState(false);
  const [openDoingCardDialog, setAddDoingCardDialog] = useState(false);
  const [openDoneCardDialog, setAddDoneCardDialog] = useState(false);
  const [showUserCardDialog, setShowUserCardDialog] = useState(false);
  const [chosenCard, setChosenCard] = useState({
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    status: "",
  });

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
  
  const openUserCardDialog = (id, title, startDate, endDate, status) => {
    setChosenCard({
      id: id,
      title: title,
      startDate: startDate,
      endDate: endDate,
      status: status,
    });
    setShowUserCardDialog(true);
  };
  const closeUserCardDialog = () => {
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
                  openCard={openUserCardDialog}
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
                  openCard={openUserCardDialog}
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
                  openCard={openUserCardDialog}
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
        card={chosenCard}
      />
    </React.Fragment>
  );
};

export default CardListsContainer;
