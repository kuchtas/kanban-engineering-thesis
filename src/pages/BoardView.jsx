import React, { useEffect, useState } from "react";
// GraphQL
import { Board, Card, User } from "../models/index";
import { DataStore, SortDirection } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
import store from "../store";
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
// utils

const BoardView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { id, users } = useSelector((state) => state.board);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [openDeleteBoardDialog, setOpenDeleteBoardDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  const loadBoard = async () => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    if (boardQuery !== undefined && boardQuery.length !== 0)
      store.dispatch({ type: "board/loaded", payload: boardQuery[0] });
    setLoadingBoard(false);
  };

  useEffect(() => {
    if (user !== null) {
      const subscriptionOnCards = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id)
      ).subscribe((c) => {
        console.log(c.opType);
        loadCards();
      });

      const subscriptionOnBoard = DataStore.observe(Board, (b) =>
        b.id("eq", match.params.id)
      ).subscribe((b) => {
        if (b.opType === "DELETE") history.push("/home");
        if (b.opType === "UPDATE") loadBoard();
      });

      return () => {
        subscriptionOnCards.unsubscribe();
        subscriptionOnBoard.unsubscribe();
      };
    }
  }, [user]);

  const loadCards = async () => {
    const cardsQuery = await DataStore.query(
      Card,
      (c) => c.boardID("eq", match.params.id),
      {
        sort: (s) =>
          s.endDate(SortDirection.ASCENDING).startDate(SortDirection.ASCENDING),
      }
    );
    store.dispatch({ type: "cards/loaded", payload: cardsQuery });
    setLoadingCards(false);
  };

  const deleteBoard = async () => {
    const userQuery = await DataStore.query(User, (u) =>
      u.boards("contains", match.params.id)
    );
    console.log(userQuery);

    userQuery.forEach(async (userQuery) => {
      await DataStore.save(
        User.copyOf(userQuery, (updated) => {
          const index = updated.boards.indexOf(match.params.id);
          updated.boards.splice(index, 1);
          if (updated.boards.length === 0) updated.cards = [];
        })
      );
    });

    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    await DataStore.delete(Card, (c) => c.boardID("eq", match.params.id));

    store.dispatch({ type: "cards/deleted", payload: [] });
    await DataStore.delete(boardQuery[0]);
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
  };

  const deleteMember = async (member) => {
    const boardQuery = await DataStore.query(Board, (b) =>
      b.id("eq", match.params.id)
    );
    const userQuery = await DataStore.query(User, (u) => u.name("eq", member));

    if (userQuery.length !== 0 && boardQuery.length !== 0) {
      await DataStore.save(
        Board.copyOf(boardQuery[0], (updated) => {
          const index = updated.users.indexOf(member);
          updated.users.splice(index, 1);
        })
      );

      await DataStore.save(
        User.copyOf(userQuery[0], (updated) => {
          const index = updated.boards.indexOf(id);
          updated.boards.splice(index, 1);
        })
      );
    }
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
    if (loadingCards) loadCards();
  });

  useEffect(() => {
    if (!loadingBoard) setUserValid(users.includes(user.name));
  }, [id]);

  return (
    <React.Fragment>
      {loadingCards || loadingBoard ? (
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
          <CardListsContainer loadCards={loadCards} />
          <DeleteBoardDialog
            openDeleteBoardDialog={openDeleteBoardDialog}
            closeBoardDeletionDialog={closeBoardDeletionDialog}
            deleteBoard={deleteBoard}
          />
          <AddMemberDialog
            openAddMemberDialog={openAddMemberDialog}
            closeMemberAdditionDialog={closeMemberAdditionDialog}
            addMember={addMember}
            deleteMember={deleteMember}
            users={users}
            currentUser={user.name}
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
