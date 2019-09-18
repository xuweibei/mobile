/**我要开店页面 */


import React from 'react';
import './Agreement.less';
import {Flex, Radio} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {appHistory, showInfo} = Utils;
const {urlCfg} = Configs;

export default class Agreement extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        checked: false,
        text: ''
    }

    componentDidMount = () => {
        this.getAgreeMent();
    };

    //获取开店协议
    getAgreeMent = () => {
        this.fetch(urlCfg.getAgreeShop).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    text: res.data.shop_content
                });
            }
        });
    }

    changeStatus = () => {
        this.setState(prevState => ({
            checked: !prevState.checked
        }));
    }

    routeTo = () => {
        const {checked} = this.state;
        if (checked) {
            appHistory.push('/openShopPage');
        } else {
            showInfo('请先勾选开店协议');
            return;
        }
    }

    render() {
        const {checked, text} = this.state;
        return (
            <div data-component="agreement" data-role="page" className="agreement">
                <AppNavBar title="开店协议"/>
                <div className="agreement-bottom">
                    {text}
                </div>
                <div className="start">
                    <form>
                        {/*<input type="radio"/>*/}
                        <Flex.Item onClick={this.changeStatus}>
                            <Radio
                                className="my-radio"
                                checked={checked}
                            />
                        </Flex.Item>
                        <span>我已阅读并同意《开店协议》</span>
                    </form>
                    <div className="largeButton important" onClick={this.routeTo}>前往开店</div>
                </div>
            </div>
        );
    }
}
