import React, { useState, useEffect } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MuiThemeProvider,
  // Divider,
  Grid,
  // FormControlLabel,
  // Checkbox,
  // FormGroup,
  ClickAwayListener,
  Card as MaterialUICard,
} from "@material-ui/core";
// GraphQL
import { User, Card, Board } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
// CSS
import "./UserCardDialog.css";
import { cardTitleEditTheme } from "../themes/cardTitleEditTheme";
import { deleteButtonTheme } from "../themes/deleteButtonTheme";
import { cardDescriptionEditTheme } from "../themes/cardDescriptionEditTheme";
import DescriptionIcon from "@material-ui/icons/Description";
// import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import LabelIcon from "@material-ui/icons/Label";
import GroupIcon from "@material-ui/icons/Group";
import AddUserToCard from "./AddUserToCard";
import { deleteUserFromCardTheme } from "../themes/deleteUserFromCardTheme";
// import CardPoints from "./CardPoints";
import { userCardDatesTheme } from "../themes/userCardDatesTheme";
// utils
import { setClassByDeadlineCloseness } from "../utils/deadline";
const UserCardDialog = ({ showUserCardDialog, closeUserCardDialog }) => {
  const {
    id: cardID,
    title: cardTitle,
    startDate: cardStartDate,
    endDate: cardEndDate,
    status: cardStatus,
    description: cardDescription,
    tag: cardTag,
    users: cardUsers,
    points: cardPoints,
  } = useSelector((state) => state.chosenCard);
  const { id: boardID } = useSelector((state) => state.board);

  const [title, setTitle] = useState(cardTitle);
  const [description, setDescription] = useState(cardDescription);
  const [startDate, setStartDate] = useState(cardStartDate);
  const [endDate, setEndDate] = useState(cardEndDate);
  // const [status, setStatus] = useState(cardStatus);
  const [tag, setTag] = useState(cardTag);
  const [users, setUsers] = useState(cardUsers);
  // const [points, setPoints] = useState(cardPoints);
  const [titleChanged, setTitleChanged] = useState(false);
  const [tagChanged, setTagChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [startDateChanged, setStartDateChanged] = useState(false);
  const [endDateChanged, setEndDateChanged] = useState(false);

  useEffect(() => {
    setTitle(cardTitle);
    setDescription(cardDescription);
    setStartDate(cardStartDate);
    setEndDate(cardEndDate);
    // setStatus(cardStatus);
    setTag(cardTag);
    setUsers(cardUsers);
    // setPoints(cardPoints);
  }, [
    cardID,
    cardTitle,
    cardStartDate,
    cardEndDate,
    cardStatus,
    cardDescription,
    cardTag,
    cardUsers,
    cardPoints,
  ]);

  const handleClose = () => {
    closeUserCardDialog();
  };

  const descriptionClickAway = async () => {
    const newDescription = description.trim();

    if (newDescription !== cardDescription && descriptionChanged) {
      console.log("UPDATING DESCRIPTION");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.description = newDescription;
        })
      );
      setDescription(newDescription);
      setDescriptionChanged(false);
    } else {
      setDescription(cardDescription);
    }
  };

  const titleClickAway = async () => {
    const newTitle = title.trim();

    if (
      newTitle !== cardTitle &&
      newTitle !== null &&
      newTitle !== "" &&
      titleChanged &&
      newTitle.length < 120
    ) {
      console.log("UPDATING TITLE");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.title = newTitle;
        })
      );
      setTitle(newTitle);
      setTitleChanged(false);
    } else {
      setTitle(cardTitle);
    }
  };

  const tagClickAway = async () => {
    const newTag = tag.trim();

    if (newTag !== cardTag && tagChanged && tag.length <= 30) {
      console.log("UPDATING TAG");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.tag = newTag;
        })
      );
      setTag(newTag);
      setTagChanged(false);
    } else {
      setTag(cardTag);
    }
  };

  const startDateClickAway = async () => {
    const newStartDate = startDate;

    if (
      newStartDate !== cardStartDate &&
      startDateChanged &&
      endDate > startDate
    ) {
      console.log("UPDATING START DATE");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.startDate = newStartDate;
        })
      );
      setStartDate(newStartDate);
      setStartDateChanged(false);
    } else {
      setStartDate(cardStartDate);
    }
  };

  const endDateClickAway = async () => {
    const newEndDate = endDate;

    if (newEndDate !== cardEndDate && endDateChanged && endDate > startDate) {
      console.log("UPDATING END DATE");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.endDate = newEndDate;
        })
      );
      setEndDate(newEndDate);
      setEndDateChanged(false);
    } else {
      setEndDate(cardEndDate);
    }
  };

  const deleteCard = async () => {
    const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", boardID));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        const index = updated.cards.indexOf(cardID);
        updated.cards.splice(index, 1);
      })
    );

    DataStore.delete(cardQuery[0]);
    handleClose();
  };

  const addUser = async (user) => {
    const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

    const userQuery = await DataStore.query(User, (u) => u.name("eq", user));

    await DataStore.save(
      Card.copyOf(cardQuery[0], (updated) => {
        updated.users = [...updated.users, user];
      })
    );

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        updated.cards = [...updated.cards, cardID];
      })
    );
  };

  const deleteUser = async (user) => {
    const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cardID));

    const userQuery = await DataStore.query(User, (u) => u.name("eq", user));

    await DataStore.save(
      Card.copyOf(cardQuery[0], (updated) => {
        const index = updated.users.indexOf(user);
        updated.users.splice(index, 1);
      })
    );

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        const index = updated.cards.indexOf(cardID);
        updated.cards.splice(index, 1);
      })
    );
  };

  return (
    <Dialog
      className="user-card-dialog"
      open={showUserCardDialog}
      onClose={handleClose}
      fullWidth
    >
      <MuiThemeProvider theme={cardTitleEditTheme}>
        <DialogTitle className="user-card-dialog-title-container">
          <ClickAwayListener onClickAway={titleClickAway}>
            <TextField
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleChanged(true);
              }}
              value={title}
              variant="outlined"
              className="user-card-dialog-title"
              placeholder="Set a title..."
              error={title.length > 120}
            ></TextField>
          </ClickAwayListener>
          <LabelIcon />
          <ClickAwayListener onClickAway={tagClickAway}>
            <TextField
              className="user-card-tag-dialog-textfield"
              margin="normal"
              type="text"
              variant="outlined"
              onChange={(e) => {
                setTag(e.target.value);
                setTagChanged(true);
              }}
              error={tag.length > 30}
              value={tag}
              placeholder="Set a tag..."
            />
          </ClickAwayListener>
          <Typography component={"span"} className="user-card-dialog-status">
            {cardStatus}
          </Typography>
          {/* <Divider /> */}
        </DialogTitle>
      </MuiThemeProvider>
      <DialogContent
        className={
          "user-card-dialog-content-" +
          setClassByDeadlineCloseness(startDate, endDate)
        }
      >
        <MuiThemeProvider theme={userCardDatesTheme}>
          <DialogContentText>
            <Grid justify="center" container spacing={1}>
              <Grid item>
                <ClickAwayListener onClickAway={startDateClickAway}>
                  <TextField
                    className="user-card-dialog-textfield-startdate"
                    margin="normal"
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setStartDateChanged(true);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={startDate}
                  />
                </ClickAwayListener>
              </Grid>
              <Grid item>
                <ClickAwayListener onClickAway={endDateClickAway}>
                  <TextField
                    className="user-card-dialog-textfield-enddate"
                    margin="normal"
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setEndDateChanged(true);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={endDate}
                  />
                </ClickAwayListener>
              </Grid>
            </Grid>
          </DialogContentText>
        </MuiThemeProvider>
        <Typography className="user-card-description-label" component={"span"}>
          <DescriptionIcon />
          Description
        </Typography>
        <MuiThemeProvider theme={cardDescriptionEditTheme}>
          <ClickAwayListener onClickAway={descriptionClickAway}>
            <TextField
              className="user-card-description-dialog-textfield"
              margin="normal"
              type="text"
              variant="outlined"
              multiline={true}
              rows="5"
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionChanged(true);
              }}
              fullWidth
              value={description}
              placeholder="Set a description..."
            />
          </ClickAwayListener>
        </MuiThemeProvider>
        {/* <Typography className="user-card-points-label" component={"span"}>
          <FormatListBulletedIcon />
          Points
        </Typography>
        <CardPoints /> */}
        <Typography className="user-card-users-label" component={"span"}>
          <GroupIcon />
          Assigned members
        </Typography>
        <Grid container className="card-dialog-users-container">
          {users.map((user) => {
            return (
              <MaterialUICard
                variant="outlined"
                className="card-dialog-user"
                key={user}
              >
                {user}
                <MuiThemeProvider theme={deleteUserFromCardTheme}>
                  <Button
                    className="delete-user-from-card-button"
                    onClick={() => deleteUser(user)}
                  >
                    X
                  </Button>
                </MuiThemeProvider>
              </MaterialUICard>
            );
          })}
        </Grid>
        <AddUserToCard addUser={addUser} cardUsers={users} />
      </DialogContent>
      <DialogActions>
        <MuiThemeProvider theme={deleteButtonTheme}>
          <Button
            onClick={deleteCard}
            color="primary"
            variant="outlined"
            className="delete-card-dialog-delete-button"
          >
            Delete card
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
};

export default UserCardDialog;
