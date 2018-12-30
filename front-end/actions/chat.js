// ------- chats list

export var setChatsList = (contacts) => {
    return {
        type: 'SET_CHATS_LIST',
        contacts: contacts
    }
}
export var setChatsUsername = (usernmae) => {
    return {
        type: 'SET_CHATS_USERNAME',
        usernmae: usernmae
    }
}
export var setChatsListStatus = (status) => {
    return {
        type: 'SET_CHATS_LIST_STATUS',
        status: status
    }
}
export var setSearchContactsList = (contacts) => {
    return {
        type: 'SET_SEARCH_CONTACTS_LIST',
        contacts: contacts
    }
}
export var setContactsSearchTerm = (term) => {
    return {
        type: 'SET_CONTACTS_SEARCH_TERM',
        term: term
    }
}
export var increaseChatsCount = () => {
    return {
        type: 'INCREASE_CHATS_COUNT'
    }
}
export var setChatsLoadMoreButtonLoading = (status) => {
    return {
        type: 'SET_CHATS_LOAD_MORE_BUTTON_LOADING',
        status: status
    }
}
export var resetSingleSelectedChat = () => {
    return {
        type: 'RESET_SINGLE_SELECTED_CHAT'
    }
}
export var setChatResponsiveStatus = (status) => {
    return {
        type: 'SET_CHATS_RESPONSIVE_STATUS',
        status: status
    }
}
export var setSideChatStatus = (status) => {
    return {
        type: 'SET_SIDE_CHAT_STATUS',
        status: status
    }
}
export var setContactsListType = (listType) => {
    return {
        type: 'SET_CONTACTS_LIST_TYPE',
        listType: listType
    }
}


// --------- single chat

export var setSingelChatSelectedContactUsername = (username) => {
    return {
        type: 'SET_SINGLE_CHAT_SELECTED_CONTACT_USERNAME',
        username: username
    }
}
export var resetSelectedContactUsername = () => {
    return {
        type: 'RESET_SELECTED_CONTACT_USERNAME'
    }
}
export var setSingleChatIDOnSingleChat = (chatid) => {
    return {
        type: 'SET_SINGLE_CHAT_ID_ON_SINGLE_CHAT',
        chatid: chatid
    }
}
export var setSingleChat = (contact) => {
    return {
        type: 'SET_SINGLE_CHAT',
        contact: contact
    }
}
export var setSingleChatContactOnlineStatus = (status) => {
    return {
        type: 'SET_SINGLE_CONTACT_ONLINE_STATUS',
        status: status
    }
}
export var changeChatsEditProfileStatus = (status) => {
    return {
        type: 'CHANGE_CHATS_EDIT_PROFILE_STAUTS',
        status: status
    }
}
export var setSingleChatMessages = (messages) => {
    return {
        type: 'SET_SINGLE_CHAT_MESSAGES',
        messages: messages
    }
}
export var setSingleChatStatus = (status) => {
    return {
        type: 'SET_SINGLE_CHAT_STATUS',
        status: status
    }
}
export var setChatNewMessage = (message, userID) => {
    return {
        type: 'SET_CHAT_NEW_MESSAGE',
        message: message,
        userID: userID
    }
}
export var setReceivedNewMessage = (data) => {
    return {
        type: 'SET_RECEIVED_NEW_MESSAGE',
        data: data
    }
}

export var sendChatNewMessage = () => {
    return {
        type: 'SEND_CHAT_NEW_MESSAGE'
    }
}
export var setSingleChatIsLoading = (status) => {
    return {
        type: 'SET_SINGLE_CHAT_IS_LOADING',
        status: status
    }
}
export var resetSelectedChatID = () => {
    return {
        type: 'RESET_SELECTED_CHAT_ID'
    }
}


// upload 
export var resetChatFile = () => {
    return {
        type: 'RESET_CHAT_FILE'
    }
}
export var removeAFileFromChat = (index) => {
    return {
        type: 'REMOVE_A_FILE_FROM_CHAT',
        index: index
    }
}
export var setUploadedFileOnChat = (file) => {
    return {
        type: 'SET_UPLOADED_FILE_ON_CHAT',
        file: file
    }
}
export var resetUploadedFileOnChat = () => {
    return {
        type: 'RESET_UPLOADED_FILE_ON_CHAT'
    }
}
