import React, { Component } from 'react'
import isExist from '../scripts/is-exist'
import randomStringGenerator from '../scripts/random-string-generator'


class Input extends Component {

    constructor(props) {
        super(props)
        this.labelLoader = this.labelLoader.bind(this)
        this.inputLoader = this.inputLoader.bind(this)
        this.onBlurMethod = this.onBlurMethod.bind(this)
        this.onFocusMethod = this.onFocusMethod.bind(this)
        this.onChangeMethod = this.onChangeMethod.bind(this)
        this.onKeyUpMethod = this.onKeyUpMethod.bind(this)

        this.state = {
            type: null, // @string // can be select
            name: '', // @steing
            id: '', // @steing
            fullwidth: isExist(this.props.fullwidth) ? true : false, // @boolean
            halfwidth: isExist(this.props.halfwidth) ? true : false, // @boolean
            label: '', // @string
            placeholder: '', // @string
            default: '', // @string or @number
            inline: isExist(this.props.inline) ? true : false,
            randomString: randomStringGenerator(),
            required: false,
            selectedVal: this.props.default ? this.props.default : '',

            showGuideMessage: false,

            alertMessage: '',

        }
    }

    componentWillMount() {
        isExist(this.props.type) ? this.setState({ type: this.props.type }) : this.setState({ type: 'text' })
        isExist(this.props.name) ? this.setState({ name: this.props.name }) : this.setState({ name: this.state.randomString })
        isExist(this.props.id) ? this.setState({ id: this.props.id }) : this.setState({ id: this.state.randomString })
        isExist(this.props.label) && this.setState({ label: this.props.label })
        isExist(this.props.placeholder) && this.setState({ placeholder: this.props.placeholder })
        isExist(this.props.default) && this.setState({ default: this.props.default })
        isExist(this.props.guideMessage) && this.setState({ guideMessage: this.props.guideMessage })
        isExist(this.props.required) && this.setState({ required: true })

    }

    onBlurMethod(event) {
        typeof this.props.onblur == 'function' && this.props.onblur(event)
        this.setState({ showGuideMessage: false })
    }

    onFocusMethod(event) {
        this.setState({ showGuideMessage: true })
        typeof this.props.onfocus == 'function' && this.props.onfocus(event)
    }

    onChangeMethod(event) {
        typeof this.props.onchange == 'function' && this.props.onchange(event)
    }

    onKeyUpMethod(e) {
        if (isExist(this.props.allowed) && this.props.allowed == 'username') {
            e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '')
        }
        typeof this.props.onkeyup == 'function' && this.props.onkeyup(e)
    }

    labelLoader() {
        if (isExist(this.state.label)) {
            return (
                <div className="input-label-container"><label htmlFor={this.state.id} >{this.state.label}</label></div>
            )
        }
        else {
            return ''
        }
    }



    inputLoader() {
        if (this.state.type == 'textarea' || this.state.type == 'ta') {
            return (
                <textarea
                    name={isExist(this.state.name) ? this.state.name : this.state.randomString}
                    id={isExist(this.state.id) ? this.state.id : this.state.randomString}
                    onChange={this.props.onchange}
                    placeholder={(e) => this.state.placeholder}
                    onChange={(e) => this.onChangeMethod(e)}
                    onFocus={(e) => this.onFocusMethod(e)}
                    onBlur={(e) => this.onBlurMethod(e)}
                    placeholder={this.state.placeholder}
                    value={this.props.value}
                    defaultValue={this.state.default}
                >
                </textarea>
            )
        }
        else if (this.state.type == 'select' || this.state.type == 'selectbox' || this.state.type == "options") {

            return (
                <select
                    name={isExist(this.state.name) ? this.state.name : this.state.randomString}
                    id={isExist(this.state.id) ? this.state.id : this.state.randomString}
                    onChange={(e) => {
                        this.setState({ selectedVal: e.target.value })
                        this.onChangeMethod(e);
                    }}
                    onFocus={(e) => this.onFocusMethod(e)}
                    onBlur={(e) => this.onBlurMethod(e)}
                    value={this.state.selectedVal}
                >
                    <option value="">{isExist(this.state.placeholder) ? this.state.placeholder : 'انتخاب کنید'}</option>
                    {this.props.options.map((singelOption, index) =>
                        <option key={index} value={singelOption.value}>{singelOption.title}</option>
                    )}
                </select>
            )
        }
        else {
            return (
                <input
                    type={this.state.type}
                    name={isExist(this.state.name) ? this.state.name : this.state.randomString}
                    id={isExist(this.state.id) ? this.state.id : this.state.randomString}
                    placeholder={this.state.placeholder}
                    onChange={(e) => this.onChangeMethod(e)}
                    onFocus={(e) => this.onFocusMethod(e)}
                    onBlur={(e) => this.onBlurMethod(e)}
                    onKeyUp={(e) => this.onKeyUpMethod(e)}
                    defaultValue={this.props.default ? this.props.default : ''}
                />
            )
        }
    }

    render() {
        let inlineStyleLoader = ''
        if (this.state.inline == true) {
            inlineStyleLoader = 'inline-input '
        }

        let fullwidthStyleLoader = ''
        if (this.state.fullwidth == true) {
            fullwidthStyleLoader = 'fullwidth-input '
        }

        let halfwidthStyleLoader = ''
        if (this.state.halfwidth == true) {
            halfwidthStyleLoader = 'halfwidth-input '
        }

        return (
            <div className={'input-container ' + inlineStyleLoader + fullwidthStyleLoader + halfwidthStyleLoader}>
                {this.labelLoader()}
                {this.inputLoader()}
                {(this.state.showGuideMessage && isExist(this.props.guideMessage)) && <p className="input-guide-message">{this.props.guideMessage}</p>}
                {isExist(this.props.alertMessage) && <p className="input-alert-message">{this.props.alertMessage}</p>}
            </div>
        )
    }
}

export default Input