
export var setCurrentUserNameOnEditProfile = (name) => {
    return {
        type: 'SET_CURRENT_USER_NAME_ON_EDIT_PROFILE',
        name: name
    }
}
export var setNewUserNameOnEditProfile = (name) => {
    return {
        type: 'SET_NEW_USER_NAME_ON_EDIT_PROFILE',
        name: name
    }
}
export var setNewUserPasswordOnEditProfile = (password) => {
    return {
        type: 'SET_NEW_USER_PASSWORD_ON_EDIT_PROFILE',
        password: password
    }
}
export var setButtonLoadingStatusOnEditProfile = (status) => {
    return {
        type: 'SET_BUTTON_LOADING_STATUS_ON_EDIT_PROFILE',
        status: status
    }
}