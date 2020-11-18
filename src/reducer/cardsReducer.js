const initialState = {
    cardsToDo: [], 
    cardsDoing: [], 
    cardsDone: [],
}

export default function cardsReducer(state = initialState, action){
    switch(action.type){
        case 'cards/todoloaded':
            console.log("cards todo loaded: ", action.payload);
            return {
                ...state, cardsToDo: action.payload
            }
        case 'cards/doingloaded':
            console.log("cards doing loaded: ", action.payload);
            return {
                ...state, cardsDoing: action.payload
            }
        case 'cards/doneloaded':
            console.log("cards done loaded: ", action.payload);
            return {
                ...state, cardsDone: action.payload
            }
        case 'cards/todoadded':
            console.log("cards todo added: ", action.payload);
            return {
                ...state, cardsToDo: [...state.cardsToDo, action.payload]
            }
        case 'cards/doingadded':
            console.log("cards doing added: ", action.payload);
            return {
                ...state, cardsDoing: [...state.cardsDoing, action.payload]
            }
        case 'cards/doneadded':
            console.log("cards done added: ", action.payload);
            return {
                ...state,cardsDone: [...state.cardsDone, action.payload]
            }
        case 'cards/deleted':
            console.log("cards deleted: ", action.payload);
            return {
                ...state, cardsToDo: [], 
                cardsDoing: [], 
                cardsDone: []
            }
        default:
            return state;
    }
}