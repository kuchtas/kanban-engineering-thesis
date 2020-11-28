import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  Typography,
  MuiThemeProvider,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import React from "react";
import "./AddMemberDialog.css";
const AddMemberDialog = ({
  openAddMemberDialog,
  closeMemberAdditionDialog,
  addMember,
}) => {
  return (
    <Dialog
      className="add-member-dialog"
      open={openAddMemberDialog}
      onClose={closeMemberAdditionDialog}
      fullWidth
    >
      <DialogTitle className="add-member-dialog-title">
        You can add a new board member here
        <Divider />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={"span"}>
            Type in the user's e-mail address
          </Typography>
        </DialogContentText>
        {/* <MuiThemeProvider theme={deleteTextFieldTheme}> */}
        <TextField
          className="add-member-dialog-textfield"
          autoFocus
          margin="normal"
          type="text"
          variant="outlined"
          fullWidth
          //   onChange={(e) => setConfirmDeletion(e.target.value.trim())}
          //   onKeyPress={(e) => {
          //     if (e.key === "Enter" && confirmDeletion === "delete") {
          //       deleteBoard();
          //     }
          //   }}
        />
        {/* </MuiThemeProvider> */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeMemberAdditionDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        {/* <MuiThemeProvider theme={deleteButtonTheme}> */}
        <Button
          onClick={addMember}
          color="primary"
          variant="outlined"
          // disabled={confirmDeletion !== "delete"}
          className="add-member-dialog-add-button"
        >
          Add
        </Button>
        {/* </MuiThemeProvider> */}
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;
