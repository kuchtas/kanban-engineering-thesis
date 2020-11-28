import React, { useState,useEffect } from "react";
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
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup,
  ClickAwayListener
} from "@material-ui/core";
// GraphQL
import { Card, Board } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux 
import { useSelector } from "react-redux";
// CSS
import "./UserCardDialog.css";
import { cardTitleEditTheme } from "../themes/cardTitleEditTheme";
import {deleteButtonTheme} from "../themes/deleteButtonTheme";
import { cardDescriptionEditTheme } from "../themes/cardDescriptionEditTheme";
import DescriptionIcon from '@material-ui/icons/Description';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import LabelIcon from "@material-ui/icons/Label";

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
  } = useSelector((state) => state.chosenCard);
  const { id: boardID } = useSelector((state) => state.board);

  const [title, setTitle] = useState(cardTitle);
  const [description, setDescription] = useState(cardDescription);
  const [startDate, setStartDate] = useState(cardStartDate);
  const [endDate, setEndDate] = useState(cardEndDate);
  const [status, setStatus] = useState(cardStatus);
  const [tag, setTag] = useState(cardTag);
  const [users, setUsers] = useState(cardUsers);
  const [titleChanged, setTitleChanged] = useState(false);
  const [tagChanged, setTagChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);

  const handleEnter = () => {
    // setTitle(cardTitle);
    // setDescription(cardDescription);
    // setStartDate(cardStartDate);
    // setEndDate(cardEndDate);
    // setStatus(cardStatus);
    // setTag(cardTag);
    // setUsers(cardUsers);
  };

  useEffect(() => {
    setTitle(cardTitle);
    setDescription(cardDescription);
    setStartDate(cardStartDate);
    setEndDate(cardEndDate);
    setStatus(cardStatus);
    setTag(cardTag);
    setUsers(cardUsers);
  }, [
    cardID,
    cardTitle,
    cardStartDate,
    cardEndDate,
    cardStatus,
    cardDescription,
    cardTag,
    cardUsers,
  ]);

  const handleClose = () => {
    // setTitle("");
    // setDescription("");
    // setStartDate("");
    // setEndDate("");
    // setStatus("");
    // setTag("");
    // setUsers([]);
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
      setDescription(description);
    }
  };

  const titleClickAway = async () => {
    const newTitle = title.trim();

    if (
      newTitle !== cardTitle &&
      newTitle !== null &&
      newTitle !== "" &&
      titleChanged
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
      setTitle(title);
    }
  };

  const tagClickAway = async () => {
    const newTag = tag.trim();

    if (newTag !== cardTag && tagChanged) {
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
      setTag(tag);
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

  return (
    <Dialog
      className="user-card-dialog"
      open={showUserCardDialog}
      onClose={handleClose}
      onEnter={handleEnter}
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
              value={tag}
              placeholder="Set a tag..."
            />
          </ClickAwayListener>
          <Typography component={"span"} className="user-card-dialog-status">
            {cardStatus}
          </Typography>
          <Divider />
        </DialogTitle>
      </MuiThemeProvider>
      <DialogContent>
        <DialogContentText>
          <Grid justify="center" container spacing={1}>
            <Grid item>
              <Typography component={"span"}>{cardStartDate}</Typography>
            </Grid>
            <Grid item>
              <Typography component={"span"}>-</Typography>
            </Grid>
            <Grid item>
              <Typography component={"span"}>{cardEndDate}</Typography>
            </Grid>
          </Grid>
        </DialogContentText>
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
        <Typography className="user-card-points-label" component={"span"}>
          <FormatListBulletedIcon />
          Points
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Point 1"
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Point 2"
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Point 3"
          />
        </FormGroup>
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