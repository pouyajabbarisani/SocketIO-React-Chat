// auth route actions
export var setAuthStatus = (status) => {
    return {
        type: 'SET_AUTH_STATUS',
        status: status
    }
}
export var resetAuthStatus = () => {
    return {
        type: 'RESET_AUTH_STATUS'
    }
}



// login actions
export var setLoadingStatusOnLogin = (status) => {
    return {
        type: 'SET_LOADING_STATUS_ON_LOGIN',
        status: status
    }
}
export var setFieldValueOnLogin = (name, value) => {
    return {
        type: 'SET_FIELD_VALUE_ON_LOGIN',
        name: name,
        value: value
    }
}



// register actions
export var usernameExistStatus = (status) => {
    return {
        type: 'SET_USERNAME_EXIST_STATUS_ON_REGISTER',
        usernameExistStatus: status
    }
}
export var passwordLengthStatus = (status) => {
    return {
        type: 'PASSWORD_LENGTH_STATUS_ON_REGISTER',
        status: status
    }
}
export var passwordConfirmStatus = (status) => {
    return {
        type: 'PASSWORDCONFIRM_STATUS_ON_REGISTER',
        status: status
    }
}
export var setLoadingStatusOnRegistration = (status) => {
    return {
        type: 'SET_LOADING_STATUS_ON_REGISTERATION',
        status: status
    }
}


export var setFieldValueOnRegister = (name, value) => {
    return {
        type: 'SET_FIELD_VALUE_ON_REGISTER',
        name: name,
        value: value
    }
}