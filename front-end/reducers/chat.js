export var chatsReducer = (state = { searchTerm: '', contactsListType: 'contacts', isEditPageOpen: false, contacts: [], searchContacts: [], status: 'loading', isLoading: false, responsiveStatus: 'list' }, action) => {
    switch (action.type) {
        case 'SET_CHATS_LIST':
            return {
                ...state,
                status: 'success',
                contacts: action.contacts
            }
        case 'SET_CHATS_USERNAME':
            return {
                ...state,
                username: action.username
            }
        case 'SET_CHATS_LIST_STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'SET_CHATS_RESPONSIVE_STATUS':
            // for making button to change active scense in responsive (such as telegram app)
            return {
                ...state,
                responsiveStatus: action.status
            }
        case 'CHANGE_CHATS_EDIT_PROFILE_STAUTS':
            return {
                ...state,
                isEditPageOpen: action.status
            }
        case 'SET_CONTACTS_LIST_TYPE':
            return {
                ...state,
                contactsListType: action.listType
            }
        case 'SET_SEARCH_CONTACTS_LIST':
            return {
                ...state,
                searchContacts: action.contacts,
                status: 'success'
            }
        case 'SET_CONTACTS_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.term
            }
        default:
            return state
    }
}

export var singleChatReducer = (state = { status: 'select', isLoading: false, attachments: [] }, action) => {
    switch (action.type) {
        case 'SET_SINGLE_CHAT_SELECTED_CONTACT_USERNAME':
            return {
                ...state,
                contactUsername: action.username,
                status: 'loading',
            }
        case 'SET_SINGLE_CONTACT_USERNAME_ON_SINGLE_CHAT':
            return {
                ...state,
                contactUsername: action.contactUsername,
            }
        case 'SET_SINGLE_CHAT':
            return {
                ...state,
                contact: action.contact,
                status: 'loaded'
            }
        case 'SET_SINGLE_CONTACT_ONLINE_STATUS':
            return {
                ...state,
                contactOnlineStatus: action.status,
            }
        case 'SET_SINGLE_CHAT_MESSAGES':
            return {
                ...state,
                messages: action.messages,
            }
        case 'SET_SINGLE_CHAT_STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'SET_RECEIVED_NEW_MESSAGE':
            if (state.contactUsername == action.data.audiencer || state.contactUsername == action.data.writer) {
                let chatMessages = state.messages
                chatMessages.push(action.data)
                return {
                    ...state,
                    messages: chatMessages
                }
            }

        case 'SET_CHAT_NEW_MESSAGE':
            return {
                ...state,
                tempMessage: {
                    message: action.message,
                    userID: action.userID
                }
            }

        case 'SEND_CHAT_NEW_MESSAGE':
            let chatMessages = state.messages
            chatMessages.push({
                isSystem: false,
                content: state.tempMessage.message,
                writerID: state.tempMessage.userID,
                created_at: new Date()
            })
            return {
                ...state,
                messages: chatMessages
            }
        case 'SET_SINGLE_CHAT_IS_LOADING':
            return {
                ...state,
                isLoading: action.status
            }
        case 'RESET_SINGLE_SELECTED_CHAT':
            return {
                status: 'select',
                isLoading: false,
                messages: null,
                contact: null,
                contactUsername: null
            }
        case 'RESET_CHAT_FILE':
            return {
                ...state,
                attachments: []
            }
        case 'SET_UPLOADED_FILE_ON_CHAT':
            return {
                ...state,
                attachments: [action.file]
            }
        case 'RESET_UPLOADED_FILE_ON_CHAT':
            return {
                ...state,
                attachments: []
            }
        case 'REMOVE_A_FILE_FROM_CHAT':
            return {
                ...state,
                attachments: []
            }
        case 'RESET_SELECTED_CONTACT_USERNAME':
            return {
                ...state,
                contactUsername: null
            }
        default:
            return state
    }
}