import { combineReducers } from 'redux';
import auth from './auth';
import house from './house';
import toast from './toast';
// import post from './post';

const appReducers = combineReducers({
    auth,
    house,
    toast,
    // post,
});

export default appReducers;