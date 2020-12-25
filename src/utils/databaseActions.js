import { DataStore, SortDirection } from "@aws-amplify/datastore";
import { User, Card, Board } from "../models/index";
import store from "../store";
export const deleteCard = async (cID, bID) => {
  const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cID));
  const boardQuery = await DataStore.query(Board, (b) => b.id("eq", bID));

  cardQuery[0].users.forEach(async (user) => {
    console.log(user);
    const userQuery = await DataStore.query(User, (u) => u.name("eq", user));
    console.log(userQuery);
    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        const index = updated.cards.indexOf(cID);
        updated.cards.splice(index, 1);
      })
    );
  });

  await DataStore.save(
    Board.copyOf(boardQuery[0], (updated) => {
      const index = updated.cards.indexOf(cID);
      updated.cards.splice(index, 1);
    })
  );

  await DataStore.delete(cardQuery[0]);
};

export const deleteUser = async (user, cID) => {
  const cardQuery = await DataStore.query(Card, (c) => c.id("eq", cID));

  const userQuery = await DataStore.query(User, (u) => u.name("eq", user));

  await DataStore.save(
    Card.copyOf(cardQuery[0], (updated) => {
      const index = updated.users.indexOf(user);
      updated.users.splice(index, 1);
    })
  );

  await DataStore.save(
    User.copyOf(userQuery[0], (updated) => {
      const index = updated.cards.indexOf(cID);
      updated.cards.splice(index, 1);
    })
  );
};

export const loadBoard = async (boardID) => {
  const boardQuery = await DataStore.query(Board, (b) => b.id("eq", boardID));
  if (boardQuery !== undefined && boardQuery.length !== 0)
    store.dispatch({ type: "board/loaded", payload: boardQuery[0] });
};

export const loadBoards = async (name) => {
  const boardsQuery = await DataStore.query(Board, (b) =>
    b.users("contains", name)
  );
  return boardsQuery.sort((a, b) =>
    a._lastChangedAt > b._lastChangedAt ? -1 : 1
  );
};

export const loadCards = async (boardID) => {
  const cardsQuery = await DataStore.query(
    Card,
    (c) => c.boardID("eq", boardID),
    {
      sort: (s) =>
        s.endDate(SortDirection.ASCENDING).startDate(SortDirection.ASCENDING),
    }
  );
  store.dispatch({ type: "cards/loaded", payload: cardsQuery });
};

export const deleteBoard = async (boardID) => {
  const userQuery = await DataStore.query(User, (u) =>
    u.boards("contains", boardID)
  );
  console.log(userQuery);

  userQuery.forEach(async (userQuery) => {
    await DataStore.save(
      User.copyOf(userQuery, (updated) => {
        const index = updated.boards.indexOf(boardID);
        updated.boards.splice(index, 1);
        if (updated.boards.length === 0) updated.cards = [];
      })
    );
  });

  const boardQuery = await DataStore.query(Board, (b) => b.id("eq", boardID));
  await DataStore.delete(Card, (c) => c.boardID("eq", boardID));

  store.dispatch({ type: "cards/deleted", payload: [] });
  await DataStore.delete(boardQuery[0]);
};

export const addMember = async (boardID, member) => {
  let success = true;
  const boardQuery = await DataStore.query(Board, (b) =>
    b.id("eq", boardID).users("notContains", member)
  );
  const userQuery = await DataStore.query(User, (u) =>
    u.name("eq", member).boards("notContains", boardID)
  );

  if (userQuery.length !== 0 && boardQuery.length !== 0) {
    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        updated.users = [...updated.users, member];
      })
    );

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        updated.boards = [...updated.boards, boardID];
      })
    );
  } else {
    success = false;
  }
  return success;
};

export const deleteMember = async (boardID, member) => {
  const boardQuery = await DataStore.query(Board, (b) => b.id("eq", boardID));
  const userQuery = await DataStore.query(User, (u) => u.name("eq", member));
  const cardQuery = await DataStore.query(Card, (c) =>
    c.users("contains", member)
  );

  if (userQuery.length !== 0 && boardQuery.length !== 0) {
    await DataStore.save(
      Board.copyOf(boardQuery[0], (updated) => {
        const index = updated.users.indexOf(member);
        updated.users.splice(index, 1);
      })
    );

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        const index = updated.boards.indexOf(boardID);
        updated.boards.splice(index, 1);
      })
    );

    cardQuery.forEach(async (card) => {
      await deleteUser(member, card.id);
    });
  }
};

export const createBoard = async (newBoardTitle, username) => {
  if (newBoardTitle !== null && newBoardTitle !== "") {
    const newBoard = await DataStore.save(
      new Board({
        title: newBoardTitle,
        users: [username],
        cards: [],
      })
    );

    const userQuery = await DataStore.query(User, (u) =>
      u.name("eq", username)
    );
    console.log("query", userQuery);

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        updated.boards = [...updated.boards, newBoard.id];
      })
    );
  }
};
