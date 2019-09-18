/*
* cam转出 支付页面
* */
import {List, InputItem, Picker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {InputGrid} from '../../../../../common/input-grid/InputGrid';
import './ImportSum.less';

//消费支付方式
const seasons = [
    [
        {
            label: 'CAM转出',
            value: '0'
        },
        {
            label: '微信',
            value: '1'
        },
        {
            label: '支付宝',
            value: '2'
        }
    ]
];

const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;
const {appHistory, getUrlParam, showInfo, native} = Utils;
const hybird = process.env.NATIVE;

export default class importSum extends BaseComponent {
    state = {
        newsPopup: false, //支付信息是否弹窗
        pwsPopup: false, //支付密码是否弹窗
        money: 0, //转出金额
        sValueName: ['0'], //转出方式名字 默认cam转出
        uid: '', //获取uid
        shopName: '', //获取名称
        sValue: '0' //转出方式id
    };

    componentDidMount() {
        this.importSum();
    }

    //获取UID 店铺名称
    importSum = () => {
        //获取uid 姓名
        const uid = decodeURI(getUrlParam('uid', encodeURI(this.props.location.search)));
        const shopName = decodeURI(getUrlParam('shopName', encodeURI(this.props.location.search)));
        this.setState({
            uid,
            shopName
        });
    }

    //选择转出方式
    seleteKer = (res) => {
        // FIXME: 'CAM消费' 改成变量
        this.setState({
            sValue: res[0],
            sValueName: res
        });
    }

    //转出金额
    getInput = (res) => {
        this.setState({
            money: res
        });
    }

    //点击确定支付
    sumbit = () => {
        const {money} = this.state;
        if (!money) {
            showInfo(Form.No_Money);
        } else {
            this.setState({
                newsPopup: true
            });
        }
    }

    //点击立即支付
    pwsSubmit = () => {
        const {sValue, sValueName} = this.state;
        //sValue为0时，CAM消费 为1时微信支付
        if (sValueName.length === 0) {
            showInfo(Form.No_PayMoney);
            return;
        }
        if (sValue === '0') {
            this.setState({
                newsPopup: false,
                pwsPopup: true
            });
        } else if (sValue === '1') {
            this.wxPay(); // 微信支付
        } else if (sValue === '2') {
            this.alipay(); //支付宝支付
        }
    }

    //微信支付
    wxPay = () => {
        alert('微信支付');
        const {money, uid} = this.state;
        this.fetch(urlCfg.userpay, {method: 'post', data: {no: uid, money, flag: 1}})
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
                            appHistory.push(`/pay-camsucess?uid=${uid}&money=${money}`);
                        });
                    }
                }
            });
    }

    //支付宝支付
    alipay = () => {
        alert('支付宝支付');
        const {money, uid} = this.state;
        this.fetch(urlCfg.userpay, {method: 'post', data: {no: uid, money, flag: 0}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (hybird) {
                        native('authInfo', res.data.response).then((data) => {
                            appHistory.push(`/pay-camsucess?uid=${uid}&money=${money}`);
                        });
                    }
                }
            });
    }

    //密码输入 支付完成 （CAM消费）
    inputGrid = (pwd) => {
        const {money, uid} = this.state;
        this.fetch(urlCfg.userpay, {data: {no: uid, pwd, money, flag: 2}})
            .subscribe(res => {
                if (res.status === 0) {
                    appHistory.push(`/pay-camsucess?uid=${uid}&money=${money}`);
                }
            });
    }

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push('/password');
    }

    //关闭弹窗
    closePopup = () => {
        this.setState({
            newsPopup: false,
            pwsPopup: false
        });
    }

    //关闭支付弹窗 弹出信息弹窗
    closePopupUp = () => {
        this.setState({
            newsPopup: true,
            pwsPopup: false
        });
    }

    //返回按钮
    goBackModal = () => {
        //判断是否是扫码跳转过来的
        const nativeShow = decodeURI(getUrlParam('native', encodeURI(this.props.location.search)));
        if (nativeShow !== 'null') {
            native('goHome');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {sValueName, newsPopup, pwsPopup, uid, shopName, money} = this.state;
        return (
            <div data-component="import-sum" data-role="page" className="import-sum">
                <AppNavBar title="CAM转出" goBackModal={this.goBackModal}/>
                <div className="import-box">
                    <div className="username">
                        <p>{decodeURI(shopName)}</p>
                        <p>UID:{uid}</p>
                    </div>
                    <div className="money">
                        <List>
                            <InputItem
                                type="number"
                                clear
                                placeholder="请输转出金额"
                                onChange={(res) => this.getInput(res)}
                            />
                        </List>
                        <div className="large-button important" onClick={() => this.sumbit()}>确定</div>
                    </div>
                    {newsPopup && (
                        <div className="confirm-pay-box">
                            <div className="confirm-pay">
                                <div className="affirm">
                                    <span/>
                                    <span className="affirm-center">确认付款</span>
                                    <span className="icon affirm-right" onClick={() => this.closePopup()}/>
                                </div>
                                <div className="sum">￥<span>{money}</span></div>
                                <div>
                                    <div className="message">
                                        <span>订单信息</span>
                                        <span>转账</span>
                                    </div>
                                    <div className="mode">
                                        <Picker
                                            data={seasons}
                                            cascade={false}
                                            extra="请选择"
                                            value={sValueName}
                                            onOk={(res) => this.seleteKer(res)}
                                        >
                                            <List.Item arrow="horizontal">付款方式</List.Item>
                                        </Picker>
                                    </div>
                                </div>
                                <div className="large-button important" onClick={() => this.pwsSubmit()}>立即支付</div>
                            </div>
                        </div>
                    )}
                    {pwsPopup && (
                        <div className="enter-password-box">
                            <div className="enter-password">
                                <div className="command">
                                    <span className="icon command-left" onClick={() => this.closePopupUp()}/>
                                    <span className="icon command-center">请输入支付密码</span>
                                    <span className="icon command-right" onClick={() => this.closePopup()}/>
                                </div>
                                <InputGrid onInputGrid={this.inputGrid}/>
                                <p onClick={() => this.forgetPws()}>忘记密码</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
