import React, { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
// CSS
import "./CardListsContainer.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
// Components
import { Grid, Card as MaterialUICard, Typography } from "@material-ui/core";
import AddCard from "../components/AddCard";
import AddTodoCardDialog from "../components/AddTodoCardDialog";
import AddDoingCardDialog from "../components/AddDoingCardDialog";
import AddDoneCardDialog from "../components/AddDoneCardDialog";
import UserCardDialog from "./UserCardDialog";
import UserCard from "../components/UserCard";
import UserCardDone from "../components/UserCardDone";
// GraphQL
import { DataStore } from "@aws-amplify/datastore";
import { Card } from "../models/index";
// Utils
import { setClassByDeadlineCloseness } from "../utils/deadline";

const CardListsContainer = () => {
  const { cards /*cardsToDo, cardsDoing, cardsDone*/ } = useSelector(
    (state) => state.cards
  );
  const { subscription } = useSelector((state) => state.chosenCard);
  const [cardsToDo, setCardsToDo] = useState([]);
  const [cardsDoing, setCardsDoing] = useState([]);
  const [cardsDone, setCardsDone] = useState([]);
  const [openTodoCardDialog, setAddTodoCardDialog] = useState(false);
  const [openDoingCardDialog, setAddDoingCardDialog] = useState(false);
  const [openDoneCardDialog, setAddDoneCardDialog] = useState(false);
  const [showUserCardDialog, setShowUserCardDialog] = useState(false);

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
    setCardsToDo(
      newToDoCards.sort((a, b) => {
        if (a.timeLeftGroup < b.timeLeftGroup) {
          return -1;
        }
        if (a.timeLeftGroup > b.timeLeftGroup) {
          return 1;
        }
        return 0;
      })
    );

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
    setCardsDoing(
      newDoingCards.sort((a, b) => {
        if (a.timeLeftGroup < b.timeLeftGroup) {
          return -1;
        }
        if (a.timeLeftGroup > b.timeLeftGroup) {
          return 1;
        }
        return 0;
      })
    );

    const newDoneCards = cards
      .filter((card) => card.status === "DONE")
      .map((a) => ({ ...a }));
    newDoneCards.forEach(
      (card) =>
        (card.timeLeftGroup = setClassByDeadlineCloseness(
          card.startDate,
          card.endDate
        ))
    );
    setCardsDone(
      newDoneCards.sort((a, b) => {
        if (a.timeLeftGroup < b.timeLeftGroup) {
          return -1;
        }
        if (a.timeLeftGroup > b.timeLeftGroup) {
          return 1;
        }
        return 0;
      })
    );
  }, [cards]);

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
    try {
      subscription.unsubscribe();
    } catch {
      console.log("Error unsubscribing from the chosen card");
    }
    setShowUserCardDialog(false);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    let doneStatus;
    if (source.droppableId !== destination.droppableId) {
      if (
        source.droppableId === "card-list-todo" &&
        destination.droppableId === "card-list-doing"
      ) {
        const newCardsArray = [...cardsToDo];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        setCardsToDo(newCardsArray);
        setCardsDoing([...cardsDoing, card]);
      }
      if (
        source.droppableId === "card-list-todo" &&
        destination.droppableId === "card-list-done"
      ) {
        const newCardsArray = [...cardsToDo];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        doneStatus = card.timeLeftGroup;
        setCardsToDo(newCardsArray);
        setCardsDone([...cardsDone, card]);
      }
      if (
        source.droppableId === "card-list-doing" &&
        destination.droppableId === "card-list-todo"
      ) {
        const newCardsArray = [...cardsDoing];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        setCardsDoing(newCardsArray);
        setCardsToDo([...cardsToDo, card]);
      }
      if (
        source.droppableId === "card-list-doing" &&
        destination.droppableId === "card-list-done"
      ) {
        const newCardsArray = [...cardsDoing];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        doneStatus = card.timeLeftGroup;
        setCardsDoing(newCardsArray);
        setCardsDone([...cardsDone, card]);
      }
      if (
        source.droppableId === "card-list-done" &&
        destination.droppableId === "card-list-todo"
      ) {
        const newCardsArray = [...cardsDone];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        setCardsDone(newCardsArray);
        setCardsToDo([...cardsToDo, card]);
      }
      if (
        source.droppableId === "card-list-done" &&
        destination.droppableId === "card-list-doing"
      ) {
        const newCardsArray = [...cardsDone];
        const index = newCardsArray.findIndex(
          (card) => card.id === draggableId
        );
        const [card] = newCardsArray.splice(index, 1);
        setCardsDone(newCardsArray);
        setCardsDoing([...cardsDoing, card]);
      }

      const cardQuery = await DataStore.query(Card, (c) =>
        c.id("eq", draggableId)
      );
      switch (destination.droppableId) {
        case "card-list-todo":
          await DataStore.save(
            Card.copyOf(cardQuery[0], (updated) => {
              updated.status = "TODO";
            })
          );
          break;
        case "card-list-doing":
          await DataStore.save(
            Card.copyOf(cardQuery[0], (updated) => {
              updated.status = "DOING";
            })
          );
          break;
        case "card-list-done":
          await DataStore.save(
            Card.copyOf(cardQuery[0], (updated) => {
              updated.status = "DONE";
              updated.points = [doneStatus || "deadline-term-0"];
            })
          );
          break;
        default:
          return;
      }
    }
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={handleDragEnd}>
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
            <Droppable droppableId="card-list-todo">
              {(provided) => (
                <Grid
                  item
                  className="card-list"
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cardsToDo.map((card, index) => {
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
                        points={card.points}
                        timeLeftGroup={card.timeLeftGroup}
                        openCard={openUserCardDialog}
                        key={card.id}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <AddCard createCard={openAddTodoCardDialog} />
                </Grid>
              )}
            </Droppable>
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
            <Droppable droppableId="card-list-doing">
              {(provided) => (
                <Grid
                  item
                  className="card-list"
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cardsDoing.map((card, index) => {
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
                        points={card.points}
                        timeLeftGroup={card.timeLeftGroup}
                        openCard={openUserCardDialog}
                        key={card.id}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <AddCard createCard={openAddDoingCardDialog} />
                </Grid>
              )}
            </Droppable>
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
            <Droppable droppableId="card-list-done">
              {(provided) => (
                <Grid
                  item
                  className="card-list"
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cardsDone.map((card, index) => {
                    return (
                      <UserCardDone
                        id={card.id}
                        title={card.title}
                        startDate={card.startDate}
                        endDate={card.endDate}
                        timeLeftGroup={card.timeLeftGroup}
                        openCard={openUserCardDialog}
                        key={card.id}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <AddCard createCard={openAddDoneCardDialog} />
                </Grid>
              )}
            </Droppable>
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
      </DragDropContext>
    </React.Fragment>
  );
};

export default CardListsContainer;
