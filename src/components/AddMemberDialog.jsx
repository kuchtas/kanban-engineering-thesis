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
  Grid,
  Card as MaterialUICard,
} from "@material-ui/core";
import React, { useState } from "react";
// CSS
import "./AddMemberDialog.css";
import { deleteUserFromCardTheme } from "../themes/deleteUserFromCardTheme";
import { placeholderDeleteUserFromCardTheme } from "../themes/placeholderDeleteUserFromCardTheme";

const AddMemberDialog = ({
  openAddMemberDialog,
  closeMemberAdditionDialog,
  addMember,
  deleteMember,
  users,
  currentUser,
  boardID,
}) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const checkEmailValid = (email) => {
    setEmailAddress(email);
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setValidEmail(re.test(email));
  };

  return (
    <Dialog
      className="add-member-dialog"
      open={openAddMemberDialog}
      onClose={closeMemberAdditionDialog}
      onEnter={() => setEmailAddress("")}
      fullWidth
    >
      <DialogTitle className="add-member-dialog-title">
        Board members
        <Divider />
      </DialogTitle>
      <DialogContent>
        <Grid container className="card-dialog-users-container">
          {users.map((user) => {
            return (
              <MaterialUICard
                variant="outlined"
                className="card-dialog-user"
                key={user}
              >
                <Typography className="card-dialog-user-title">
                  {user}
                </Typography>

                {user !== currentUser ? (
                  <MuiThemeProvider theme={deleteUserFromCardTheme}>
                    <Button
                      className="delete-user-from-card-button"
                      onClick={() => deleteMember(boardID, user)}
                    >
                      X
                    </Button>
                  </MuiThemeProvider>
                ) : (
                  <MuiThemeProvider theme={placeholderDeleteUserFromCardTheme}>
                    <Button className="placeholder-button">X</Button>
                  </MuiThemeProvider>
                )}
              </MaterialUICard>
            );
          })}
        </Grid>
        <DialogContentText>
          <Typography component={"span"}>
            Type in new user's e-mail address
          </Typography>
        </DialogContentText>
        {/* <MuiThemeProvider theme={deleteTextFieldTheme}> */}
        <TextField
          className="add-member-dialog-textfield"
          autoFocus
          margin="normal"
          type="e-mail"
          variant="outlined"
          fullWidth
          onChange={(e) => checkEmailValid(e.target.value.trim())}
          onKeyPress={(e) => {
            if (e.key === "Enter" && validEmail) {
              addMember(boardID, emailAddress);
              setEmailAddress("");
            }
          }}
          value={emailAddress}
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
          onClick={() => {
            addMember(boardID, emailAddress);
            setEmailAddress("");
          }}
          color="primary"
          variant="outlined"
          disabled={!validEmail}
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
