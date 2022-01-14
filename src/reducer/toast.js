import * as Types from '../common/ActionType';

const initialState = {
    enableToast: false,
    message: ''
}

const toast = (state = initialState, action) => {
    switch (action.type) {
        case Types.ENABLE_TOAST:
            state = {
                enableToast: true,
                message: action.message,
            }
            return state
        case Types.DISABLE_TOAST:
            state = {
                enableToast: false,
                message: ''
            }
            return state
        default: return state;
    }
}

export default toast;