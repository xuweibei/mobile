import React from 'react';
import './index.less';

let defaultValue = '';
export default class NativeInput extends BaseComponent {
    componentDidMount() {
        alert(1);
    }

    state={
        closeOpen: false //是否开启清空按钮
    }

    //input变化事件
    nativeChange = () => {
        const {nativeChange} = this.props;
        this.setState({
            closeOpen: !!this.inputName.value
        });
        nativeChange(this.inputName.value);
    }

    //聚焦事件
    nativeOnfcus = () => {
        this.setState({
            closeOpen: !!this.inputName.value
        });
    }

    //失焦事件
    nativeOblur = () => {
        this.setState({
            closeOpen: false
        });
    }

    componentWillReceiveProps(next, prev) {
        console.log(next, prev, this.props, '克里斯丁');
        if (next.typeNumber !== this.props.typeNumber) {
            defaultValue = '';
            this.inputName.value = '';
            next.nativeChange(this.inputName.value);
        }
    }

    //点击清除输入内容
    nativeInputClose = () => {
        const {nativeChange} = this.props;
        this.inputName.value = '';
        nativeChange('');
        defaultValue = '';
        this.inputName.focus();
    }

    render() {
        const {nativeType, nativePla} = this.props;
        const {closeOpen} = this.state;
        return (
            <div className="native-input-css">
                <input
                    type={nativeType}
                    ref={i => { this.inputName = i }}
                    onChange={this.nativeChange}
                    placeholder={nativePla}
                    onFocus={this.nativeOnfcus}
                    onBlur={() => {
                        setTimeout(() => {
                            this.nativeOblur();
                        });
                    }}
                    onInput={() => {
                        const str = /^\d+(\.\d+)?$/;
                        if (!str.test(Number(this.inputName.value))) {
                            this.inputName.value = defaultValue;
                            return;
                        }
                        defaultValue = this.inputName.value;
                    }}
                />
                {closeOpen && <span onClick={this.nativeInputClose}>x</span>}
            </div>
        );
    }
}