import React, { useState } from "react";
import {
  Grid,
  Card as MaterialUICard,
  Typography,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import UserCard from "../components/UserCard";
import AddCard from "../components/AddCard";
// CSS
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./DoingList.css";

const DoingList = ({
  cardsDoing,
  openAddDoingCardDialog,
  openUserCardDialog,
  changeSortDoingMethodDeadline,
  changeSortDoingMethodTag,
}) => {
  const [sortMenuAnchorElement, setSortMenuAnchorElement] = useState(null);

  const handleDoingSortMenuOpen = (event) => {
    setSortMenuAnchorElement(event.currentTarget);
  };
  const handleDoingSortMenuClose = () => {
    setSortMenuAnchorElement(null);
  };
  return (
    <Grid item xs={4} sm={4} md={4} lg={4} xl={4} className="card-list-doing">
      <MaterialUICard
        variant="outlined"
        className="card-list-header"
        key="doing-header"
      >
        <Typography className="card-list-header-title">DOING</Typography>
        <MoreVertIcon
          style={{ verticalAlign: "middle", float: "right" }}
          onClick={handleDoingSortMenuOpen}
        />
        <Menu
          anchorEl={sortMenuAnchorElement}
          open={Boolean(sortMenuAnchorElement)}
          onClose={handleDoingSortMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleDoingSortMenuClose();
              changeSortDoingMethodDeadline();
            }}
          >
            Sort by deadlines
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDoingSortMenuClose();
              changeSortDoingMethodTag();
            }}
          >
            Sort by tags
          </MenuItem>
        </Menu>
      </MaterialUICard>
      <Droppable droppableId="card-list-doing">
        {(provided) => (
          <Grid
            item
            className="card-list"
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardsDoing.map((card, index) => {
              return (
                <UserCard
                  id={card.id}
                  title={card.title}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  status={card.status}
                  description={card.description}
                  tag={card.tag}
                  users={card.users}
                  points={card.points}
                  timeLeftGroup={card.timeLeftGroup}
                  openCard={openUserCardDialog}
                  key={card.id}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <AddCard createCard={openAddDoingCardDialog} />
          </Grid>
        )}
      </Droppable>
    </Grid>
  );
};

export default DoingList;
