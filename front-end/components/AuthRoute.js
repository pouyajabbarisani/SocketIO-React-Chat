import React from 'react'
var { connect } = require('react-redux')
import { bindActionCreators } from 'redux'
import * as actions from 'actions'
import { Route, Redirect } from 'react-router-dom'
import config from '../config.js'


class AuthRoute extends React.Component {

    constructor(props) {
        super(props);
        this.checkAuthStatus = this.checkAuthStatus.bind(this);
    }

    componentDidMount() {

        this.checkAuthStatus();
    }

    async checkAuthStatus() {

        var theToken = localStorage.getItem('tkn');

        if (theToken) {
            try {
                let checkAuthResponse = await fetch(
                    config.serverurl + 'auth/authcheck',
                    {
                        method: 'GET',
                        headers: {
                            'x-access-token': theToken,
                        }
                    }
                );
                let checkAuthResult = await checkAuthResponse.json();

                if (checkAuthResult.statusCode == 200 || checkAuthResult.statusCode == 201) {
                    await this.props.actions.setAuthStatus(true);
                }
                else {
                    await this.props.actions.setAuthStatus(false);
                }
            } catch (err) {
                await this.props.actions.setAuthStatus(false);
            }
        }
        else {
            await this.props.actions.setAuthStatus(false);
        }
    }

    render() {
        if (typeof this.props.authReducer.status != 'undefined') {
            const { component: Component, ...rest } = this.props;
            return (
                <Route {...rest} render={props => {
                    return this.props.authReducer.status
                        ? <Component {...props} />
                        : <Redirect to="/login" />
                }} />
            )
        }
        else {
            return (
                <div id="authcheck-waiting-page">
                    <div className="centered-loading-box">
                        <div className="spinner-dark profile-page-loading center-text-align">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


function mapStateToProps(state, ownProps) {
    return {
        authReducer: state.authReducer
    }
}

function MapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    MapDispatchToProps
)(AuthRoute);