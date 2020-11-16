import {combineReducers} from 'redux';

import userReducer from './userReducer';
import boardReducer from './boardReducer';
import cardsReducer from './cardsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    board: boardReducer,
    cards: cardsReducer,
})

export default rootReducer;