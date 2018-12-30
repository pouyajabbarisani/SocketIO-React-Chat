import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropzone from "react-dropzone"
import * as actions from 'actions'
var alertify
import requester from '../scripts/requester'
import config from '../config.js'


class ChatUploader extends Component {
    constructor(props) {
        super(props)
        this.uploadedFilesLoader = this.uploadedFilesLoader.bind(this)
        this.uploadingFileLoader = this.uploadingFileLoader.bind(this)
        this.uploadedFileRemove = this.uploadedFileRemove.bind(this)
        this.state = { uploading: false }
    }
    async componentDidMount() {
        this.props.actions.resetChatFile()
        alertify = await require('alertify.js')
    }

    uploadedFilesLoader() {
        if (typeof this.props.singleChatReducer != 'undefined' && typeof this.props.singleChatReducer.attachments != 'undefined') {
            if (this.props.singleChatReducer.attachments.length > 0) {
                console.log('lengthhhh', this.props.singleChatReducer.attachments.length)
                console.log('lengthhhh1', this.props.singleChatReducer.attachments)
                return (
                    <div id="chat-uploaded-files-container" className="grid-x">
                        {this.props.singleChatReducer.attachments.map((singleUploaded, index) => <div className="single-uploaded-file" key={index}>
                            <div className="file-delete-icon" onClick={() => this.uploadedFileRemove(index)}>
                                <i className="fas fa-times"></i>
                            </div>
                            <a href={config.serverurl + singleUploaded} target="_blank"><p className="chat-attached-file-text">فایل پیوست شده</p></a>
                        </div>)}
                    </div>
                )
            }
        }
    }

    uploadedFileRemove(index) {
        this.props.actions.removeAFileFromChat(index)
    }

    uploadingFileLoader() {
        if (this.state.uploading == true) {
            return (
                <span className="chat-uploading-text">در حال آپلود... (تا آپلود شدن کامل صبر کنید)</span>
            )
        }
        else {
            return (
                <i className="fas fa-paperclip" title="افزودن فایل یا عکس"></i>
            )
        }
    }

    render() {
        return (
            <div id="chat-attachment-btn">
                {(this.props.singleChatReducer.attachments && this.props.singleChatReducer.attachments.length > 0) ? <span className="display-none"></span> : <Dropzone

                    accept="image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/x-msvideo, video/x-flv, video/x-ms-wmv, audio/mp4, audio/mpeg, video/quicktime"
                    maxSize={5242880}
                    onDrop={async (accepted, rejected) => {
                        if (rejected.length) {
                            for (var j = 0; j < rejected.length; j++) {
                                if (rejected[j].size >= 5242880) {
                                    alertify.okBtn("باشه").alert(rejected[j].name + ": خطا:‌ حجم فایل باید کمتر از 5 مگابایت باشد.")
                                } else {
                                    alertify.okBtn("باشه").alert(rejected[j].name + ": خطا: فرمت فایل انتخاب شده مجاز نیست.")
                                }
                            }
                        }
                        if (accepted.length) {
                            if (accepted.length > 1 || this.props.singleChatReducer.attachments > 0) {
                                alertify.okBtn("باشه").alert("خطا: حداکثر یک فایل می توانید اضافه کنید.")
                            }
                            else {
                                let authUserID = await localStorage.getItem('usrid')
                                var photosformdata = new FormData()
                                this.setState({ uploading: true })
                                for (let singleAccepted of accepted) {
                                    photosformdata.append("file", singleAccepted)
                                }
                                let filesResult = await requester(config.serverurl + 'chats/upload', 'POST', true, null, photosformdata, true)
                                if (filesResult.statusCode == 200 || filesResult.statusCode == 201) {
                                    this.props.actions.setUploadedFileOnChat(filesResult.data.file)
                                    this.setState({ uploading: false })
                                }
                                else {
                                    this.setState({ uploading: false })
                                    alertify.okBtn("باشه").alert("خطایی در بارگزاری فایل به وجود آمد، لطفا دوباره تلاش کنید.")
                                }
                            }
                        }
                    }}
                >

                    {this.uploadingFileLoader()}

                </Dropzone>}
                {this.uploadedFilesLoader()}
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        singleChatReducer: state.singleChatReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(ChatUploader))