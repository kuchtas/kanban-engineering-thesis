import React, { useEffect, useState } from "react";
// GraphQL
import { Board, Card, User } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";
// Redux
import { useSelector } from "react-redux";
// CSS
import "./FlowView.css";
// Components
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import InvalidUserError from "../components/InvalidUserError";
import FlowViewHeader from "../components/FlowViewHeader";
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
import FlowChartContainer from "../components/FlowChartContainer";
import { setClassByDeadlineCloseness } from "../utils/deadline";

let rows = [
  //   ["1", "George Washington", new Date(1789, 3, 30), new Date(1797, 2, 4)],
  //   ["2", "John Adams", new Date(1797, 2, 4), new Date(1801, 2, 4)],
  //   ["3", "Thomas Jefferson", new Date(1801, 2, 4), new Date(1809, 2, 4)],
];

const FlowView = ({ history, match }) => {
  const { user } = useSelector((state) => state.user);
  const { id, users } = useSelector((state) => state.board);
  const { cards } = useSelector((state) => state.cards);
  const [userValid, setUserValid] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [openDeleteBoardDialog, setOpenDeleteBoardDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [timelineTasks, setTimelineTasks] = useState([]);

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
    timelineTasks.forEach((task, index) => {
      rows[index] = [
        task.title,
        task.title,
        `<p style="font-size: 20px; margin: 0px; padding: 0px;">Task: ${
          task.title
        }</p><br>
        <p style="font-size: 20px; margin: 0px; padding: 0px;">Users:${
          task.users.length !== 0
            ? task.users.map((user) => `<br>${user}`)
            : " none"
        }</p>`,
        new Date(task.startDate),
        new Date(task.endDate),
      ];
    });
    console.log("ROWS", rows);
  }, [timelineTasks]);

  useEffect(() => {
    if (!loadingBoard) setUserValid(users.includes(user.name));
  }, [id, user, loadingBoard, users]);

  const loadBoardFlowView = async () => {
    await loadBoard(match.params.id);
    setLoadingBoard(false);
  };

  useEffect(() => {
    if (user !== null) {
      const subscriptionOnCards = DataStore.observe(Card, (c) =>
        c.boardID("eq", match.params.id)
      ).subscribe((c) => {
        console.log(c.opType);
        loadCardsFlowView();
      });

      const subscriptionOnBoard = DataStore.observe(Board, (b) =>
        b.id("eq", match.params.id)
      ).subscribe((b) => {
        if (b.opType === "DELETE") history.push("/home");
        if (b.opType === "UPDATE") loadBoardFlowView();
      });

      return () => {
        console.log("unsubsribing from cards and boards in BoardView");
        subscriptionOnCards.unsubscribe();
        subscriptionOnBoard.unsubscribe();
      };
    }
  }, [user]);

  const loadCardsFlowView = async () => {
    await loadCards(match.params.id);
    setLoadingCards(false);
  };

  const deleteBoardFlowView = async () => {
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
    if (loadingBoard) loadBoardFlowView();
    if (loadingCards) loadCardsFlowView();
  });

  return (
    <React.Fragment>
      {loadingCards || loadingBoard ? (
        <div className="flow-view-page">
          {/* display spinner when loading */}
          <Navigation history={history} />
          <Loading />
        </div>
      ) : userValid ? (
        <div className="flow-view-page">
          {/* if all is loaded and user is a part of the board display it */}
          <Navigation history={history} />
          <FlowViewHeader
            openBoardDeletionDialog={openBoardDeletionDialog}
            openMemberAdditionDialog={openMemberAdditionDialog}
            history={history}
          />
          <FlowChartContainer rows={rows} />
          <DeleteBoardDialog
            openDeleteBoardDialog={openDeleteBoardDialog}
            closeBoardDeletionDialog={closeBoardDeletionDialog}
            deleteBoard={deleteBoardFlowView}
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
        <div className="flow-view-page-invalid-user-error">
          {/* if user is not a part of the board they cannot see it */}
          <Navigation history={history} />
          <InvalidUserError history={history} />
        </div>
      )}
    </React.Fragment>
  );
};

export default FlowView;
