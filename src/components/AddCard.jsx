import React, { useState } from "react";
// Components
import { Card } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
// CSS
import "./AddCard.css";

const AddCard = ({ createCard }) => {
  return (
    <React.Fragment>
      <Card
        variant="outlined"
        className="card-list-element-add-card"
        onClick={createCard}
      >
        <AddIcon fontSize="default" />
      </Card>
    </React.Fragment>
  );
};

export default AddCard;
