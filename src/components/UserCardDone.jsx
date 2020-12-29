import React from "react";
import { Card, CardContent, Typography, Chip, Grid } from "@material-ui/core";
import "../styles/UserCardDone.css";
import { Draggable } from "react-beautiful-dnd";

const UserCardDone = ({
  id,
  title,
  startDate,
  endDate,
  openCard,
  tag,
  timeLeftGroup,
  index,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Card
          variant="outlined"
          className={"done-" + timeLeftGroup + " card-list-element"}
          key={id}
          onClick={() => openCard(id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <CardContent className="card-list-element-content">
            <Grid container >
              <Grid item xs={12} className="card-list-element-content-tag-container">
                {tag ? (
                  <Typography className="card-list-element-content-tag">
                    {tag}
                  </Typography>
                ) : null}
              </Grid>
              <Grid container alignItems="center">
                <Grid item  className="card-list-element-content-title-container">
                  <Typography className="card-list-element-content-title">
                    {title}
                  </Typography>
                </Grid>
                <Grid item >
                  <span className="card-dates-container">
                    <div className="start-date-chip-container">
                      <Chip
                        label={startDate}
                        variant="outlined"
                        className="start-date-chip"
                        color="primary"
                      />
                    </div>
                    <div className="end-date-chip-container">
                      <Chip
                        label={endDate}
                        variant="outlined"
                        className="end-date-chip"
                        color="primary"
                      />
                    </div>
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default UserCardDone;
