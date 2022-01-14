import * as Types from './../common/ActionType';

export const actLogin = () => {
    return {
        type: Types.LOGIN,
    }
}

export const actLoginAdmin = () => {
    return {
        type: Types.LOGIN_ADMIN,
    }
}

export const actLogout = () => {
    return {
        type: Types.LOGOUT,
    }
}

export const actEnableToast = (message) => {
    return {
        type: Types.ENABLE_TOAST,
        message: message,
    }
}

export const actDisableToast = () => {
    return {
        type: Types.DISABLE_TOAST,
    }
}

export const actChangePost = (id) => {
    return {
        type: Types.CHANGE_POST,
        id,
    }
}