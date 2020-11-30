import React from "react";
import { Card, CardContent, Typography, Chip } from "@material-ui/core";
import "./UserCard.css";


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
}) => {
  return (
    <Card
      variant="outlined"
      className="card-list-element"
      key={id}
      onClick={() => openCard(id)}
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
  );
};

export default UserCard;
