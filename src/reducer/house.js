import * as Types from '../common/ActionType';
var initialState = {
    id: 1
}

export default function house(state = initialState, action){
    switch (action.type) {
        case Types.CHANGE_HOUSE:
            return {
                ...state,
                id: action.id,
            }
        default: return state;
    }
}