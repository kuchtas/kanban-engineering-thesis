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
  FormHelperText,
} from "@material-ui/core";
import React, { useState } from "react";
// CSS
import "../styles/AddMemberDialog.css";
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
  const [correctUser, setCorrectUser] = useState(true);

  const checkEmailValid = (email) => {
    setEmailAddress(email); // eslint-disable-next-line no-useless-escape
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
        <DialogContentText style={{ marginBottom: "0px", marginTop: "15px" }}>
          <Typography component={"span"}>
            Type in new user's e-mail address
          </Typography>
        </DialogContentText>
        <TextField
          className="add-member-dialog-textfield"
          autoFocus
          margin="normal"
          type="e-mail"
          variant="outlined"
          fullWidth
          onChange={(e) => checkEmailValid(e.target.value.trim())}
          onKeyPress={async (e) => {
            if (e.key === "Enter" && validEmail) {
              setCorrectUser(await addMember(boardID, emailAddress));
              setEmailAddress("");
            }
          }}
          value={emailAddress}
        />
        <FormHelperText error={true} hidden={correctUser}>
          This user either does not exist or is already a member of the board
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeMemberAdditionDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setCorrectUser(await addMember(boardID, emailAddress));
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
