const initialState = { 
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    status: "",
    description: "",
    tag: "",
    users: [],
    subscription: "",
}

export default function chosenCardReducer(state = initialState, action){
    switch(action.type){
        case 'chosencard/added':
            console.log("chosen card: ", action.payload);
            if(action.payload !== [] && action.payload !== undefined)
            return {
                ...state,  
                id: action.payload.id,
                title: action.payload.title,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
                status: action.payload.status,
                description: action.payload.description,
                tag: action.payload.tag,
                users: action.payload.users,
            }
            else{
                return state;
            }
        case 'chosencard/setsub':
            console.log('set sub: ', action.payload);
            if(action.payload !== [] && action.payload !== undefined)
            return{
                ...state, subscription: action.payload,
            }
            else{
                return state;
            }
        default:
            return state;
    }
}