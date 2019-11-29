import React from 'react';
import './index.less';

let defaultValue = '';
export default class NativeInput extends BaseComponent {
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

    //点击清除输入内容
    nativeInputClose = (ev) => {
        alert(1);
        const {nativeChange} = this.props;
        this.inputName.value = '';
        nativeChange('');
        ev.stopPropagation();
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
                    onBlur={this.nativeOblur}
                    onInput={() => {
                        const str = /^\d+(\.\d+)?$/;
                        console.log(this.inputName.value, '克里斯多夫');
                        console.log(!str.test(this.inputName.value), '考虑对方估计快了');
                        if (!str.test(this.inputName.value)) {
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