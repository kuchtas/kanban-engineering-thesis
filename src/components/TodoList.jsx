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
import "./TodoList.css";

const TodoList = ({
  cardsToDo,
  openAddTodoCardDialog,
  openUserCardDialog,
  changeSortTodoMethodDeadline,
  changeSortTodoMethodTag,
}) => {
  const [sortMenuAnchorElement, setSortMenuAnchorElement] = useState(null);

  const handleTodoSortMenuOpen = (event) => {
    setSortMenuAnchorElement(event.currentTarget);
  };
  const handleTodoSortMenuClose = () => {
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
      className="card-list-todo enter-todo"
    >
      <MaterialUICard
        variant="outlined"
        className="card-list-header"
        key="todo-header"
      >
        <Typography className="card-list-header-title">TO DO</Typography>
        <MoreVertIcon
          style={{ verticalAlign: "middle", float: "right" }}
          onClick={handleTodoSortMenuOpen}
        />
        <Menu
          anchorEl={sortMenuAnchorElement}
          open={Boolean(sortMenuAnchorElement)}
          onClose={handleTodoSortMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleTodoSortMenuClose();
              changeSortTodoMethodDeadline();
            }}
          >
            Sort by deadlines
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleTodoSortMenuClose();
              changeSortTodoMethodTag();
            }}
          >
            Sort by tags
          </MenuItem>
        </Menu>
      </MaterialUICard>
      <Droppable droppableId="card-list-todo">
        {(provided) => (
          <Grid
            item
            className="card-list"
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardsToDo.map((card, index) => {
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
            <AddCard createCard={openAddTodoCardDialog} />
          </Grid>
        )}
      </Droppable>
    </Grid>
  );
};

export default TodoList;
