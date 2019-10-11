/**支付完成页面 */

import React from 'react';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import './PaymentCompleted.less';

const {appHistory, getUrlParam, native, systemApi: {getValue, removeValue}, setNavColor} = Utils;
const {navColorF} = Constants;
const hybrid = process.env.NATIVE;
const mode = [
    {
        title: 'CAM余额',
        value: '0',
        imgName: 'we-chat'
    },
    {
        title: '微信支付',
        value: '1',
        imgName: 'we-chat'
    },
    {
        title: '支付宝支付',
        value: '2',
        imgName: 'alipay'
    }
];

class PaymentCompleted extends BaseComponent {
    componentWillMOunt() {
        dropByCacheKey('OrderPage');//清除我的订单的缓存
        //清除缓存
        removeValue('orderInfo');
        removeValue('orderArr');
    }

    componentWillMount() {
        if (hybrid) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybrid) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    goToHome = () => {
        if (hybrid) {
            native('goHome');
        } else {
            appHistory.replace('/home');
        }
    }

    //查看订单
    seeOrderInfo = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search))); //订单id
        const express = decodeURI(getUrlParam('if_express', encodeURI(this.props.location.search))); //订单购买方式 线上 线下
        const batch = decodeURI(getUrlParam('batch', encodeURI(this.props.location.search))); //订单购买方式 线上 线下
        if (express === '1') { //线上
            if (batch === '1') { //线上批量付款
                appHistory.replace('/myOrder/fh');
            } else {
                appHistory.replace(`/listDetails?id=${id}`);
            }
        } else if (batch === '1') { //线下付款或线下批量付款
            appHistory.replace(`/selfMention?type=${'car'}`);
        } else {
            appHistory.replace(`/selfOrderingDetails?id=${id}`);
        }
        appHistory.reduction();
    }

    render() {
        const allPrice = decodeURI(getUrlParam('allPrice', encodeURI(this.props.location.search)));
        const deposit = decodeURI(getUrlParam('deposit', encodeURI(this.props.location.search)));
        const types = decodeURI(getUrlParam('types', encodeURI(this.props.location.search)));
        let str = '';
        mode.forEach(item => {
            if (item.value === types) {
                str = item.title;
            }
        });
        return (
            <div data-component="Payment-completed" data-role="page" className="Payment-completed">
                <AppNavBar goBackModal={this.seeOrderInfo} rightShow title="支付成功"/>
                <div className="finish">
                    <img src={require('../../../../../../assets/images/finish.png')} alt=""/>
                    <div className="finish-bottom">支付成功</div>
                </div>
                <div className="bill">
                    <div className="frame">
                        <div className="bill-top">
                            <span>记账量</span>
                            <span>+{deposit || getValue('orderInfo').all_deposit}</span>
                        </div>
                        <div className="bill-top center">
                            <span>支付方式</span>
                            <span>{str}</span>
                        </div>
                        <div className="bill-top">
                            <span>支付金额</span>
                            <span>￥{allPrice || getValue('orderInfo').all_price}</span>
                        </div>
                    </div>
                </div>
                {/* <div className="advise">我们将尽快安排发货，请您保持通讯畅通， 以便快递小哥能第一时间联系到您</div>  余丽让隐藏*/}
                <div className="instructions">
                    <div className="see" onClick={this.seeOrderInfo}>查看订单</div>
                    <div className="return" onClick={this.goToHome}>返回首页</div>
                </div>
            </div>
        );
    }
}

const mapDidpatchToProps = {
    setReturn: actionCreator.setReturn
};
export default connect(null, mapDidpatchToProps)(PaymentCompleted);
