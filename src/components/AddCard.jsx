import React from "react";
// Components
import { Card } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
// CSS
import "../styles/AddCard.css";

const AddCard = ({ createCard }) => {
  return (
    <>
      <Card
        variant="outlined"
        className="card-list-element-add-card"
        onClick={createCard}
      >
        <AddIcon fontSize="default" />
      </Card>
    </>
  );
};

export default AddCard;
