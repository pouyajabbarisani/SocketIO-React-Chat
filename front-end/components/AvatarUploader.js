import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropzone from "react-dropzone"
import * as actions from 'actions'
var alertify
import requester from '../scripts/requester'
import config from '../config.js'
import ReactAvatarEditor from 'react-avatar-editor'
import CustomInput from './CustomInput'
import CustomButton from './CustomButton.js'
import b64toBlob from 'b64-to-blob'


class AvatarUploader extends Component {
    constructor(props) {
        super(props)
        this.onSaveChanges = this.onSaveChanges.bind(this)
        this.handleImageDelete = this.handleImageDelete.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.state = { image: null, imageScale: 1 }
    }


    async componentWillMount() {
        this.setState({ image: null, imageScale: 1 })
        alertify = await require('alertify.js')

        let defaultAvatarResult = await requester(config.serverurl + 'editprofile/avatar', 'GET', true, 'application/json')
        if (defaultAvatarResult.statusCode == 200) {
            this.setState({ image: config.serverurl + defaultAvatarResult.data.image })
        }
    }

    componentWillUnmount() {
        this.setState({ image: null, imageScale: 1 })
    }

    handleDrop(dropped) {
        this.setState({ image: dropped[0] })
    }

    async handleImageDelete() {
        let deleteAvatarResult = await requester(config.serverurl + 'editprofile/avatar', 'DELETE', true, 'application/json')
        if (deleteAvatarResult.statusCode == 200) {
            this.setState({ image: null })
        }
    }

    async onSaveChanges() {
        var imageCanvas = this.refs.avatareditor.getImageScaledToCanvas()
        var resultImage = await b64toBlob(imageCanvas.toDataURL('image/jpeg').split(',')[1], 'image/jpeg')
        var photosformdata = new FormData()
        photosformdata.append('file', resultImage, 'avatar.jpg');

        let filesResult = await requester(config.serverurl + 'editprofile/avatar', 'PUT', true, null, photosformdata, true)
        if (filesResult.statusCode == 200 || filesResult.statusCode == 201) {
            alertify.okBtn("باشه").alert("عکس جدید با موفقیت ذخیره شد.")
        }
        else {
            alertify.okBtn("باشه").alert("خطایی در بارگزاری فایل به وجود آمد، لطفا دوباره تلاش کنید.")
        }
    }


    render() {
        return (
            <div>
                <h3> ویرایش تصویر پروفایل</h3>

                <Dropzone
                    onDrop={this.handleDrop}
                    disableClick={this.state.image && this.state.image != '' ? true : false}
                    style={{ width: '250px', height: '250px' }}
                    accept="image/jpeg, image/png"
                    maxSize={1048576}
                    onDrop={this.handleDrop}
                    style={{ width: '250px', height: '250px' }}
                >

                    {this.state.image && this.state.image != '' ? <ReactAvatarEditor
                        ref="avatareditor"
                        width={200}
                        height={200}
                        image={this.state.image}
                        borderRadius={1000}
                        scale={Number(this.state.imageScale)}
                    /> : <div className="dropzone-no-image-box">عکس خود را اینجا بکشید<br />یا برای انتخاب عکس کلیک کنید.</div>}

                    {this.state.image && this.state.image != '' && this.state.image.name && this.state.image.name != "undefined" ? <div>
                        <label htmlFor="avatar-scale">بزرگنمایی:‌ </label>
                        <input id="avatar-scale" type="range" onChange={(e) => this.setState({ imageScale: Number(e.target.value) })} step="0.01" min="1" max="2" name="scale" value={Number(this.state.imageScale)} />
                    </div> : ''}

                    {this.state.image && this.state.image != '' && this.state.image.name && this.state.image.name != "undefined" ? <CustomButton color="blue" text="ذخیره" onclick={() => this.onSaveChanges()} /> : ''}
                    {this.state.image && this.state.image != '' ? <CustomButton color="light" text="حذف" onclick={() => this.handleImageDelete()} /> : ''}

                </Dropzone>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        // singleChatReducer: state.singleChatReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(AvatarUploader))