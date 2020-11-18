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
// CSS
import { deleteButtonTheme } from "../themes/deleteButtonTheme";
import { deleteTextFieldTheme } from "../themes/deleteTextFieldTheme";
import "./DeleteBoardDialog.css";
const DeleteBoardDialog = ({
  openDeleteBoardDialog,
  closeBoardDeletionDialog,
  deleteBoard,
}) => {
  const [confirmDeletion, setConfirmDeletion] = useState(null);
  return (
    <Dialog
      className="delete-board-dialog"
      open={openDeleteBoardDialog}
      onClose={closeBoardDeletionDialog}
    >
      <DialogTitle className="delete-board-dialog-title">
        Do you want to delete this board with all its contents?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            This action cannot be undone! Type
            <span style={{ fontWeight: "bold" }}> delete</span> to confirm.
          </Typography>
        </DialogContentText>
        <MuiThemeProvider theme={deleteTextFieldTheme}>
          <TextField
            className="delete-board-dialog-textfield"
            autoFocus
            margin="normal"
            type="text"
            variant="outlined"
            fullWidth
            onChange={(e) => setConfirmDeletion(e.target.value.trim())}
            onKeyPress={(e) => {
              if (e.key === "Enter" && confirmDeletion === "delete") {
                deleteBoard();
              }
            }}
          />
        </MuiThemeProvider>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeBoardDeletionDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <MuiThemeProvider theme={deleteButtonTheme}>
          <Button
            onClick={deleteBoard}
            color="primary"
            variant="outlined"
            disabled={confirmDeletion !== "delete"}
            className="delete-board-dialog-delete-button"
          >
            Delete
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBoardDialog;
