// auth route reducers 

export var authReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_AUTH_STATUS':
            return {
                status: action.status
            };
        case 'RESET_AUTH_STATUS':
            return {};
        default:
            return state;
    }
};



// login reducers 

export var loginReducer = (state = { isLoading: false }, action) => {
    switch (action.type) {
        case 'SET_LOADING_STATUS_ON_REGISTERATION':
            return {
                ...state,
                isLoading: action.status
            }
        default:
            return state;
    }
}

export var loginFieldsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_FIELD_VALUE_ON_LOGIN':
            return {
                ...state,
                [action.name]: action.value
            }
        default:
            return state;
    }
}

export var registerReducer = (state = { usernameExist: false, passwordError: '', passwordConfirmError: '', isLoading: false }, action) => {
    switch (action.type) {
        case 'SET_USERNAME_EXIST_STATUS_ON_REGISTER':
            return {
                ...state,
                usernameExist: action.usernameExistStatus // true or false
            }
        case 'PASSWORD_LENGTH_STATUS_ON_REGISTER':
            return {
                ...state,
                passwordError: action.status
            }
        case 'PASSWORDCONFIRM_STATUS_ON_REGISTER':
            return {
                ...state,
                passwordConfirmError: action.status
            }
        case 'SET_LOADING_STATUS_ON_REGISTERATION':
            return {
                ...state,
                isLoading: action.status
            }
        default:
            return state;
    }
}

export var registerFieldsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_FIELD_VALUE_ON_REGISTER':
            return {
                ...state,
                [action.name]: action.value
            }
        default:
            return state;
    }
}