import React, { useState } from "react";
import {
  Grid,
  Card as MaterialUICard,
  Typography,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import UserCardDone from "../components/UserCardDone";
import AddCard from "../components/AddCard";
// CSS
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./DoneList.css";

const DoneList = ({
  cardsDone,
  openAddDoneCardDialog,
  openUserCardDialog,
  changeSortDoneMethodDeadline,
  changeSortDoneMethodTag,
}) => {
  const [sortMenuAnchorElement, setSortMenuAnchorElement] = useState(null);

  const handleDoneSortMenuOpen = (event) => {
    setSortMenuAnchorElement(event.currentTarget);
  };
  const handleDoneSortMenuClose = () => {
    setSortMenuAnchorElement(null);
  };
  return (
    <Grid
      item
      xs={4}
      sm={4}
      md={4}
      lg={4}
      xl={4}
      className="card-list-done enter-done"
    >
      <MaterialUICard
        variant="outlined"
        className="card-list-header"
        key="done-header"
      >
        <Typography className="card-list-header-title">DONE</Typography>
        <MoreVertIcon
          style={{ verticalAlign: "middle", float: "right" }}
          onClick={handleDoneSortMenuOpen}
        />
        <Menu
          anchorEl={sortMenuAnchorElement}
          open={Boolean(sortMenuAnchorElement)}
          onClose={handleDoneSortMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleDoneSortMenuClose();
              changeSortDoneMethodDeadline();
            }}
          >
            Sort by deadlines
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDoneSortMenuClose();
              changeSortDoneMethodTag();
            }}
          >
            Sort by tags
          </MenuItem>
        </Menu>
      </MaterialUICard>
      <Droppable droppableId="card-list-done">
        {(provided) => (
          <Grid
            item
            className="card-list"
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardsDone.map((card, index) => {
              return (
                <UserCardDone
                  id={card.id}
                  title={card.title}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  timeLeftGroup={card.points[0]}
                  openCard={openUserCardDialog}
                  key={card.id}
                  tag={card.tag}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <AddCard createCard={openAddDoneCardDialog} />
          </Grid>
        )}
      </Droppable>
    </Grid>
  );
};

export default DoneList;
