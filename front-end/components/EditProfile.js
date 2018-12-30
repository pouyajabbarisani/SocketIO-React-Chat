import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from 'actions'
var alertify
import requester from '../scripts/requester'
import config from '../config.js'
import CustomInput from './CustomInput'
import CustomButton from './CustomButton.js'
import AvatarUploader from './AvatarUploader.js'


class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.onSaveChange = this.onSaveChange.bind(this)
    }

    async componentDidMount() {
        alertify = await require('alertify.js')
        let currentInfoResult = await requester(config.serverurl + 'editprofile/userinfo', 'GET', true, 'application/json')
        if (currentInfoResult.statusCode == 200 || currentInfoResult.statusCode == 201) {
            this.props.actions.setCurrentUserNameOnEditProfile(await currentInfoResult.data.nameAndFamily)
        }
    }

    async onSaveChange() {
        if (!this.props.editProfileReducer.isButtonLoading) {
            if ((this.props.editProfileReducer.newName && this.props.editProfileReducer.newName != '') || (this.props.editProfileReducer.newPassword && this.props.editProfileReducer.newPassword != '')) {
                if (this.props.editProfileReducer.newPassword && this.props.editProfileReducer.newPassword != '' && this.props.editProfileReducer.newPassword.length < 6) {
                    alertify.okBtn("باشه").alert("گذرواژه باید حداقل ۶ حرف باشد.")
                }
                else {
                    this.props.actions.setButtonLoadingStatusOnEditProfile(true)
                    var editObject = {}
                    if (this.props.editProfileReducer.newName && this.props.editProfileReducer.newName != '') {
                        editObject.nameAndFamily = this.props.editProfileReducer.newName
                    }
                    if (this.props.editProfileReducer.newPassword && this.props.editProfileReducer.newPassword != '') {
                        editObject.password = this.props.editProfileReducer.newPassword
                    }

                    let updateUserInfo = await requester(config.serverurl + 'editprofile/userinfo', 'PUT', true, 'application/json', editObject)
                    if (updateUserInfo.statusCode == 200 || updateUserInfo.statusCode == 201) {
                        this.props.actions.setButtonLoadingStatusOnEditProfile(false)
                        alertify.okBtn("باشه").alert("تغییرات با موفقیت ذخیره شد.")
                        setTimeout(function () {
                            window.location.reload()
                        }, 2000)
                    }
                    else {
                        this.props.actions.setButtonLoadingStatusOnEditProfile(false)
                        alertify.okBtn("باشه").alert("مشکلی در ذخیره ی تغییرات به وجود آمد.")
                    }
                }
            }
        }
    }

    render() {
        return (
            <div id="edit-profile-page-container">
                <div id="edit-profile-page-close-button" title="بستن" onClick={() => this.props.actions.changeChatsEditProfileStatus(false)}>
                    <i className="fas fa-times"></i>
                </div>
                <div id="edit-profile-page-container-inner" className="grid-x flex-items-top">
                    <div className="cell large-20 medium-20 small-20">
                        <h1><i className="fas fa-user-edit"></i> ویرایش پروفایل</h1>
                    </div>
                    <div className="cell large-20 medium-20 small-20 grid-x">

                        <div className="cell large-7 medium-15 small-20">
                            <CustomInput
                                type="text"
                                name="nameAndFamily"
                                id="nameAndFamily"
                                fullwidth="true"
                                label="اسم کامل:"
                                placeholder="مثلا: پویا جباری ثانی"
                                default={(this.props.editProfileReducer.currentName) ? this.props.editProfileReducer.currentName : ''}
                                onchange={(e) => this.props.actions.setNewUserNameOnEditProfile(e.target.value)}
                            />

                            <CustomInput
                                type="password"
                                name="password"
                                id="password"
                                fullwidth="true"
                                label="گذرواژه جدید (اگر میخواهید تغییر دهید):"
                                placeholder="حداقل ۶ حرفی"
                                onchange={(e) => this.props.actions.setNewUserPasswordOnEditProfile(e.target.value)}
                            />

                            <CustomButton color="blue" text="ذخیره تغییرات" onclick={() => this.onSaveChange()} loading={this.props.editProfileReducer.isButtonLoading} />
                        </div>
                        <div className="cell large-10 large-offset-3 medium-20 small-20">
                            <AvatarUploader />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        editProfileReducer: state.editProfileReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(EditProfile))