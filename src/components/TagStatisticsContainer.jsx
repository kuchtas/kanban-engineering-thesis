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

import "../styles/TagStatisticsContainer.css";
import CardTypesStatistics from "./CardTypesStatistics";
import { tagUserStatisticsSelectTheme } from "../themes/tagUserStatisticsSelectTheme";
const TagStatisticsContainer = () => {
  const { cards } = useSelector((state) => state.cards);
  const [usersTasks, setUsersTasks] = useState([]);
  const [missedTasks, setMissedTasks] = useState([]);
  const [cardsToDo, setCardsToDo] = useState([]);
  const [cardsDoing, setCardsDoing] = useState([]);
  const [cardsDone, setCardsDone] = useState([]);
  const [chosenTag, setChosenTag] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const newTagList = [...new Set(cards.map((card) => card.tag))].sort();
    setTags(newTagList);
  }, [cards]);

  useEffect(() => {
    const newUsersTasks = cards.filter((card) => card.tag === chosenTag);
    setUsersTasks(newUsersTasks);
    const newToDoCards = cards
      .filter((card) => card.status === "TODO" && card.tag === chosenTag)
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
      .filter((card) => card.status === "DOING" && card.tag === chosenTag)
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
      .filter((card) => card.status === "DONE" && card.tag === chosenTag)
      .map((a) => ({ ...a }));
    setCardsDone(newDoneCards);
  }, [cards, chosenTag]);

  useEffect(() => {
    const missedCards = [
      ...cardsToDo.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDoing.filter((card) => card.timeLeftGroup === "deadline-term-5"),
      ...cardsDone.filter((card) => card.points[0] === "deadline-term-5"),
    ];
    setMissedTasks(missedCards);
  }, [cardsToDo, cardsDoing, cardsDone]);

  return (
    <Grid container xs={12} color="black" className="statistics-tag-container">
      <Grid container xs={12} className="statistics-tag-total-container">
        <Grid item xs={6} className="statistics-tag-total-cards">
          <Typography>
            Total number of{" "}
            <MuiThemeProvider theme={tagUserStatisticsSelectTheme}>
              <Select
                value={chosenTag}
                onChange={(e) => setChosenTag(e.target.value)}
              >
                {tags.map((tag) => (
                  <MenuItem value={tag} key={tag}>
                    {tag.length === 0 ? "-" : tag}
                  </MenuItem>
                ))}
              </Select>{" "}
            </MuiThemeProvider>
            tag tasks: {usersTasks.length}
          </Typography>
        </Grid>
        <Grid item xs={6} className="statistics-tag-total-missed-cards">
          <Typography>
            Total number of missed tasks with this tag: {missedTasks.length}
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} className="statistics-tag-lists-container">
        <Grid
          container
          xs={4}
          className="statistics-tag-todo-container enter-tag-statistics-todo"
        >
          <Grid item xs={12} className="statistics-tag-list-title">
            TO DO - {cardsToDo.length}
          </Grid>
          <CardTypesStatistics cards={cardsToDo} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-tag-doing-container enter-tag-statistics-doing"
        >
          <Grid item xs={12} className="statistics-tag-list-title">
            DOING - {cardsDoing.length}
          </Grid>
          <CardTypesStatistics cards={cardsDoing} />
        </Grid>
        <Grid
          container
          xs={4}
          className="statistics-tag-done-container enter-tag-statistics-done"
        >
          <Grid item xs={12} className="statistics-tag-list-title">
            DONE - {cardsDone.length}
          </Grid>
          <CardTypesStatistics cards={cardsDone} done="true" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TagStatisticsContainer;
