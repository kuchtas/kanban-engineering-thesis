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
  FormHelperText,
  Divider,
} from "@material-ui/core";
import { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// CSS
import "./AddTodoCardDialog.css";

const AddTodoCardDialog = ({
  openAddTodoCardDialog,
  closeAddTodoCardDialog,
}) => {
  const [title, setTitle] = useState("");
  const [titleTooLong, setTitleTooLong] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useSelector((state) => state.board);

  const createToDoCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: title,
        status: "TODO",
        description: "",
        tag: "",
        users: [],
        startDate: startDate,
        endDate: endDate,
        points: [],
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    // store.dispatch({ type: "cards/todoadded", payload: newCard });
    setTitle("");
    setStartDate(null);
    setEndDate(null);
    setTitleTooLong(false);
    closeAddTodoCardDialog();
  };

  useEffect(() => {
    title.length > 120 ? setTitleTooLong(true) : setTitleTooLong(false);
  }, [title]);

  return (
    <Dialog
      className="add-todo-card-dialog"
      open={openAddTodoCardDialog}
      onClose={closeAddTodoCardDialog}
      fullWidth
    >
      <DialogTitle className="add-todo-card-dialog-title">
        Creating a new To Do card
        <Divider />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            To create a new card you need to pass in it's title and deadlines
          </Typography>
        </DialogContentText>
        <TextField
          className="add-todo-card-dialog-textfield"
          autoFocus
          margin="normal"
          type="text"
          variant="outlined"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <FormHelperText style={{ color: "red" }} hidden={!titleTooLong}>
          Title can not be longer than 120 characters
        </FormHelperText>
        <TextField
          className="add-todo-card-dialog-textfield-startdate"
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
          className="add-todo-card-dialog-textfield-enddate"
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
          onClick={closeAddTodoCardDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={createToDoCard}
          color="primary"
          variant="outlined"
          disabled={
            title === null ||
            startDate === null ||
            endDate === null ||
            title === "" ||
            titleTooLong
          }
          className="add-todo-card-dialog-add-button"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTodoCardDialog;
