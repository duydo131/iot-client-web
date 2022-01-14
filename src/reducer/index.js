import { combineReducers } from 'redux';
import auth from './auth';
// import admin from './admin';
import toast from './toast';
// import post from './post';

const appReducers = combineReducers({
    auth,
    // admin,
    toast,
    // post,
});

export default appReducers;