export var editProfileReducer = (state = { currentName: '', NewName: null, newPassword: null, isButtonLoading: false }, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER_NAME_ON_EDIT_PROFILE':
            return {
                ...state,
                currentName: action.name
            }
        case 'SET_NEW_USER_NAME_ON_EDIT_PROFILE':
            return {
                ...state,
                newName: action.name
            }
        case 'SET_NEW_USER_PASSWORD_ON_EDIT_PROFILE':
            return {
                ...state,
                newPassword: action.password
            }
        case 'SET_BUTTON_LOADING_STATUS_ON_EDIT_PROFILE':
            return {
                ...state,
                isButtonLoading: action.status
            }
        default:
            return state
    }
}
