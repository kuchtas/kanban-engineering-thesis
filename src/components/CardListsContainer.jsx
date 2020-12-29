import React, { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
// CSS
import "../styles/CardListsContainer.css";
import { DragDropContext } from "react-beautiful-dnd";
// Components
import { Grid } from "@material-ui/core";
import AddTodoCardDialog from "../components/AddTodoCardDialog";
import AddDoingCardDialog from "../components/AddDoingCardDialog";
import AddDoneCardDialog from "../components/AddDoneCardDialog";
import UserCardDialog from "./UserCardDialog";
// GraphQL
import { DataStore } from "@aws-amplify/datastore";
import { Card } from "../models/index";
// Utils
import { setClassByDeadlineCloseness } from "../utils/deadline";
import TodoList from "./TodoList";
import DoingList from "./DoingList";
import DoneList from "./DoneList";
import {
  deadlineSort,
  tagSort,
  deadlineSortDone,
  tagSortDone,
} from "../utils/sort";
import { handleDragEnd } from "../utils/cardDragging";

const CardListsContainer = () => {
  const { cards } = useSelector((state) => state.cards);
  const { subscription } = useSelector((state) => state.chosenCard);
  const [cardsToDo, setCardsToDo] = useState([]);
  const [cardsDoing, setCardsDoing] = useState([]);
  const [cardsDone, setCardsDone] = useState([]);
  const [openTodoCardDialog, setAddTodoCardDialog] = useState(false);
  const [openDoingCardDialog, setAddDoingCardDialog] = useState(false);
  const [openDoneCardDialog, setAddDoneCardDialog] = useState(false);
  const [showUserCardDialog, setShowUserCardDialog] = useState(false);
  const [sortTodoByDeadline, setSortTodoByDeadline] = useState(true);
  const [sortDoingByDeadline, setSortDoingByDeadline] = useState(true);
  const [sortDoneByDeadline, setSortDoneByDeadline] = useState(true);

  const changeSortTodoMethodDeadline = () => {
    setSortTodoByDeadline(true);
  };
  const changeSortTodoMethodTag = () => {
    setSortTodoByDeadline(false);
  };
  const changeSortDoingMethodDeadline = () => {
    setSortDoingByDeadline(true);
  };
  const changeSortDoingMethodTag = () => {
    setSortDoingByDeadline(false);
  };
  const changeSortDoneMethodDeadline = () => {
    setSortDoneByDeadline(true);
  };
  const changeSortDoneMethodTag = () => {
    setSortDoneByDeadline(false);
  };

  const changeTodoCards = (cards) => {
    setCardsToDo(cards);
  };
  const changeDoingCards = (cards) => {
    setCardsDoing(cards);
  };
  const changeDoneCards = (cards) => {
    setCardsDone(cards);
  };

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
      newToDoCards.sort(sortTodoByDeadline ? deadlineSort : tagSort)
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
      newDoingCards.sort(sortDoingByDeadline ? deadlineSort : tagSort)
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
      newDoneCards.sort(sortDoneByDeadline ? deadlineSortDone : tagSortDone)
    );
  }, [cards, sortDoneByDeadline, sortDoingByDeadline, sortTodoByDeadline]);

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

  return (
    <>
      <DragDropContext
        onDragEnd={(item) =>
          handleDragEnd(
            item,
            cardsToDo,
            cardsDoing,
            cardsDone,
            sortDoingByDeadline,
            sortDoneByDeadline,
            sortTodoByDeadline,
            changeTodoCards,
            changeDoingCards,
            changeDoneCards
          )
        }
      >
        <Grid container className="card-lists-container">
          <TodoList
            cardsToDo={cardsToDo}
            openUserCardDialog={openUserCardDialog}
            openAddTodoCardDialog={openAddTodoCardDialog}
            changeSortTodoMethodDeadline={changeSortTodoMethodDeadline}
            changeSortTodoMethodTag={changeSortTodoMethodTag}
          />
          <DoingList
            cardsDoing={cardsDoing}
            openUserCardDialog={openUserCardDialog}
            openAddDoingCardDialog={openAddDoingCardDialog}
            changeSortDoingMethodDeadline={changeSortDoingMethodDeadline}
            changeSortDoingMethodTag={changeSortDoingMethodTag}
          />
          <DoneList
            cardsDone={cardsDone}
            openUserCardDialog={openUserCardDialog}
            openAddDoneCardDialog={openAddDoneCardDialog}
            changeSortDoneMethodDeadline={changeSortDoneMethodDeadline}
            changeSortDoneMethodTag={changeSortDoneMethodTag}
          />
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
    </>
  );
};

export default CardListsContainer;
