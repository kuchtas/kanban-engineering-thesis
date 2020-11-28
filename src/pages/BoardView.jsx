import React, { useEffect, useState } from "react";
// GraphQL
import { Board, Card, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
import store from '../store';
// CSS
import "./BoardView.css";
// Components 
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError";
import CardListsContainer from "../components/CardListsContainer";
import BoardViewHeader from "../components/BoardViewHeader";
import DeleteBoardDialog from "../components/DeleteBoardDialog";
import AddMemberDialog from "../components/AddMemberDialog";

const BoardView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { id, users } = useSelector((state) => state.board);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingTodoCards, setLoadingTodoCards] = useState(true);
  const [loadingDoingCards, setLoadingDoingCards] = useState(true);
  const [loadingDoneCards, setLoadingDoneCards] = useState(true);
  const [openDeleteBoardDialog, setOpenDeleteBoardDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  const loadBoard = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    store.dispatch({ type: "board/loaded", payload: boardQuery[0] });
    setLoadingBoard(false);
  };

  useEffect(() => {
    if (user !== null) {
      const subscriptionTodo = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id).status("eq", "TODO")
      ).subscribe((c) => {
        console.log(c.opType);
        loadTodoCards();
      });
      const subscriptionDoing = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id).status("eq", "DOING")
      ).subscribe((c) => {
        console.log(c.opType);
        loadDoingCards();
      });
      const subscriptionDone = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id).status("eq", "DONE")
      ).subscribe((c) => {
        console.log(c.opType);
        loadDoneCards();
      });

      const subscriptionOnBoard = DataStore.observe(Board, (b) =>
        b.id("eq", match.params.id)
      ).subscribe((b) => {
        if (b.opType === "DELETE") history.push("/home");
      });

      return () => {
        subscriptionTodo.unsubscribe();
        subscriptionDoing.unsubscribe();
        subscriptionDone.unsubscribe();
        subscriptionOnBoard.unsubscribe();
      };
    }
  }, [user]);
  
  const loadTodoCards = async () => {
    const cardsToDoQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "TODO")
    );
    store.dispatch({ type: "cards/todoloaded", payload: cardsToDoQuery });
    setLoadingTodoCards(false);
  };

  const loadDoingCards = async () => {
    const cardsDoingQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "DOING")
    );
    store.dispatch({ type: "cards/doingloaded", payload: cardsDoingQuery });
    setLoadingDoingCards(false);
  };

  const loadDoneCards = async () => {
    const cardsDoneQuery = await DataStore.query(Card, (c) =>
      c.boardID("eq", match.params.id).status("eq", "DONE")
    );
    store.dispatch({ type: "cards/doneloaded", payload: cardsDoneQuery });
    setLoadingDoneCards(false);
  };

  const deleteBoard = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );

    const userQuery = await DataStore.query(User, (u) =>
      u.boards("contains", match.params.id)
    );

    console.log(userQuery);
    userQuery.forEach( async (userQuery) => {
      console.log(userQuery);
      await DataStore.save(
        User.copyOf(userQuery, (updated) => {
          const index = updated.boards.indexOf(match.params.id);
          updated.boards.splice(index, 1);
        })
      );
    })

    await DataStore.delete(Card, (c) => c.boardID("eq", match.params.id));
    store.dispatch({ type: "cards/deleted", payload: [] });
    DataStore.delete(boardQuery[0]);
    history.push("/home");

    setOpenDeleteBoardDialog(false);
  };

  const addMember = async (member) => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id).users("notContains", member)
    );
    const userQuery = await DataStore.query(User, (u) =>
      u.name("eq", member).boards("notContains", match.params.id)
    );

    if (userQuery.length !== 0 && boardQuery.length !== 0) {
      await DataStore.save(
        Board.copyOf(boardQuery[0], (updated) => {
          updated.users = [...updated.users, member];
        })
      );

      await DataStore.save(
        User.copyOf(userQuery[0], (updated) => {
          updated.boards = [...updated.boards, match.params.id];
        })
      );
    }
    setOpenAddMemberDialog(false);
  };

  const openBoardDeletionDialog = () => {
    setOpenDeleteBoardDialog(true);
  };

  const closeBoardDeletionDialog = () => {
    setOpenDeleteBoardDialog(false);
  };

  const openMemberAdditionDialog = () => {
    setOpenAddMemberDialog(true);
  };

  const closeMemberAdditionDialog = () => {
    setOpenAddMemberDialog(false);
  };
  
  useEffect(() => {
    if (loadingBoard) loadBoard();
    if (loadingTodoCards) loadTodoCards();
    if (loadingDoingCards) loadDoingCards();
    if (loadingDoneCards) loadDoneCards();
  });

  useEffect(() => {
    if (!loadingBoard) setUserValid(users.includes(user.name));
  }, [id]);

  return (
    <React.Fragment>
      {loadingTodoCards ||
      loadingDoingCards ||
      loadingDoneCards ||
      loadingBoard ? (
        <div className="board-view-page">
          {/* display spinner when loading */}
          <Navigation history={history} />
          <Loading />
        </div>
      ) : userValid ? (
        <div className="board-view-page">
          {/* if all is loaded and user is a part of the board display it */}
          <Navigation history={history} />
          <BoardViewHeader
               openBoardDeletionDialog={openBoardDeletionDialog}
               openMemberAdditionDialog={openMemberAdditionDialog}
          />
          <CardListsContainer />
          <DeleteBoardDialog
            openDeleteBoardDialog={openDeleteBoardDialog}
            closeBoardDeletionDialog={closeBoardDeletionDialog}
            deleteBoard={deleteBoard}
          />
          <AddMemberDialog
            openAddMemberDialog={openAddMemberDialog}
            closeMemberAdditionDialog={closeMemberAdditionDialog}
            addMember={addMember}
          />
        </div>
      ) : (
        <div className="board-view-page-invalid-user-error">
          {/* if user is not a part of the board they cannot see it */}
          <Navigation history={history} />
          <InvalidUserError history={history} />
        </div>
      )}
    </React.Fragment>
  );
};

export default BoardView;
