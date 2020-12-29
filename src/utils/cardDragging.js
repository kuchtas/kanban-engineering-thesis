import { DataStore } from "aws-amplify";
import { Card } from "../models/index";
import {
  deadlineSort,
  tagSort,
  deadlineSortDone,
  tagSortDone,
} from "../utils/sort";
export const handleDragEnd = async (
  result,
  cardsToDo,
  cardsDoing,
  cardsDone,
  sortDoingByDeadline,
  sortDoneByDeadline,
  sortTodoByDeadline,
  changeTodoCards,
  changeDoingCards,
  changeDoneCards
) => {
  const { destination, source, draggableId } = result;
  console.log(result);
  if (!destination) return;
  let doneStatus;
  if (source.droppableId !== destination.droppableId) {
    if (
      source.droppableId === "card-list-todo" &&
      destination.droppableId === "card-list-doing"
    ) {
      const newCardsArray = [...cardsToDo];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      changeTodoCards(newCardsArray);
      changeDoingCards(
        [...cardsDoing, card].sort(sortDoingByDeadline ? deadlineSort : tagSort)
      );
    }
    if (
      source.droppableId === "card-list-todo" &&
      destination.droppableId === "card-list-done"
    ) {
      const newCardsArray = [...cardsToDo];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      doneStatus = card.timeLeftGroup;
      changeTodoCards(newCardsArray);
      changeDoneCards(
        [...cardsDone, card].sort(
          sortDoneByDeadline ? deadlineSortDone : tagSortDone
        )
      );
    }
    if (
      source.droppableId === "card-list-doing" &&
      destination.droppableId === "card-list-todo"
    ) {
      const newCardsArray = [...cardsDoing];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      changeDoingCards(newCardsArray);
      changeTodoCards(
        [...cardsToDo, card].sort(sortTodoByDeadline ? deadlineSort : tagSort)
      );
    }
    if (
      source.droppableId === "card-list-doing" &&
      destination.droppableId === "card-list-done"
    ) {
      const newCardsArray = [...cardsDoing];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      doneStatus = card.timeLeftGroup;
      changeDoingCards(newCardsArray);
      changeDoneCards(
        [...cardsDone, card].sort(
          sortDoneByDeadline ? deadlineSortDone : tagSortDone
        )
      );
    }
    if (
      source.droppableId === "card-list-done" &&
      destination.droppableId === "card-list-todo"
    ) {
      const newCardsArray = [...cardsDone];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      changeDoneCards(newCardsArray);
      changeTodoCards(
        [...cardsToDo, card].sort(sortTodoByDeadline ? deadlineSort : tagSort)
      );
    }
    if (
      source.droppableId === "card-list-done" &&
      destination.droppableId === "card-list-doing"
    ) {
      const newCardsArray = [...cardsDone];
      const index = newCardsArray.findIndex((card) => card.id === draggableId);
      const [card] = newCardsArray.splice(index, 1);
      changeDoneCards(newCardsArray);
      changeDoingCards(
        [...cardsDoing, card].sort(sortDoingByDeadline ? deadlineSort : tagSort)
      );
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
