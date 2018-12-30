import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { toPersian } from 'persian'
import * as actions from 'actions'
var alertify
import CustomInput from './CustomInput'
import CustomButton from './CustomButton'
import jmoment from 'jalali-moment'
import { Link } from 'react-router-dom'
import requester from '../scripts/requester'
import config from '../config.js'
import SingleChatContact from './SingleChatContact.js'
import ChatUploader from './Uploader.js'
import EditProfile from './EditProfile.js'
import io from 'socket.io-client'


class Chats extends Component {
    constructor(props) {
        super(props)
        this.getChatsList = this.getChatsList.bind(this)
        this.getSingleChat = this.getSingleChat.bind(this)
        this.onSelectChat = this.onSelectChat.bind(this)
        this.sendNewMessage = this.sendNewMessage.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.chatsListRef = React.createRef();

        this.state = {
            socket: null
        }
    }

    componentWillMount() {
        this.props.actions.resetSingleSelectedChat()
    }

    async componentDidMount() {

        this.mounted = true;

        document.title = 'گفتگو ها'
        alertify = await require('alertify.js')

        if (this.mounted == true) {
            this.getChatsList()
        }
    }

    componentWillUnmount() {
        this.props.actions.changeChatsEditProfileStatus(false)
        this.mounted = false;
    }

    async getChatsList() {

        this.setState({
            socket: io.connect(config.serverurl, {
                query: { token: localStorage.getItem('tkn') }
            })
        })

        var that = this;
        this.state.socket.on('contacts', function (data, err) {
            if (typeof data != "undefined") {
                that.props.actions.setChatsList(data)
            }
        });

        this.state.socket.on('chat', function (data, err) {
            that.props.actions.setSingleChatMessages(data)
        });

        this.state.socket.on('chatContact', function (data, err) {
            that.props.actions.setSingleChat(data)
            that.chatsListRef.current && that.chatsListRef.current.scrollTo(0, that.chatsListRef.current.scrollHeight);
        });

        this.state.socket.on('chatContactOnlineStatus', function (data, err) {
            that.props.actions.setSingleChatContactOnlineStatus(data.status)
        });

        this.state.socket.on('newMessage', function (data, err) {
            that.props.actions.setReceivedNewMessage(data)
            that.chatsListRef.current.scrollTo(0, that.chatsListRef.current.scrollHeight);
        });

    }

    async getSingleChat() {
        var that = this;
        this.state.socket.emit('chat', { contactUsername: await that.props.singleChatReducer.contactUsername });
    }

    async sendNewMessage(e) {
        if (e.key === 'Enter' && (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)) {
            this.props.actions.setChatNewMessage(this.props.singleChatReducer.tempMessage.message + "\n", this.props.chatsReducer.username)
        }
        else if (e.key === 'Enter') {
            e.preventDefault()
            if ((this.props.singleChatReducer.tempMessage && this.props.singleChatReducer.tempMessage.message && this.props.singleChatReducer.tempMessage.message != '') || (this.props.singleChatReducer.attachments && this.props.singleChatReducer.attachments.length && this.props.singleChatReducer.attachments[0] != '')) {
                console.log(this.props.singleChatReducer)
                var that = this;
                var messageObject = {}
                messageObject.audiencer = await this.props.singleChatReducer.contactUsername
                if (this.props.singleChatReducer.tempMessage.message && this.props.singleChatReducer.tempMessage.message != '') {
                    messageObject.content = await this.props.singleChatReducer.tempMessage.message
                }
                if (this.props.singleChatReducer.attachments && this.props.singleChatReducer.attachments.length && this.props.singleChatReducer.attachments[0] != '') {
                    messageObject.media = await this.props.singleChatReducer.attachments
                }
                this.state.socket.emit('send', messageObject);
                this.props.actions.setChatNewMessage(null)
                this.props.actions.resetUploadedFileOnChat()
                this.refs.chatta.value = ''
            }
        }
    }

    async onSelectChat(contactUsername) {
        this.props.actions.setSingelChatSelectedContactUsername(await contactUsername)
        this.getSingleChat()
        this.props.actions.setChatResponsiveStatus('single')

        this.props.actions.setContactsSearchTerm(null)
        this.props.actions.setContactsListType('contacts')
        this.refs.searchinput.value = ''

    }

    async handleSearch(searchterm) {
        if (searchterm && searchterm != '') {
            this.props.actions.setContactsSearchTerm(searchterm)
            this.props.actions.setChatsListStatus('loading')

            let currentInfoResult = await requester(config.serverurl + 'contacts/search?term=' + searchterm, 'GET', true, 'application/json')
            if (currentInfoResult.statusCode == 200 || currentInfoResult.statusCode == 201) {
                this.props.actions.setSearchContactsList(currentInfoResult.data.contacts)
                this.props.actions.setContactsListType('searchcontacts')
                this.props.actions.setChatsListStatus('success')
            }
        }
        else {
            this.props.actions.setChatsListStatus('success')
            this.props.actions.setContactsSearchTerm(null)
            this.props.actions.setContactsListType('contacts')
        }
    }

    render() {
        return (
            <div id="chats-container" className="cell large-20 medium-20 small-20 grid-x">
                <div className={this.props.chatsReducer.responsiveStatus == 'single' ? "normal-padding-box-no-side-padding cell large-6 medium-7 small-20 grid-x hide-for-small-only" : "normal-padding-box-no-side-padding cell large-6 medium-7 small-20 grid-x"}>
                    <div id="chats-list-container" className="cell large-20 medium-20 small-20 grid-x">
                        <div id="contacts-header">
                            <div id="edit-profile-container">
                                <div id="edit-profile" title="ویرایش پروفایل" onClick={() => this.props.actions.changeChatsEditProfileStatus(true)}><i className="fas fa-user-edit"></i></div>
                            </div>
                            <div id="search-contact-input-container">
                                <input
                                    ref="searchinput"
                                    type="text"
                                    placeholder="جستجو بین کاربران..."
                                    onChange={(e) => this.handleSearch(e.target.value)} />
                            </div>
                        </div>
                        {(() => {
                            if (this.props.chatsReducer.status == 'error') {
                                return (<p className="center-light-text">مشکلی در بارگیری داده ها به وجود آمد!</p>)
                            }
                            else if (this.props.chatsReducer.status == 'success') {
                                if (this.props.chatsReducer.contactsListType == 'searchcontacts') {
                                    return <div className="cell large-20 medium-20 small-20 grid-x">{(this.props.chatsReducer.searchContacts && this.props.chatsReducer.searchContacts.length) ? this.props.chatsReducer.searchContacts.map((singleChatContact, index) => <SingleChatContact data={singleChatContact} onselectchat={this.onSelectChat} key={index} index={index} />) : <p className="center-light-text">موردی یافت نشد!</p>}</div>
                                }
                                else {
                                    return <div className="cell large-20 medium-20 small-20 grid-x">{(this.props.chatsReducer.contacts && this.props.chatsReducer.contacts.length) ? this.props.chatsReducer.contacts.map((singleChatContact, index) => <SingleChatContact data={singleChatContact} onselectchat={this.onSelectChat} key={index} index={index} />) : <p className="center-light-text">هنوز گفتگویی وجود ندارد!</p>}</div>
                                }
                            }
                            else {
                                return (
                                    <div className=" cell large-20 medium-20 small-20 grid-x">
                                        <div className="spinner-dark profile-page-loading center-text-align">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                </div>
                <div className={this.props.chatsReducer.responsiveStatus == 'list' ? "normal-padding-box-no-side-padding cell large-14 medium-13 small-20 grid-x hide-for-small-only" : "normal-padding-box-no-side-padding cell large-14 medium-13 small-20 grid-x"} >
                    {(() => {
                        if (this.props.singleChatReducer.status == 'select') {
                            return (
                                <div id="single-chat-container-select" className="cell large-20 medium-20 small-20 grid-x">
                                    <p className="single-chat-first-select-chat" onClick={() => console.log(this.props.chatsReducer)}>ابتدا یک گفتگو را انتخاب کنید.</p>
                                </div>
                            )
                        }
                        else if (this.props.singleChatReducer.status == 'loaded') {
                            return (
                                <div id="single-chat-container" className="cell large-20 medium-20 small-20 grid-x">
                                    <div className="single-chat-header grid-x">
                                        <div className="single-chat-header-info cell large-20 medium-20 small-17 grid-x">
                                            <div className="avatar-container">
                                                {(this.props.singleChatReducer.contact && this.props.singleChatReducer.contact.profilePic && this.props.singleChatReducer.contact.profilePic != '') ? <img src={config.serverurl + this.props.singleChatReducer.contact.profilePic} alt="avatar" /> : <img src={'/public/images/avatar.jpg'} alt="avatar" />}
                                            </div>
                                            <div>
                                                <p>{(this.props.singleChatReducer.contact && this.props.singleChatReducer.contact.nameAndFamily) ? this.props.singleChatReducer.contact.nameAndFamily : ''}</p>
                                                <span onClick={() => console.log(this.props.singleChatReducer)}>{(this.props.singleChatReducer && this.props.singleChatReducer.contactOnlineStatus) ? 'آنلاین' : 'آفلاین'}</span>
                                            </div>
                                        </div>
                                        <div className="cell small-3 show-for-small-only" >
                                            <span id="single-chat-back-btn" onClick={() => { this.props.actions.setChatResponsiveStatus('list'); this.props.actions.resetSelectedContactUsername(); }}>
                                                <i className="fas fa-angle-left"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="single-chat-body">
                                        <div className="single-chat-content-container" >
                                            <div ref="singleChatContents" className="single-chat-content grid-x" ref={this.chatsListRef}>
                                                {this.props.singleChatReducer.messages && this.props.singleChatReducer.messages.length ? this.props.singleChatReducer.messages.map((singlePM, index) => <div key={index} className={"cell large-20 medium-20 small-20"}>
                                                    <article className={(this.props.singleChatReducer.contact && (singlePM.writer == this.props.singleChatReducer.contact.username)) ? 'chat-contact-pm' : 'chat-user-pm'}>
                                                        {singlePM.media && singlePM.media != '' ? <a href={config.serverurl + singlePM.media} target="_blank">مشاهده فایل پیوست شده</a> : ''}
                                                        <p>{singlePM.content}</p>
                                                        <span className="date-span">{
                                                            (() => {
                                                                let mpDate = new Date(singlePM.created_at)
                                                                return toPersian(jmoment(mpDate).format('HH:mm jYYYY/jMM/jDD'))
                                                            })()
                                                        }</span>
                                                    </article>
                                                </div>) : ''}
                                            </div>
                                        </div>

                                        <div className="single-chat-send-message-container grid-x">
                                            <div className="cell large-20 medium-20 small-20 grid-x">
                                                <div className="cell large-17 medium-16 small-16">
                                                    <textarea
                                                        name="chat-ta"
                                                        id="chat-ta"
                                                        ref="chatta"
                                                        // value={(this.props.singleChatReducer.tempMessage && this.props.singleChatReducer.tempMessage.message) ? this.props.singleChatReducer.tempMessage.message : ''}
                                                        placeholder="نوشتن پیام..."
                                                        onChange={(e) => this.props.actions.setChatNewMessage(e.target.value, this.props.chatsReducer.username)}
                                                        onKeyPress={this.sendNewMessage}
                                                    >
                                                    </textarea>
                                                </div>
                                                <div className="cell large-3 medium-4 small-4">
                                                    <ChatUploader />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else if (this.props.singleChatReducer.status == 'loading') {
                            return (
                                <div id="single-chat-container-select" className="cell large-20 medium-20 small-20 grid-x">
                                    <div className="spinner-dark profile-page-loading center-text-align">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            // error
                            return (
                                <div id="single-chat-container-select" className="cell large-20 medium-20 small-20 grid-x">
                                    <p className="center-light-text">مشکلی در بارگیری داده ها به وجود آمد!</p>
                                </div>
                            )
                        }
                    })()}
                </div>

                {(this.props.chatsReducer.isEditPageOpen && this.props.chatsReducer.isEditPageOpen == true) ? <EditProfile /> : ''}

            </div>
        )
    }
}



function mapStateToProps(state, ownProps) {
    return {
        chatsReducer: state.chatsReducer,
        singleChatReducer: state.singleChatReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(Chats))