import { Card, Grid, Typography } from "@material-ui/core";
import "../styles/BoardListElement.css";

const BoardListElement = ({ board, openBoard }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={6}
      lg={4}
      xl={4}
      className="board-list-element"
      key={board.id}
    >
      <Card
        variant="outlined"
        className="board-list-card radial-out"
        onClick={() => openBoard(board)}
      >
        <Typography>{board.title}</Typography>
      </Card>
    </Grid>
  );
};

export default BoardListElement;
