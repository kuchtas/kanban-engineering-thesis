import React, { useState,useEffect } from "react";
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
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup
} from "@material-ui/core";
// CSS
import "./UserCardDialog.css";
import { cardTitleEditTheme } from "../themes/cardTitleEditTheme";
import DescriptionIcon from '@material-ui/icons/Description';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

const UserCardDialog = ({ showUserCardDialog, closeUserCardDialog, card }) => {
  const [title, setTitle] = useState("");

  const handleEnter = () =>{
    setTitle(card.title);
  }

  const handleClose = () =>{
    setTitle("");
    closeUserCardDialog();
  }

  return (
    <Dialog
      className="user-card-dialog"
      open={showUserCardDialog}
      onClose={handleClose}
      onEnter={handleEnter}
      fullWidth
    >
      <MuiThemeProvider theme={cardTitleEditTheme}>
        <DialogTitle className="user-card-dialog-title-container">
          <TextField 
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            variant="outlined"
            className="user-card-dialog-title">
          </TextField>
          <Typography component={"span"} className="user-card-dialog-status">
            {card.status}
          </Typography>
          <Divider />
        </DialogTitle>
      </MuiThemeProvider>
      <DialogContent>
        <DialogContentText>
          <Grid justify="center" container spacing={1}>
            <Grid item>
                <Typography component={"span"}>
                  {card.startDate}
                </Typography>
            </Grid>
            <Grid item >
                <Typography component={"span"}>
                -
              </Typography>
            </Grid>
            <Grid item >
                <Typography component={"span"}>
                {card.endDate}
              </Typography>
            </Grid>
          </Grid>
        </DialogContentText>
        <Typography className="user-card-description-label" component={'span'}><DescriptionIcon />Description </Typography>
        <TextField
          className="user-card-description-dialog-textfield"
          margin="normal"
          type="text"
          variant="outlined"
          multiline={true}
          rows="5"
          // onChange={(e) => setTitle(e.target.value)}
          fullWidth
          value="Sample card description"
        />
         <Typography className="user-card-points-label" component={'span'}><FormatListBulletedIcon />Points </Typography>
         <FormGroup>
         <FormControlLabel
          control={
            <Checkbox
              name="checkedB"
              color="primary"
            />
          }
          label="Point 1"
        />
         <FormControlLabel
          control={
            <Checkbox
              name="checkedB"
              color="primary"
            />
          }
          label="Point 2"
        />
         <FormControlLabel
          control={
            <Checkbox
              name="checkedB"
              color="primary"
            />
          }
          label="Point 3"
        />
         </FormGroup>
      </DialogContent>
      <DialogActions>
        {/* <Button
          onClick={handleClose}
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
