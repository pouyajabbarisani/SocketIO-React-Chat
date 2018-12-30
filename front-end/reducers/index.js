import { combineReducers } from 'redux';


import {
    authReducer,
    loginReducer,
    loginFieldsReducer,
    registerReducer,
    registerFieldsReducer
} from './auth'
import {
    chatsReducer,
    singleChatReducer
} from './chat'
import {
    editProfileReducer
} from './editProfile.js'


export default combineReducers({
    authReducer,
    loginReducer,
    loginFieldsReducer,
    registerReducer,
    registerFieldsReducer,
    chatsReducer,
    singleChatReducer,
    editProfileReducer
});
