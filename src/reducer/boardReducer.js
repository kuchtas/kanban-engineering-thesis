const initialState = {
    board: [],
}

export default function boardReducer(state = initialState, action){
    switch(action.type){
        case 'board/loaded':
            console.log("board loaded: ", action.payload);
            return {
                ...state, board: action.payload
            }
        default:
            return state;
    }
}