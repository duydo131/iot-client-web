import * as Types from '../common/ActionType';
var token = localStorage.getItem('token')
// var token = JSON.parse();
var initialState = token !== null;

export default function auth(state = initialState, action){
    switch (action.type) {
        case Types.LOGOUT:
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false
        case Types.LOGIN:
            return true
        default: return state;
    }
}