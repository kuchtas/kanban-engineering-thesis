import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
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
import "../styles/AddDoingCardDialog.css";

const AddDoingCardDialog = ({
  openAddDoingCardDialog,
  closeAddDoingCardDialog,
}) => {
  const [title, setTitle] = useState("");
  const [titleTooLong, setTitleTooLong] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useSelector((state) => state.board);

  const createDoingCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: id,
        title: title,
        status: "DOING",
        description: "",
        tag: "",
        users: [],
        startDate: startDate,
        endDate: endDate,
        points: [""],
      })
    );
    const boardQuery = await DataStore.query(Board, (b) => b.id("eq", id));

    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.cards = [...updated.cards, newCard.id];
      })
    );
    setTitle("");
    setStartDate(null);
    setEndDate(null);
    setTitleTooLong(false);
    closeAddDoingCardDialog();
  };

  const clearInputs = () => {
    setTitle("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    title.length > 120 ? setTitleTooLong(true) : setTitleTooLong(false);
  }, [title]);

  return (
    <Dialog
      className="add-doing-card-dialog"
      open={openAddDoingCardDialog}
      onClose={closeAddDoingCardDialog}
      onEnter={clearInputs}
      fullWidth
    >
      <DialogTitle className="add-doing-card-dialog-title">
        Creating a new Doing card
        <Divider />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={"span"}>
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
          error={titleTooLong}
        />
        <FormHelperText style={{ color: "red" }} hidden={!titleTooLong}>
          Title can not be longer than 120 characters
        </FormHelperText>
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
          error={startDate > endDate}
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
          error={startDate > endDate}
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
            title === "" ||
            titleTooLong ||
            startDate > endDate
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
