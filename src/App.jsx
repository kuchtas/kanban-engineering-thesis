import React, { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { DataStore } from "@aws-amplify/datastore";
import { Board, User, Card, Point } from "./models/index";
import { Auth, Hub } from "aws-amplify";

function App() {
  // window.LOG_LEVEL = "DEBUG";
  const [user, setUser] = useState("");
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    Hub.listen("auth", () => {
      initUser();
    });
    loadUserFromLocalStorage();
  }, []);

  const initUser = async () => {
    const removeListener = Hub.listen("datastore", async (capsule) => {
      const {
        payload: { event, data },
      } = capsule;

      console.log("DataStore event", event, data);

      if (event === "ready") {
        console.log("initUser starting");
        Auth.currentAuthenticatedUser().then(async (data) => {
          const userQuery = await DataStore.query(User, (u) =>
            u.name("eq", data.attributes.email)
          );

          if (userQuery.length === 0) {
            const newUser = await DataStore.save(
              new User({
                cognitoID: data.username,
                name: data.attributes.email,
                boards: [],
              })
            );
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
          } else {
            setUser(userQuery[0]);
            localStorage.setItem("user", JSON.stringify(userQuery[0]));
          }
        });
      }
    });
    // Start the DataStore, this kicks-off the sync process.
    DataStore.start();
    return () => {
      removeListener();
    };
  };

  useEffect(() => {
    console.log("after setting user", user);
  }, [user]);

  const loadUserFromLocalStorage = () => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      Auth.signOut();
    }
  };
  /////////////////////////////////////////////////////////////////////////////// over this line is to be recycled in real version
  const createBoard = async () => {
    const newBoard = await DataStore.save(
      new Board({
        title: "That is a new board!",
        users: [user.name],
        cards: [],
      })
    );

    const userQuery = await DataStore.query(User, (u) =>
      u.name("eq", user.name)
    );
    console.log("query", userQuery);

    await DataStore.save(
      User.copyOf(userQuery[0], (updated) => {
        updated.boards = [...updated.boards, newBoard.id];
      })
    );
    loadBoards();
  };

  const loadBoards = async () => {
    const boardsQuery = await DataStore.query(Board, (b) =>
      b.users("contains", user.name)
    );
    console.log(JSON.stringify(boardsQuery));
    setBoards(boardsQuery);
  };

  const createCard = async () => {
    const newCard = await DataStore.save(
      new Card({
        boardID: boards[1].id,
        title: "A card added to first board in boards list",
        status: "DOING",
        startDate: "2020-10-24",
        endDate: "2020-10-25",
      })
    );
    loadCards();
  }

  const loadCards = async () => {
    const cardsQuery = (await DataStore.query(Card));
    console.log(JSON.stringify(cardsQuery));
    setCards(cardsQuery);
  };

  const createPoint = async () => {
    const newPoint = await DataStore.save(
      new Point({
        cardID: cards[1].id,
        title: "A point a card",
        checked: false,
      })
    );
    loadPoints();
  }

  const loadPoints = async () => {
    const pointsQuery = (await DataStore.query(Point));
    console.log(JSON.stringify(pointsQuery));
    setPoints(pointsQuery);
  };

  return (
    <div id="app-root">
      <Navigation />
      <button onClick={createBoard}>Create a board</button>
      <button onClick={loadBoards}>Load users boards</button>
      <br />
      {user && `${user.name}'s boards: `}
      {boards &&
        boards.map((board) => {
          return <li>{`${JSON.stringify(board)}`}</li>;
        })}
      <br />
      <button onClick={createCard}>Create a card for random board</button>
      <button onClick={loadCards}>Load users cards</button>
      <br />
      {cards &&
        cards.map((card) => {
          return <li>{`${JSON.stringify(card)}`}</li>;
        })}
      <br />
      <button onClick={createPoint}>Create a point for random card</button>
      <button onClick={loadPoints}>Load cards points</button>
      <br />
      {points &&
        points.map((point) => {
          return <li>{`${JSON.stringify(point)}`}</li>;
        })}
    </div>
  );
}

export default App;