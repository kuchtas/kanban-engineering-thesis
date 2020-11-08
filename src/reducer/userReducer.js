const initialState = {
    user: null,
}

export default function userReducer(state = initialState, action){
    switch(action.type){
        case 'user/added':
            console.log("user added: ", action.payload);
            return {
                ...state, user: action.payload
            }
        default:
            return state;
    }
}