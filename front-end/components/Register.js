import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from 'actions'
var alertify
import CustomInput from './CustomInput'
import CustomButton from './CustomButton'
import { Link } from 'react-router-dom'
import requester from '../scripts/requester'
import isExist from '../scripts/is-exist'
import config from '../config.js'



class Register extends Component {
    constructor(props) {
        super(props)
        this.checkUsernameExist = this.checkUsernameExist.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this)
        this.onRegisterClick = this.onRegisterClick.bind(this)
    }

    componentDidMount() {
        document.title = 'ثبت نام'
        alertify = require('alertify.js')
        localStorage.removeItem('tkn')
        localStorage.removeItem('username')
    }


    async checkUsernameExist(e) {
        let enteredUsername = e.target.value

        if (enteredUsername != '') {

            let checkUsernameResult = await requester(config.serverurl + 'auth/usernamecheck/' + enteredUsername, 'GET', false, 'application/json')

            if (checkUsernameResult.statusCode == 200) {
                this.props.actions.usernameExistStatus(true) // is exist
            }
            else if (checkUsernameResult.statusCode == 404) {
                this.props.actions.usernameExistStatus(false) // not exist - ability to use this mail
                this.props.actions.setFieldValueOnRegister('username', enteredUsername)
            }
            else {
                this.props.actions.usernameExistStatus(false) // unsuccesful request - allow to use this email as default
                this.props.actions.setFieldValueOnRegister('username', enteredUsername)
            }
        }
        else {
            this.props.actions.usernameExistStatus(false)
        }
    }

    onPasswordChange(e) {
        if (e.target.value.length < 6) {
            this.props.actions.passwordLengthStatus(true) // activate password error
        }
        else {
            this.props.actions.passwordLengthStatus(false) // activate password error
            this.props.actions.setFieldValueOnRegister('password', e.target.value)
        }
    }

    onPasswordConfirmChange(e) {
        if (e.target.value.length > 0) {
            if (e.target.value != this.props.registerFieldsReducer.password) {
                this.props.actions.passwordConfirmStatus(true) // activate password error
            }
            else {
                this.props.actions.passwordConfirmStatus(false) // activate password error
            }
        }
        else {
            this.props.actions.passwordConfirmStatus(false) // activate password error
        }
    }

    async onRegisterClick() {
        this.props.actions.setLoadingStatusOnRegistration(true)

        let incompleteFields = []


        !isExist(this.props.registerFieldsReducer.username) && await incompleteFields.push('فیلد نام کاربری ناقص است')
        this.props.registerFieldsReducer.usernameExist == true && await incompleteFields.push('قبلا یک حساب کاربری با این نام کاربری ایجاد شده است')

        !isExist(this.props.registerFieldsReducer.nameAndFamily) && await incompleteFields.push('فیلد اسم کامل ناقص است')

        !isExist(this.props.registerFieldsReducer.password) && await incompleteFields.push('فیلد گذرواژه ناقص است')
        isExist(this.props.registerReducer.passwordError) && await incompleteFields.push('فیلد گذرواژه باید بیشتر یا مساوی ۶ حرف باشد')
        isExist(this.props.registerReducer.passwordConfirmError) && await incompleteFields.push('فیلد تکرار گذرواژه باید برابر با فیلد گذرواژه باشد')

        if (!incompleteFields.length) {

            let newUserObject = this.props.registerFieldsReducer

            var inviter = await localStorage.getItem('inviter')

            if (inviter && typeof inviter != 'undefined') {
                newUserObject.invitedBy = inviter
            }

            let registerResult = await requester(config.serverurl + 'auth/register', 'POST', false, 'application/json', newUserObject)

            if (registerResult.statusCode == 200 || registerResult.statusCode == 201) {
                this.props.actions.setLoadingStatusOnRegistration(false)
                localStorage.setItem('tkn', await registerResult.data.token)
                localStorage.setItem('username', await registerResult.data.username)
                this.props.history.push('/chat')
            }
            else if (registerResult.statusCode == 400) {
                this.props.actions.setLoadingStatusOnRegistration(false)
                let serverResultError = registerResult.data.error
                alertify.okBtn("باشه").alert("<strong>خطا:</strong> " + serverResultError)
            }
            else {
                this.props.actions.setLoadingStatusOnRegistration(false)
                alertify.okBtn("باشه").alert("<strong>خطا:</strong> " + ' خطایی در ارتباط با سرور به وجود آمد لطفا دوباره تلاش کنید.')
            }
        }
        else {

            let errorsMessage = ''
            for (let singleError of incompleteFields) {
                errorsMessage = errorsMessage + " - " + singleError + "<br/>"
            }

            this.props.actions.setLoadingStatusOnRegistration(false)

            alertify.okBtn("باشه").alert("<strong>خطا:</strong> <br/> " + errorsMessage)
        }

    }

    render() {

        return (
            <div id="page-container">

                <div className="auth-container grid-x">
                    <div className="cell large-20 medium-20 small-20">
                        <h1><i className="fas fa-user-plus"></i> ایجاد حساب کاربری</h1>
                    </div>


                    <div className="cell large-20 medium-20 small-20 grid-x">

                        <CustomInput
                            type="text"
                            id="username"
                            name="username"
                            fullwidth="true" // @boolean
                            label="نام کاربری:"
                            placeholder="انگلیسی: مثلا alimohammadi"
                            required="true"
                            onblur={(e) => this.checkUsernameExist(e)}
                            allowed="username"
                            alertMessage={(this.props.registerReducer.usernameExist == true) ? 'نام کاربری تکراری است. لطفا نام کاربری دیگری وارد کنید.' : ''}
                        />

                        <CustomInput
                            type="text"
                            id="nameAndFamily"
                            name="nameAndFamily"
                            fullwidth="true" // @boolean
                            label="اسم کامل:"
                            placeholder="فارسی:‌ مثلا علی محمدی"
                            required="true"
                            onchange={(e) => this.props.actions.setFieldValueOnRegister('nameAndFamily', e.target.value)}
                        />

                        <CustomInput
                            type="password"
                            id="password"
                            name="password"
                            fullwidth="true" // @boolean
                            label="گذرواژه:"
                            placeholder="رمز حداقل ۶ رقمی"
                            required="true"
                            onchange={(e) => this.onPasswordChange(e)}
                            alertMessage={(this.props.registerReducer.passwordError == true) ? 'گذرواژه حداقل باید ۶ حرفی باشد.' : ''}
                        />

                        <CustomInput
                            type="password"
                            id="passwordconfirm"
                            name="passwordconfirm"
                            fullwidth="true" // @boolean
                            label="تکرار گذرواژه:"
                            placeholder="تکرار گذرواژه"
                            required="true"
                            onchange={(e) => this.onPasswordConfirmChange(e)}
                            alertMessage={(this.props.registerReducer.passwordConfirmError == true) ? 'تکرار گذرواژه با گذرواژه مطابقت ندارد.' : ''}
                        />
                    </div>

                    <div className="cell large-20 medium-20 small-20 grid-x">
                        <div className=" cell large-20 medium-20 small-20">
                            <div className="register-actions-margin">
                                <CustomButton color="blue" text="ایجاد حساب کاربری" onclick={this.onRegisterClick} loading={this.props.registerReducer.isLoading} />
                            </div>

                            <div className="low-letter-space"><span className="small-text light-opacity margin-left">قبلا نام نویسی کرده اید؟ </span> <Link className="small-text" to="login">ورود</Link></div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}



function mapStateToProps(state, ownProps) {
    return {
        registerReducer: state.registerReducer,
        registerFieldsReducer: state.registerFieldsReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(Register))