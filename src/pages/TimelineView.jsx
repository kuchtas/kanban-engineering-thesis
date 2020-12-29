import React, { useEffect, useState } from "react";
// GraphQL
import { Board, Card } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
// Components
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError";
import TimelineViewHeader from "../components/TimelineViewHeader";
import DeleteBoardDialog from "../components/DeleteBoardDialog";
import AddMemberDialog from "../components/AddMemberDialog";
// utils
import {
  loadBoard,
  loadCards,
  deleteBoard,
  addMember,
  deleteMember,
} from "../utils/databaseActions";
import TimelineChartContainer from "../components/TimelineChartContainer";
import { setClassByDeadlineCloseness } from "../utils/deadline";
import { prepareTimelineData } from "../utils/timelineActions";

const TimelineView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { id, users } = useSelector((state) => state.board);
  const { cards } = useSelector((state) => state.cards);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [openDeleteBoardDialog, setOpenDeleteBoardDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [timelineTasks, setTimelineTasks] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (cards.length !== 0) {
      const newTimelineTasks = cards
        .filter((card) => card.status === "TODO" || card.status === "DOING")
        .map((a) => ({ ...a }));

      newTimelineTasks.forEach(
        (card) =>
          (card.timeLeftGroup = setClassByDeadlineCloseness(
            card.startDate,
            card.endDate
          ))
      );
      setTimelineTasks(newTimelineTasks);
    }
  }, [cards]);

  useEffect(() => {
    const newRows = prepareTimelineData(timelineTasks);
    setRows(newRows);
  }, [timelineTasks]);

  useEffect(() => {
    if (!loadingBoard) setUserValid(users.includes(user.name));
  }, [id, user, loadingBoard, users]);

  const loadBoardTimelineView = async () => {
    await loadBoard(match.params.id);
    setLoadingBoard(false);
  };

  useEffect(() => {
    if (user !== null) {
      const subscriptionOnCards = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id)
      ).subscribe((c) => {
        loadCardsTimelineView();
      });

      const subscriptionOnBoard = DataStore.observe(Board, (b) =>
        b.id("eq", match.params.id)
      ).subscribe((b) => {
        if (b.opType === "DELETE") history.push("/home");
        if (b.opType === "UPDATE") loadBoardTimelineView();
      });

      return () => {
        subscriptionOnCards.unsubscribe();
        subscriptionOnBoard.unsubscribe();
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCardsTimelineView = async () => {
    await loadCards(match.params.id);
    setLoadingCards(false);
  };

  const deleteBoardTimelineView = async () => {
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
    if (loadingBoard) loadBoardTimelineView();
    if (loadingCards) loadCardsTimelineView();
  });

  return (
    <>
      {loadingCards || loadingBoard ? (
        <div className="timeline-view-page">
          {/* display spinner when loading */}
          <Navigation history={history} />
          <Loading />
        </div>
      ) : userValid ? (
        <div className="timeline-view-page">
          {/* if all is loaded and user is a part of the board display it */}
          <Navigation history={history} />
          <TimelineViewHeader
            openBoardDeletionDialog={openBoardDeletionDialog}
            openMemberAdditionDialog={openMemberAdditionDialog}
            history={history}
          />
          <TimelineChartContainer rows={rows} />
          <DeleteBoardDialog
            openDeleteBoardDialog={openDeleteBoardDialog}
            closeBoardDeletionDialog={closeBoardDeletionDialog}
            deleteBoard={deleteBoardTimelineView}
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
        <div className="timeline-view-page-invalid-user-error">
          {/* if user is not a part of the board they cannot see it */}
          <Navigation history={history} />
          <InvalidUserError history={history} />
        </div>
      )}
    </>
  );
};

export default TimelineView;
