import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  FormHelperText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";

const AddBoardDialog = ({
  openCreateBoardDialog,
  closeBoardCreationDialog,
  newBoardTitle,
  createBoardBoardList,
  changeBoardTitle,
  user,
}) => {
  return (
    <Dialog
      className="create-board-dialog"
      open={openCreateBoardDialog}
      onClose={closeBoardCreationDialog}
      fullWidth
    >
      <DialogTitle className="create-board-dialog-title">
        Name your new board
        <Divider />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This name will be visible for all of its users.
        </DialogContentText>
        <FormHelperText
          style={{ color: "red" }}
          hidden={newBoardTitle?.length < 120}
        >
          Title can not be empty or longer than 120 characters
        </FormHelperText>
        <TextField
          className="create-board-dialog-textfield"
          autoFocus
          margin="normal"
          label="Name"
          type="text"
          variant="outlined"
          fullWidth
          onChange={(e) => changeBoardTitle(e)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              createBoardBoardList(newBoardTitle, user.name);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeBoardCreationDialog}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => createBoardBoardList(newBoardTitle, user.name)}
          color="primary"
          variant="outlined"
          disabled={
            newBoardTitle === "" ||
            newBoardTitle === null ||
            newBoardTitle.length > 120
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBoardDialog;
