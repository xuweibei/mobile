
import React from 'react';
import './PaySuccess.less';
import {urlCfg} from '../../../../../../configs';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {getUrlParam, showFail} = Utils;

export default class PaySuccess extends BaseComponent {
    state = {
        orderDetail: [] //数据
    }

    componentDidMount() {
        this.getSufficiency();
    }

    //获取数据
    getSufficiency = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.sufficiencyCode, {method: 'post', data: {id}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        orderDetail: res.data
                    });
                } else if (res.status === 1) {
                    showFail(res.message);
                }
            });
    }

    render() {
        const {orderDetail} = this.state;
        return (
            <div data-component="Pay-success" data-role="page" className="Pay-success">
                <AppNavBar rightShow title="立即使用"/>
                <div className="number">
                    <span className="number-left">您的自提码为</span>
                    <span className="number-right">
                        <span className="digit">{orderDetail.white_off}</span>
                    </span>
                </div>

                <div className="shop-plan">
                    <div className="shop-plan-top">
                        <span className="left-show">自提二维码</span>
                    </div>
                    <div className="shop-plan-center">
                        <img src={orderDetail.white_off_code} alt=""/>
                    </div>
                    <div className="shop-plan-bottom">使用方法：自提时请向商家出示此二维码完成核销</div>
                </div>

                <div className="reminder">
                    <div className="reminder-top">温馨提示</div>
                    <div className="reminder-bottom">在我的订单待发货页面也可查看自提码哦</div>
                </div>
            </div>
        );
    }
}
