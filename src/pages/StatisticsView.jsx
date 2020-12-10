import React, { useState, useEffect } from "react";
// components
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError";
// Redux
import { useSelector } from "react-redux";
// GraphQL
import { Board, Card, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// utils
import {
  loadBoard,
  loadCards,
  deleteBoard,
  addMember,
  deleteMember,
} from "../utils/databaseActions";
import StatisticsViewHeader from "../components/StatisticsViewHeader";
import DeleteBoardDialog from "../components/DeleteBoardDialog";
import AddMemberDialog from "../components/AddMemberDialog";
import BoardStatisticsContainer from "../components/BoardStatisticsContainer";
import UserStatisticsContainer from "../components/UserStatisticsContainer";

const StatisticsView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { id, users } = useSelector((state) => state.board);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [openDeleteBoardDialog, setOpenDeleteBoardDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  useEffect(() => {
    if (!loadingBoard) setUserValid(users.includes(user.name));
  }, [id, user, loadingBoard, users]);

  const loadBoardStatisticsView = async () => {
    await loadBoard(match.params.id);
    setLoadingBoard(false);
  };

  const loadCardsStatisticsView = async () => {
    await loadCards(match.params.id);
    setLoadingCards(false);
  };

  const deleteBoardStatisticsView = async () => {
    await deleteBoard(match.params.id);
    history.push("/home");
    setOpenDeleteBoardDialog(false);
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
    if (user !== null) {
      const subscriptionOnCards = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id)
      ).subscribe((c) => {
        console.log(c.opType);
        loadCardsStatisticsView();
      });

      const subscriptionOnBoard = DataStore.observe(Board, (b) =>
        b.id("eq", match.params.id)
      ).subscribe((b) => {
        if (b.opType === "DELETE") history.push("/home");
        if (b.opType === "UPDATE") loadBoardStatisticsView();
      });

      return () => {
        console.log("unsubsribing from cards and boards in BoardView");
        subscriptionOnCards.unsubscribe();
        subscriptionOnBoard.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (loadingBoard) loadBoardStatisticsView();
    if (loadingCards) loadCardsStatisticsView();
  });

  return (
    <React.Fragment>
      {loadingCards || loadingBoard ? (
        <div className="statistics-view-page">
          {/* display spinner when loading */}
          <Navigation history={history} />
          <Loading />
        </div>
      ) : userValid ? (
        <div className="statistics-view-page">
          {/* if all is loaded and user is a part of the board display it */}
          <Navigation history={history} />
          <StatisticsViewHeader
            openBoardDeletionDialog={openBoardDeletionDialog}
            openMemberAdditionDialog={openMemberAdditionDialog}
            history={history}
          />
          <BoardStatisticsContainer />
          <UserStatisticsContainer currentUser={user.name} users={users} />
          <DeleteBoardDialog
            openDeleteBoardDialog={openDeleteBoardDialog}
            closeBoardDeletionDialog={closeBoardDeletionDialog}
            deleteBoard={deleteBoardStatisticsView}
          />
          <AddMemberDialog
            openAddMemberDialog={openAddMemberDialog}
            closeMemberAdditionDialog={closeMemberAdditionDialog}
            addMember={addMember}
            deleteMember={deleteMember}
            users={users}
            currentUser={user.name}
            boardID={match.params.id}
          />
        </div>
      ) : (
        <div className="statistics-view-page-invalid-user-error">
          {/* if user is not a part of the board they cannot see it */}
          <Navigation history={history} />
          <InvalidUserError history={history} />
        </div>
      )}
    </React.Fragment>
  );
};

export default StatisticsView;
