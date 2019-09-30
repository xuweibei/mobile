/**支付页面 */
import React from 'react';
import {connect} from 'react-redux';
import './PayMoney.less';
import {dropByCacheKey} from 'react-router-cache-route';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {InputGrid} from '../../../../../common/input-grid/InputGrid';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {appHistory, getUrlParam, native, systemApi: {setValue, getValue, removeValue}, supple, showFail, showInfo} = Utils;
const {urlCfg} = Configs;
const hybird = process.env.NATIVE;
const mode = [
    {
        title: 'CAM余额',
        value: 0,
        imgName: 'balance-cam'
    },
    {
        title: '微信支付',
        value: 1,
        imgName: 'we-chat'
    },
    {
        title: '支付宝支付',
        value: 2,
        imgName: 'alipay'
    }
];

class PayMoney extends BaseComponent {
    state = {
        pwsPopup: false, //CAM消费支付密码弹窗
        selectIndex: 0, //支付类型
        listArr: [], //支付数据
        orderId: decodeURI(getUrlParam('orderId', encodeURI(this.props.location.search))), //支付所需订单id
        orderNum: decodeURI(getUrlParam('orderNum', encodeURI(this.props.location.search))), //支付所需订单编号
        source: decodeURI(getUrlParam('source', encodeURI(this.props.location.search))),
        money: decodeURI(getUrlParam('money', encodeURI(this.props.location.search)))
    };

    componentWillMount() {
        //这里是为了控制原生右滑退出
        this.props.setReturn(true);
    }

    componentDidMount() {
        const selfOrder = decodeURI(getUrlParam('selfOrder', encodeURI(this.props.location.search)));
        const arrInfo = JSON.parse(getValue('orderInfo'));
        if (arrInfo) { //如果是有arrInfo代表是直接下单或者从购物车过来的
            const date = (new Date().getTime() + 86400000) / 1000 - 1;
            const selfDate = (new Date().getTime() + 1800000) / 1000;
            this.getLastTime(selfOrder === 'null' ? date : selfDate);
            this.setState({
                orderNum: arrInfo.order,
                listArr: arrInfo
            });
            this.setState({
                maturityTme: date //到期时间
            });
        } else { //这里表示从线上订单点击付款过来的
            this.getList(true);
        }
    }

    componentWillReceiveProps(data, value) {
        //原生右滑退出处理
        if (!data.returnStatus) {
            this.goBackModal();
        }
    }

    //获取数据
    getList = (onOff) => {
        const {orderId, source, orderNum} = this.state;
        const arr = [];
        const that = this;
        this.fetch(urlCfg.payRightInfo, {
            method: 'post',
            data: {order_id: orderId},
            source: source //订单入口
        }).subscribe(res => {
            if (res.status === 0) {
                arr.push(orderNum);
                res.data.order = (orderNum === 'null' ? '' : arr);
                if (onOff) { //这里是为了区分首次进来和继续支付
                    this.setState({
                        listArr: res.data
                    });
                }
                that.setState({
                    maturityTme: res.data.enddate //到期时间
                }, () => that.getLastTime(res.data.enddate));
            }
        });
    };

    //获取剩余时间
    getLastTime = (time) => {
        const that = this;
        const orderId = decodeURI(getUrlParam('orderId', encodeURI(this.props.location.search)));
        const arrInfo = JSON.parse(getValue('orderInfo'));
        const timeH = time * 1000;
        let timer = null;
        function getDate() {
            const oDate = new Date();//获取日期对象
            const oldTime = oDate.getTime();//现在距离1970年的毫秒数
            let second = Math.floor((timeH - oldTime) / 1000);//未来时间距离现在的秒数
            second %= 86400;//余数代表剩下的秒数；
            const hour = Math.floor(second / 3600);//整数部分代表小时；
            second %= 3600; //余数代表 剩下的秒数；
            const minute = Math.floor(second / 60);
            second %= 60;
            const str = supple(hour) + ':' + supple(minute) + ':' + supple(second);
            that.setState({
                remainingTime: str
            });
            if (supple(hour) === '00' && supple(minute) === '00' && supple(second) === '00') {
                clearInterval(timer);
                if (arrInfo) { //下单页过来的订单取消
                    that.fetch(urlCfg.dealMallorderbyno, {data: {deal: 0, id: orderId === 'null' ? '' : orderId, order_no: arrInfo && arrInfo.order, reason: '订单超时', reason_id: 5, type: orderId === 'null' ? 2 : 1}})
                        .subscribe((res) => {
                            if (res) {
                                if (res.status === 0) {
                                    showInfo('订单取消');
                                    appHistory.goBack();
                                }
                            }
                        });
                } else if (orderId !== 'null') { //订单列表过来的取消
                    that.fetch(urlCfg.delMallOrder, {data: {deal: 0, id: orderId, reason: '订单超时', reason_id: 5, type: orderId === 'null' ? 2 : 1}})
                        .subscribe((res) => {
                            if (res) {
                                if (res.status === 0) {
                                    showInfo('订单取消');
                                    appHistory.goBack();
                                }
                            }
                        });
                }
                //清除缓存
                removeValue('orderInfo');
                removeValue('orderArr');
            }
        }

        getDate();
        timer = setInterval(getDate, 1000);
        this.setState({
            timer
        });
    };

    //选择支付方式
    choicePay = (num) => {
        this.setState({
            selectIndex: num
        });
    };

    //立即支付
    payRightNow = () => {
        const {listArr, selectIndex} = this.state;
        //判断是否第三方支付还是CAM消费
        if (selectIndex === 0) {
            this.verifyPayword();
            return;
        }
        this.batchPayMoney(listArr, selectIndex);
        // if (listArr.order && listArr.order.length > 0) { //app合并付款
        //     this.batchPayMoney(listArr, selectIndex);
        // } else if (selectIndex === 1) { //微信支付
        //     this.wxPay(listArr, orderNum, selectIndex);
        // } else { //支付宝支付
        //     this.alipay(listArr, orderNum, selectIndex);
        // }
    };

    //支付平台判断
    paymentPlatform = () => {
        let num = '';
        if (hybird) {
            num = 1;
        } else {
            num = 2;
        }
        return num;
    }

    //合并付款
    batchPayMoney = (listArr, selectIndex) => {
        console.log(listArr, '水电费看了');
        // alert('合并付款');
        this.fetch(urlCfg.batchPayment, {method: 'post', data: {type: 1, payType: selectIndex === 1 ? 2 : 1, order_no: listArr.order}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (selectIndex === 1) { //微信
                        native('payWX', {qrCode: res.data.appPayRequest.qrCode, order_no: listArr.order[0], type: this.paymentPlatform(), payType: 2}).then((data) => {
                            native('goH5', {'': ''});
                            appHistory.replace(`/paymentCompleted?allPrice=${listArr.all_price}&types=${selectIndex}&deposit=${listArr.all_deposit}&if_express=${res.if_express}&batch=1`);
                        }).catch(data => {
                            native('goH5', {'': ''});
                            showFail(data.message);
                        });
                    } else {
                        native('payAliPay', {qrCode: res.data.appPayRequest.qrCode, order_no: listArr.order[0], type: this.paymentPlatform(), payType: 1}).then((data) => {
                            native('goH5', {'': ''});
                            appHistory.replace(`/paymentCompleted?allPrice=${listArr.all_price}&types=${selectIndex}&deposit=${listArr.all_deposit}&if_express=${res.if_express}&batch=1`);
                        }).catch(data => {
                            native('goH5', {'': ''});
                            showFail(data.message);
                        });
                    }
                    if (res.data.status === 1) {
                        showInfo(res.data.message);
                    }
                }
            });
    }

    //微信支付
    wxPay = (listArr, orderNum, selectIndex) => {
        // alert('微信支付');
        this.fetch(urlCfg.wechatPayment, {method: 'post', data: {type: 1, order_no: orderNum}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (hybird) {
                        const obj = {
                            prepayid: res.data.arr.prepayid,
                            appid: res.data.arr.appid,
                            partnerid: res.data.arr.partnerid,
                            package: res.data.arr.package,
                            noncestr: res.data.arr.noncestr,
                            timestamp: res.data.arr.timestamp,
                            sign: res.data.arr.sign
                        };
                        native('wxPayCallback', obj).then((data) => {
                            native('goH5', {'': ''});
                            appHistory.replace(`/paymentCompleted?allPrice=${listArr.all_price}&id=${listArr.order_id}&types=${selectIndex}&deposit=${listArr.deposit}&if_express=${res.data.if_express}`);
                        }).catch(data => {
                            native('goH5', {'': ''});
                            showFail(data.message);
                        });
                    } else {
                        // window.location.href = res.data.mweb_url;
                    }
                }
            });
    }

    //支付宝支付
    alipay = (listArr, orderNum, selectIndex) => {
        // alert('支付宝支付');
        this.fetch(urlCfg.alipayPayment, {method: 'post', data: {type: 1, order_no: orderNum}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (hybird) {
                        native('authInfo', res.data.response).then((data) => {
                            native('goH5', {'': ''});
                            setValue('orderId', listArr.order_id);
                            if (data.status === '0') {
                                appHistory.replace(`/paymentCompleted?allPrice=${listArr.all_price}&id=${listArr.order_id}&types=${selectIndex}&deposit=${listArr.deposit}&if_express=${res.data.if_express}`);
                            }
                        }).catch(data => {
                            native('goH5', {'': ''});
                            showFail(data.message);
                        });
                    } else {
                        // window.location.href = res.data.mweb_url;
                    }
                }
            });
    }

    //关闭支付弹窗 弹出信息弹窗
    closePopup = () => {
        this.setState({
            pwsPopup: false
        });
    }

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push(`/passwordPayment?pay=${1}`);
    }

    //CAM消费 支付
    inputGrid = (pwd) => {
        const {listArr, orderNum, selectIndex, money} = this.state;
        const id = orderNum || listArr.order;//判断是否存在redux
        this.setState({
            pwsPopup: false
        }, () => {
            this.fetch(urlCfg.campay, {method: 'post', data: {order_no: !listArr.order ? new Array(id) : id, pwd, money: listArr.all_price || money}})
                .subscribe(res => {
                    if (res.status === 0) {
                        appHistory.replace(`/paymentCompleted?&deposit=${res.data.capital}&id=${res.data.id}&allPrice=${res.data.total_fee}&types=${selectIndex}&if_express=${res.data.if_express}&batch=${res.data.id ? '0' : '1'}`);
                    }
                });
        });
    }

    //验证支付密码是否设置
    verifyPayword = (pwd) => {
        const {showConfirm} = this.props;
        this.fetch(urlCfg.memberStatus, {method: 'post', data: {types: 0, chk_pass: 0}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (res.data.status !== 0) { //status为0为已设置，其他都是未设置
                        showConfirm({
                            title: '您还未设置支付密码，是否前往设置',
                            callbacks: [null, () => {
                                appHistory.push(`/passwordPayment?pay=${1}`);
                            }]
                        });
                    } else {
                        this.setState({
                            pwsPopup: true
                        });
                    }
                }
            });
    }

    //页面卸载
    componentWillUnmount() {
        //返回弹框的回调是否显示
        setTimeout(() => {
            this.props.setReturn(false);
        });
    }

    //返回
    goBackModal = () => {
        const {maturityTme} = this.state;
        const {showConfirm} = this.props;
        const oDate = new Date();//获取日期对象
        const oldTime = oDate.getTime();//现在距离1970年的毫秒数
        let second = Math.floor((maturityTme * 1000 - oldTime) / 1000);//未来时间距离现在的秒数
        second %= 86400;//余数代表剩下的秒数；
        const hour = Math.floor(second / 3600);//整数部分代表小时；
        second %= 3600; //余数代表 剩下的秒数；
        const minute = Math.floor(second / 60);
        second %= 60;

        showConfirm({
            title: `您的订单在${supple(hour)}小时${supple(minute)}分钟内未支付将被取消，请尽快完成支付`,
            btnTexts: ['残忍拒绝', '继续支付'],
            callbacks: [() => {
                const {setOrderStatus} = this.props;
                const arrInfo = JSON.parse(getValue('orderInfo'));
                const arr = JSON.parse(getValue('orderArr'));
                if (arrInfo) {
                    if (arr[0].if_express === '1') {
                        appHistory.replace(`/myOrder/fk?type=${'car'}`);
                    } else {
                        setOrderStatus(1);
                        appHistory.replace(`/selfMention?type=${'car'}`);
                    }
                } else {
                    appHistory.goBack();
                }
                dropByCacheKey('OrderPage');//清除我的订单的缓存
                //清除缓存
                removeValue('orderInfo');
                removeValue('orderArr');
            }, () => {
                const {listArr} = this.state;
                if (listArr.order) {
                    this.getLastTime(maturityTme);
                } else {
                    this.getList();
                }
            }]
        });
        this.props.setReturn(true);
        //清除定时器
        clearInterval(this.state.timer);
    };

    render() {
        const {selectIndex, listArr, pwsPopup, remainingTime} = this.state;
        return (
            <div data-component="pay-money" data-role="page" className="pay-money">
                <AppNavBar
                    rightShow
                    title="订单支付"
                    goBackModal={this.goBackModal}
                />
                <div className="surplus">
                    <div
                        className="surplus-top"
                    >￥<span>{listArr.price || listArr.all_price}</span>
                    </div>
                    <div className="surplus-bottom">
                        <span className="remaining-time">支付剩余时间</span>
                        <span className="reciprocal">
                            {
                                remainingTime
                            }
                        </span>
                    </div>
                </div>

                <div className="payment-method-box">
                    {mode.map((item, index) => (
                        <div key={item.value} className="payment-method" onClick={() => this.choicePay(index)}>
                            <div className="distance">
                                <div className="pm-left">
                                    <div className={item.imgName}/>
                                    {/*<img src={item.Imgs}/>*/}
                                </div>
                                <div className="pm-center">{item.title}</div>
                                <div
                                    className={`icon ${index === selectIndex ? 'icon-Selection' : 'icon-Unselected'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className="binding">
                    <div className="binding-left">其他付款方式</div>
                    <div className="icon binding-right">绑定新卡</div>
                </div> */}

                <div className="promptly" onClick={this.payRightNow}>立即支付￥{listArr.price || listArr.all_price} </div>
                {/*CAM消费支付密码弹窗*/}
                {pwsPopup && (
                    <div className="enter-password-box">
                        <div className="enter-password">
                            <div className="command">
                                <span className="icon command-left" onClick={() => this.closePopup()}/>
                                <span className="icon command-center">请输入支付密码</span>
                                <span className="icon command-right" onClick={() => this.closePopup()}/>
                            </div>
                            <InputGrid focus onInputGrid={this.inputGrid}/>
                            <p onClick={() => this.forgetPws()}>忘记密码</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}


const mapStateToProps = state => {
    const my = state.get('my');
    const base = state.get('base');
    const shopCartState = state.get('shopCart');
    return {
        arr: shopCartState.get('orderArr'),
        orderInfo: my.get('orderState'),
        returnStatus: base.get('returnStatus')
    };
};

const mapDidpatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus,
    showConfirm: actionCreator.showConfirm,
    setReturn: actionCreator.setReturn
};

export default connect(mapStateToProps, mapDidpatchToProps)(PayMoney);
