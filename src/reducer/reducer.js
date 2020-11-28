import {combineReducers} from 'redux';

import userReducer from './userReducer';
import boardReducer from './boardReducer';
import cardsReducer from './cardsReducer';
import chosenCardReducer from './chosenCardReducer';

const rootReducer = combineReducers({
    user: userReducer,
    board: boardReducer,
    cards: cardsReducer,
    chosenCard: chosenCardReducer
})

export default rootReducer;