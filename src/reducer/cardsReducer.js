const initialState = {
  cards: [],
};

export default function cardsReducer(state = initialState, action) {
  switch (action.type) {
    case "cards/loaded":
      console.log("cards loaded: ", action.payload);
      return {
        ...state,
        cards: action.payload,
      };
    case "cards/deleted":
      console.log("cards deleted: ", action.payload);
      return {
        ...state,
        cardsToDo: [],
        cardsDoing: [],
        cardsDone: [],
      };
    default:
      return state;
  }
}
