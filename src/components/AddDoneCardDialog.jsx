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
import "./AddDoneCardDialog.css";

const AddDoneCardDialog = ({
  openAddDoneCardDialog,
  closeAddDoneCardDialog,
}) => {
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useSelector((state) => state.board);

  const createDoneCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: title,
        status: "DONE",
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
    store.dispatch({ type: "cards/doneadded", payload: newCard });
    closeAddDoneCardDialog();
  };

  return (
    <Dialog
      className="add-done-card-dialog"
      open={openAddDoneCardDialog}
      onClose={closeAddDoneCardDialog}
    >
      <DialogTitle className="add-done-card-dialog-title">
        Creating a new Done card
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            To create a new card you need to pass in it's title and deadlines
          </Typography>
        </DialogContentText>
        <TextField
          className="add-done-card-dialog-textfield"
          autoFocus
          margin="normal"
          type="text"
          variant="outlined"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          className="add-done-card-dialog-textfield-startdate"
          autoFocus
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
          className="add-done-card-dialog-textfield-enddate"
          autoFocus
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
          onClick={closeAddDoneCardDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={createDoneCard}
          color="primary"
          variant="outlined"
          disabled={
            title === null ||
            startDate === null ||
            endDate === null ||
            title === ""
          }
          className="add-done-card-dialog-add-button"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDoneCardDialog;
