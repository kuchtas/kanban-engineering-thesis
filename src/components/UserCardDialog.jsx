import React, { useState } from "react";
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
} from "@material-ui/core";
// CSS
import "./UserCardDialog.css";

const UserCardDialog = ({ showUserCardDialog, closeUserCardDialog, card }) => {
  return (
    <Dialog
      className="user-card-dialog"
      open={showUserCardDialog}
      onClose={closeUserCardDialog}
      fullWidth
    >
      <DialogTitle className="user-card-dialog-title">
        <Typography component={"span"}>
          {card.title} on list {card.status}
        </Typography>
        <Divider />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={"div"}>
            Start date: {card.startDate}
          </Typography>
          <Typography component={"div"}>End date: {card.endDate}</Typography>
        </DialogContentText>
        {/* <TextField
          className="add-todo-card-dialog-textfield"
          autoFocus
          margin="normal"
          type="text"
          variant="outlined"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        /> */}
      </DialogContent>
      <DialogActions>
        {/* <Button
          onClick={closeUserCardDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default UserCardDialog;
