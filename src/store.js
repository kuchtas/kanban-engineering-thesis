import {createStore} from 'redux';
import rootReducer from './reducer/reducer.js';

const store = createStore(rootReducer);

export default store;