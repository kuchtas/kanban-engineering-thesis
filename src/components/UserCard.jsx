import React from "react";
import { Card, CardContent, Typography, Chip } from "@material-ui/core";
import "./UserCard.css";
import { Draggable } from "react-beautiful-dnd";

const UserCard = ({
  id,
  title,
  startDate,
  endDate,
  openCard,
  status,
  description,
  tag,
  users,
  points,
  index
}) => {
  let deadlineCloseness = Math.round(
    ((new Date() - new Date(startDate).setHours(0, 0, 0, 0)) /
      (new Date(endDate).setHours(23, 59, 59, 59) -
        new Date(startDate).setHours(0, 0, 0, 0))) *
      100
  );
  if (deadlineCloseness === Infinity) deadlineCloseness = 1;
  console.log(title, deadlineCloseness);
  const setClassByDeadlineCloseness = () => {
    if (deadlineCloseness > 0 && deadlineCloseness <= 25)
      return "deadline-term-1";
    else if (deadlineCloseness > 25 && deadlineCloseness <= 50)
      return "deadline-term-2";
    else if (deadlineCloseness > 50 && deadlineCloseness <= 75)
      return "deadline-term-3";
    else if (deadlineCloseness > 75 && deadlineCloseness <= 100)
      return "deadline-term-4";
    else if (deadlineCloseness > 100) return "deadline-missed";
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Card
          variant="outlined"
          className={setClassByDeadlineCloseness() + " card-list-element"}
          key={id}
          onClick={() => openCard(id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <CardContent className="card-list-element-content">
            <Typography className="card-list-element-content-title">
              {title}
            </Typography>
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
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default UserCard;
