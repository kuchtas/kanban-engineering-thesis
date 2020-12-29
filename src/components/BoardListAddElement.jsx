import { Card, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import "../styles/BoardListAddElement.css";

const BoardListAddElement = ({ openBoardCreationDialog }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={6}
      lg={4}
      xl={4}
      className="board-list-element"
    >
      <Card
        variant="outlined"
        className="board-list-card-add radial-out"
        onClick={openBoardCreationDialog}
      >
        <AddIcon fontSize="large" />
      </Card>
    </Grid>
  );
};

export default BoardListAddElement;
