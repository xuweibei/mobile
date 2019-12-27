/**核对银行卡页面 */


import React from 'react';
import './Check.less';
import {InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const hybird = process.env.NATIVE;
const {native} = Utils;
const {navColorF} = Constants;

export default class Check extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        if (hybird) { //设置tab颜色
            native('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            native('setNavColor', {color: navColorF});
        }
    }

    render() {
        return (
            <div className="check">
                <AppNavBar title="验证银行卡"/>
                <div className="bank-box">
                    <div className="input-field">
                        <div className="bank-num">
                            <InputItem
                                clear
                                placeholder="请输入银行卡号"
                            >银行卡号
                            </InputItem>
                        </div>
                        <div className="amount">
                            <InputItem
                                clear
                                placeholder="请输入收到的金额数字"
                            />
                            <span>发送验证金额</span>
                        </div>
                    </div>
                    <div className="hint">
                        <p>温馨提示</p>
                        <p>您需在发送验证金额的48小时内完成验证，请确保您的银行卡处于正常使用状态。</p>
                    </div>
                    <div className="next">下一步</div>
                </div>
            </div>
        );
    }
}
