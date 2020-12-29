import { Card, Popover, Typography, List, ListItem } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import "../styles/AddUserToCard.css";
import { useSelector } from "react-redux";

const AddUserToCard = ({ addUser, cardUsers }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { users: boardUsers } = useSelector((state) => state.board);
  const [users, setUsers] = useState(boardUsers);

  const openPopover = (event) => {
    setShowPopover(true);
    setAnchorEl(event.currentTarget);
  };
  const closePopover = () => {
    setShowPopover(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    const myArray = boardUsers.filter((el) => !cardUsers.includes(el));
    setUsers(myArray);
  }, [boardUsers, cardUsers]);

  return (
    <React.Fragment>
      <Card
        variant="outlined"
        className="card-dialog-add-user"
        onClick={(e) => openPopover(e)}
      >
        <GroupAddIcon fontSize="default" />
      </Card>
      <Popover
        id={"add-user-to-card-popover"}
        open={showPopover}
        onClose={closePopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {users.length === 0 ? (
          <Typography>
            All possible users are already assigned to this task
          </Typography>
        ) : (
          <List>
            {users.map((user) => {
              return (
                <ListItem
                  className="card-add-user-list-element"
                  onClick={() => {
                    addUser(user);
                    closePopover();
                  }}
                  key={user}
                >
                  {user}
                </ListItem>
              );
            })}
          </List>
        )}
      </Popover>
    </React.Fragment>
  );
};

export default AddUserToCard;
