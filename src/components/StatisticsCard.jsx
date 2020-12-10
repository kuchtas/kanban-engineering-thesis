import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import "./StatisticsCard.css";
const StatisticsCard = ({ cardNumber, totalCards, term }) => {
  return (
    <Card
      variant="outlined"
      className={term + " card-list-element statistics-card-list-element"}
      //   key={id}
    >
      <CardContent className="statistics-card-list-element-content">
        <Grid container alignItems="center">
          <Grid
            item
            className="statistics-card-list-element-content-cardnumber-container"
            xs={7}
          >
            <Typography className="statistics-card-list-element-content-cardnumber">
              Cards of this type: {cardNumber}
            </Typography>
          </Grid>
          <Grid
            item
            className="statistics-card-list-element-content-cardpercent-container"
            xs={5}
          >
            <Typography className="statistics-card-list-element-content-cardpercent">
              Total: {`${(cardNumber / totalCards).toFixed(2) * 100}%`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
