import {
  Grid,
  MenuItem,
  MuiThemeProvider,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setClassByDeadlineCloseness } from "../utils/deadline";

import "./UserStatisticsContainer.css";
import CardTypesStatistics from "./CardTypesStatistics";
import { tagUserStatisticsSelectTheme } from "../themes/tagUserStatisticsSelectTheme";
const UserStatisticsContainer = ({ currentUser, users }) => {
  const { cards } = useSelector((state) => state.cards);
  const [usersTasks, setUsersTasks] = useState([]);
  const [missedTasks, setMissedTasks] = useState([]);
  const [cardsToDo, setCardsToDo] = useState([]);
  const [cardsDoing, setCardsDoing] = useState([]);
  const [cardsDone, setCardsDone] = useState([]);
  const [chosenUser, setChosenUser] = useState(currentUser);

  useEffect(() => {
    const newUsersTasks = cards.filter((card) =>
      card.users.includes(chosenUser)
    );
    setUsersTasks(newUsersTasks);
    const newToDoCards = cards
      .filter(
        (card) => card.status === "TODO" && card.users.includes(chosenUser)
      )
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
      .filter(
        (card) => card.status === "DOING" && card.users.includes(chosenUser)
      )
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
      .filter(
        (card) => card.status === "DONE" && card.users.includes(chosenUser)
      )
      .map((a) => ({ ...a }));
    setCardsDone(newDoneCards);
  }, [cards, chosenUser]);

  useEffect(() => {
    const missedCards = [
      ...cardsToDo.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDoing.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDone.filter((card) => card.points[0] === "deadline-term-5"),
    ];
    setMissedTasks(missedCards);
  }, [cardsToDo, cardsDoing, cardsDone]);

  return (
    <Grid container xs={12} color="black" className="statistics-user-container">
      <Grid container xs={12} className="statistics-user-total-container">
        <Grid item xs={6} className="statistics-user-total-cards">
          <Typography>
            Total number of{" "}
            <MuiThemeProvider theme={tagUserStatisticsSelectTheme}>
              <Select
                value={chosenUser}
                onChange={(e) => setChosenUser(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem value={user} key={user}>
                    {user}
                  </MenuItem>
                ))}
              </Select>{" "}
            </MuiThemeProvider>
            member tasks: {usersTasks.length}
          </Typography>
        </Grid>
        <Grid item xs={6} className="statistics-user-total-missed-cards">
          <Typography>
            Total number of missed tasks with this member assigned:{" "}
            {missedTasks.length}
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} className="statistics-user-lists-container">
        <Grid
          container
          xs={4}
          className="statistics-user-todo-container enter-user-statistics-todo"
        >
          <Grid item xs={12} className="statistics-user-list-title">
            TO DO - {cardsToDo.length}
          </Grid>
          <CardTypesStatistics cards={cardsToDo} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-user-doing-container enter-user-statistics-doing"
        >
          <Grid item xs={12} className="statistics-user-list-title">
            DOING - {cardsDoing.length}
          </Grid>
          <CardTypesStatistics cards={cardsDoing} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-user-done-container enter-user-statistics-done"
        >
          <Grid item xs={12} className="statistics-user-list-title">
            DONE - {cardsDone.length}
          </Grid>
          <CardTypesStatistics cards={cardsDone} done="true" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserStatisticsContainer;
