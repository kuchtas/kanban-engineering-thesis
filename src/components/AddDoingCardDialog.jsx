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
} from "@material-ui/core";
import { useState } from "react";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./AddDoingCardDialog.css";

const AddDoingCardDialog = ({
  openAddDoingCardDialog,
  closeAddDoingCardDialog,
}) => {
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useSelector((state) => state.board);

  const createDoingCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: title,
        status: "DOING",
        startDate: startDate,
        endDate: endDate,
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    // store.dispatch({ type: "cards/doingadded", payload: newCard });
    closeAddDoingCardDialog();
  };

  return (
    <Dialog
      className="add-doing-card-dialog"
      open={openAddDoingCardDialog}
      onClose={closeAddDoingCardDialog}
    >
      <DialogTitle className="add-doing-card-dialog-title">
        Creating a new Doing card
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            To create a new card you need to pass in it's title and deadlines
          </Typography>
        </DialogContentText>
        <TextField
          className="add-doing-card-dialog-textfield"
          autoFocus
          margin="normal"
          type="text"
          variant="outlined"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          className="add-doing-card-dialog-textfield-startdate"
          margin="normal"
          type="date"
          variant="outlined"
          label="Begin date"
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <TextField
          className="add-doing-card-dialog-textfield-enddate"
          margin="normal"
          type="date"
          variant="outlined"
          label="End date"
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeAddDoingCardDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={createDoingCard}
          color="primary"
          variant="outlined"
          disabled={
            title === null ||
            startDate === null ||
            endDate === null ||
            title === ""
          }
          className="add-doing-card-dialog-add-button"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDoingCardDialog;
