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
  return (
    <Draggable draggableId={id} index={index}>
      {provided =>(

        <Card
          variant="outlined"
          className="card-list-element"
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
