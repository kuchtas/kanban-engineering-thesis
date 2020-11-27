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
import store from '../store';
// CSS
import "./UserCardDialog.css";
import { cardTitleEditTheme } from "../themes/cardTitleEditTheme";
import {deleteButtonTheme} from "../themes/deleteButtonTheme";
import DescriptionIcon from '@material-ui/icons/Description';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { useSelector } from "react-redux";

const UserCardDialog = ({ showUserCardDialog, closeUserCardDialog, card }) => {
  const { id } = useSelector((state) => state.board);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [users, setUsers] = useState([]);

  const handleEnter = () => {
    console.log(card);
    setTitle(card.title);
    setDescription(card.description);
    setStartDate(card.startDate);
    setEndDate(card.endDate);
    setStatus(card.status);
    setTag(card.tag);
    setUsers(card.users);
  };

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
    console.log("clicked away from description");
    const newDescription = description.trim();

    if (newDescription !== card.description) {
      console.log("UPDATING DESCRIPTION");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", card.id));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.description = newDescription;
        })
      );
    } else {
      setDescription(description);
    }
  };

  const titleClickAway = async () => {
    console.log("clicked away from title");
    const newTitle = title.trim();

    if (newTitle !== card.title && newTitle !== null && newTitle !== "") {
      console.log("UPDATING TITLE");
      const cardQuery = await DataStore.query(Card, (c) => c.id("eq", card.id));

      await DataStore.save(
        Card.copyOf(cardQuery[0], (updated) => {
          updated.title = newTitle;
        })
      );
    } else {
      setTitle(title);
    }
  };

  const deleteCard = async () => {
    const cardQuery = await DataStore.query(Card, (c) => c.id("eq", card.id));
    console.log(card.id);
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        const index = updated.cards.indexOf(card.id);
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
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              variant="outlined"
              className="user-card-dialog-title"
            ></TextField>
          </ClickAwayListener>
          <Typography component={"span"} className="user-card-dialog-status">
            {card.status}
          </Typography>
          <Divider />
        </DialogTitle>
      </MuiThemeProvider>
      <DialogContent>
        <DialogContentText>
          <Grid justify="center" container spacing={1}>
            <Grid item>
              <Typography component={"span"}>{card.startDate}</Typography>
            </Grid>
            <Grid item>
              <Typography component={"span"}>-</Typography>
            </Grid>
            <Grid item>
              <Typography component={"span"}>{card.endDate}</Typography>
            </Grid>
          </Grid>
        </DialogContentText>
        <Typography className="user-card-description-label" component={"span"}>
          <DescriptionIcon />
          Description
        </Typography>
        <ClickAwayListener onClickAway={descriptionClickAway}>
          <TextField
            className="user-card-description-dialog-textfield"
            margin="normal"
            type="text"
            variant="outlined"
            multiline={true}
            rows="5"
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            value={description}
          />
        </ClickAwayListener>
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
