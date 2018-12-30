import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from 'actions'
var alertify
import CustomInput from './CustomInput'
import CustomButton from './CustomButton.js'
import { Link } from 'react-router-dom'
import requester from '../scripts/requester'
import config from '../config.js'
import isExist from '../scripts/is-exist'


class Login extends Component {
    constructor(props) {
        super(props)
        this.onLoginSubmit = this.onLoginSubmit.bind(this)
    }

    componentDidMount() {
        document.title = 'ورود'
        alertify = require('alertify.js')
        localStorage.removeItem('tkn')
        localStorage.removeItem('username')
    }

    async onLoginSubmit() {
        this.props.actions.setLoadingStatusOnLogin(true)

        let incompleteFields = []
        !isExist(this.props.loginFieldsReducer.username) && await incompleteFields.push('فیلد ایمیل ناقص است')
        !isExist(this.props.loginFieldsReducer.password) && await incompleteFields.push('فیلد گذرواژه ناقص است')

        if (!incompleteFields.length) {
            let loginObject = this.props.loginFieldsReducer

            let loginResult = await requester(config.serverurl + 'auth/login/', 'POST', false, 'application/json', loginObject)

            if (loginResult.statusCode == 200 || loginResult.statusCode == 201) {
                this.props.actions.setLoadingStatusOnLogin(false)
                localStorage.setItem('username', loginResult.data.username)
                localStorage.setItem('tkn', loginResult.data.token)
                this.props.history.push('/chat')
            }
            else if (loginResult.statusCode == 404) {
                this.props.actions.setLoadingStatusOnLogin(false)
                alertify.okBtn("باشه").alert("<strong>خطا:</strong> " + 'کاربری با نام کاربری فوق یافت نشد.')
            }
            else if (loginResult.statusCode == 403) {
                this.props.actions.setLoadingStatusOnLogin(false)
                alertify.okBtn("باشه").alert("<strong>خطا:</strong> " + 'گذرواژه اشتباه است.')
            }
            else {
                this.props.actions.setLoadingStatusOnLogin(false)
                alertify.okBtn("باشه").alert("<strong>خطا:</strong> " + ' خطایی در ارتباط با سرور به وجود آمد لطفا دوباره تلاش کنید.')
            }
        }
        else {
            let errorsMessage = ''
            for (let singleError of incompleteFields) {
                errorsMessage = errorsMessage + " - " + singleError + "<br/>"
            }
            this.props.actions.setLoadingStatusOnLogin(false)
            alertify.okBtn("باشه").alert("<strong>خطا:</strong> <br/> " + errorsMessage)
        }
    }

    render() {
        return (
            <div id="page-container">

                <div className="auth-container">
                    <h1><i className="fas fa-key"></i> ورود</h1>

                    <CustomInput
                        type="text"
                        name="username"
                        id="username"
                        fullwidth="true" // @boolean
                        label="نام کاربری:"
                        placeholder="مثلا pouyajabbarisani"
                        onchange={(e) => this.props.actions.setFieldValueOnLogin('username', e.target.value)}
                    />

                    <CustomInput
                        type="password"
                        name="password"
                        id="password"
                        fullwidth="true" // @boolean
                        label="گذرواژه:"
                        placeholder="۶ حرفی"
                        onchange={(e) => this.props.actions.setFieldValueOnLogin('password', e.target.value)}
                    />

                    <CustomButton color="blue" text="ورود به حساب کاربری" onclick={this.onLoginSubmit} loading={this.props.loginReducer.isLoading} />

                    <div><Link className="small-text" to="register">نام نویسی</Link></div>
                </div>

            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        loginReducer: state.loginReducer,
        loginFieldsReducer: state.loginFieldsReducer
    }
}

function MapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actions, dispatch) }
}

export default withRouter(connect(
    mapStateToProps,
    MapDispatchToProps
)(Login))