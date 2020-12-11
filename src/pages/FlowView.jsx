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
    let newRows = [];
    timelineTasks.forEach((task, index) => {
      newRows[index] = [
        task.title,
        task.title,
        `<p style="font-size: 25px; font-weight: bold; margin: 0px; padding: 10px; padding-bottom: 0px; text-align: center;">${
          task.title
        }<br>${
          task.tag.length !== 0
            ? `
            <p style="font-size: 15px; margin: 0px; text-align: center; padding-bottom: 0px;">
              ${task.tag}
            </p>`
            : `
            <p style="font-size: 15px; margin: 0px; text-align: center; padding-bottom: 0px;">
            </p>`
        }</p><hr style="margin-left: 5px; margin-right: 5px; margin-top: 0px; margin-bottom: 0px;" />
        <p style="font-size: 20px; margin: 0px; padding: 10px; padding-top: 0px; padding-bottom: 0px; text-align: center;">Users:${
          task.users.length !== 0
            ? task.users.map((user) => `<br>${user}`)
            : " No one is assigned to this task"
        }</p>
        <hr style="margin-left: 5px; margin-right: 5px; " />
        <p style="font-size: 20px; margin: 0px; padding: 10px; padding-top: 0px; text-align: center;">${
          task.startDate
        } - ${task.endDate} <br>Duration: ${
          (new Date(task.endDate).getTime() -
            new Date(task.startDate).getTime() +
            86400000) /
          86400000
        } day/s</p>`,
        new Date(task.startDate),
        new Date(task.endDate),
      ];
    });
    setRows(newRows);
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
