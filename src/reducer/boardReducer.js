const initialState = {
    id: null,
    title: null,
    cards: [],
    users: [],
}

export default function boardReducer(state = initialState, action){
    switch(action.type){
        case 'board/loaded':
            console.log("board loaded: ", action.payload);
            return {
                ...state, id: action.payload.id, 
                title: action.payload.title, 
                cards: action.payload.cards, 
                users: action.payload.users
            }
        case 'board/changedtitle':
            console.log("new title:", action.payload);
            return {
                ...state, title: action.payload
            }
        default:
            return state;
    }
}