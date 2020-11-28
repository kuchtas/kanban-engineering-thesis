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
import React, { useState } from "react";
import "./AddMemberDialog.css";
const AddMemberDialog = ({
  openAddMemberDialog,
  closeMemberAdditionDialog,
  addMember,
}) => {
    const [emailAddress, setEmailAddress] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    const checkEmailValid = (email) =>{
        setEmailAddress(email);
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setValidEmail(re.test(email));
    }

  return (
    <Dialog
      className="add-member-dialog"
      open={openAddMemberDialog}
      onClose={closeMemberAdditionDialog}
      onEnter={() => setEmailAddress("")}
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
          type="e-mail"
          variant="outlined"
          fullWidth
          onChange={(e) => checkEmailValid((e.target.value.trim()))}
          onKeyPress={(e) => {
              if (e.key === "Enter" && validEmail) {
                addMember(emailAddress);
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
          onClick={() => addMember(emailAddress)}
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
