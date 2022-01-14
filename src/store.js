import appReducers from './reducer/index'

import { createStore } from 'redux'


const store = createStore(
    appReducers
);

export default store;