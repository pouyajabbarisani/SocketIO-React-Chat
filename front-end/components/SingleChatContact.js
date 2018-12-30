import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from 'actions'
import config from '../config.js'
import { toPersian } from 'persian'


class SingleChatContact extends Component {
    constructor(props) {
        super(props)
        this.loadReadedStatus = this.loadReadedStatus.bind(this)
    }

    loadReadedStatus(count) {
        if (count) {
            return <span className="chat-new-pm" title="">{toPersian(count)}</span>
        }
        else {
            return (<span className="display-none"></span>)
        }
    }

    componentDidMount() {
        console.log(this.props.data)
    }
    render() {

        return (
            <div onClick={() => this.props.onselectchat(this.props.data._id)} key={this.props.index} className={false ? 'single-chat-contact selected-single-chat-contact cell large-20 medium-20 small-20' : 'single-chat-contact cell large-20 medium-20 small-20'}>
                <div className="single-chat-contact-image-container ">
                    {(() => {
                        if (this.props.data && this.props.data.profilePic && this.props.data.profilePic != '') {
                            return <img src={config.serverurl + this.props.data.profilePic} />
                        }
                        else {
                            return <img src="/public/images/avatar.jpg" />
                        }
                    })()}
                </div>
                <div className="single-chat-contact-text-container grid-x">
                    <div className="single-chat-contact-name cell large-16 medium-16 small-17 grid-x">
                        <p>{this.props.data.nameAndFamily}</p>
                    </div>
                    <div className="cell large-4 medium-4 small-3 grid-x single-chat-contact-unreaded-count">
                        {this.loadReadedStatus(this.props.data.unreaded)}
                    </div>
                    <div className="single-chat-contact-message cell large-20 medium-20 small-20 grid-x">
                        <p className="single-chat-contact-summary">{(this.props.data.lastMessage && this.props.data.lastMessage != '') ? (this.props.data.lastMessage.length > 21 ? this.props.data.lastMessage.substr(0, 21) + '...' : this.props.data.lastMessage) : ''}</p>
                    </div>
                </div>
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
)(SingleChatContact))