import { DataStore } from "@aws-amplify/datastore";
import { User, Card, Board } from "../models/index";
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
