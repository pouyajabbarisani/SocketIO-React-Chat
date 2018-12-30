
import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            href: '',
            fullwidth: false,
        }
    }

    componentWillMount() {
        (this.props.onclick && this.props.onclick != '') && this.setState({ onclick: this.props.onclick });
        (this.props.href && this.props.href != '') && this.setState({ href: this.props.href });
        (typeof this.props.fullwidth != 'undefined') && this.setState({ fullwidth: true });
    }


    render() {
        let fullwidthStyleClass = ''
        if (this.state.fullwidth == true) { fullwidthStyleClass = 'fullwidth-button ' }

        let disableStyleClass = ''
        if (this.props.loading == true) { disableStyleClass = 'disabled-button ' }


        // colors: blue, green, yellow, red, light, white
        if (this.state.href && this.state.href != '') {
            return (
                <Link to={this.state.href} className={'button' + fullwidthStyleClass + disableStyleClass} >{(this.props.loading == true) ? <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div> : this.props.text}</ Link>
            )
        }
        else {
            return (
                <button onClick={this.props.onclick} className={'button ' + fullwidthStyleClass + disableStyleClass} >{(this.props.loading == true) ? <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div> : this.props.text}</button>
            )
        }
    }
}

export default Button