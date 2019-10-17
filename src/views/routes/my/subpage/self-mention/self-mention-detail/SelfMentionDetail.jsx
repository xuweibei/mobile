import React from 'react';
import {connect} from 'react-redux';
import './SelfMentionDetail.less';
import {List, Radio, TextareaItem, Modal, Tabs, InputItem} from 'antd-mobile';
import {myActionCreator as ActionCreator} from '../../../actions/index';
import {baseActionCreator} from '../../../../../../redux/baseAction';
import {shopCartActionCreator} from '../../../../shop-cart/actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {showFail, showInfo} from '../../../../../../utils/mixin';
import BaseComponent from '../../../../../../components/base/BaseComponent';

const {urlCfg} = Configs;
const {validator, setNavColor, appHistory, getUrlParam, systemApi: {setValue, getValue, removeValue}, getShopCartInfo, native} = Utils;
const {navColorF} = Constants;
const hybrid = process.env.NATIVE;

class ReDetail extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        modal: false, //自提弹窗是否弹出
        currentTab: 0, //当前自提日期的key
        valueItem: 0, //当前自提时间的key
        value: '请选择', //当前自提时间
        rdata: [{list: []}], //获取所有自提时间
        tabsr: [], //获取所有自提日期
        radioTreaty: false, //自提协议是否勾选
        OrderSelf: [], //获取自提数据
        alertPhone: 0, //自提手机号
        showPhone: true, //是否显示修改自提手机号
        goodsArr: [], //订单商品遍历
        shopdata: [], //店铺
        address: '', //门店地址
        textarea: '' //获取备注信息
    }

    componentWillMount() {
        if (hybrid) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentDidMount() {
        const {setOrder, location} = this.props;
        const timer = decodeURI(getUrlParam('time', encodeURI(location.search)));
        const obj = {'': ''};
        if (hybrid) {
            if (timer === 'null') { //非购物车进入时
                this.getOrderSelf();
            } else { //这里的情况是，原生那边跳转的时候，需要处理一些问题，所以就购物车过来的时候，存数据，这边取数据
                getShopCartInfo('getSelfMentio', obj).then(res => {
                    setOrder(res.data.arr);
                    this.getOrderSelf();
                });
            }
        } else {
            this.getOrderSelf();
        }
    }

    componentWillReceiveProps(next) {
        if (hybrid) {
            setNavColor('setNavColor', {color: navColorF});
        }
        const {setOrder, location} = this.props;
        const timerNext = decodeURI(getUrlParam('time', encodeURI(next.location.search)));
        const timer = decodeURI(getUrlParam('time', encodeURI(location.search)));
        if ((timerNext !== timer) && hybrid) {
            this.setState({
                modal: false, //自提弹窗是否弹出
                currentTab: 0, //当前自提日期的key
                valueItem: 0, //当前自提时间的key
                value: '请选择', //当前自提时间
                rdata: [{list: []}], //获取所有自提时间
                tabsr: [], //获取所有自提日期
                radioTreaty: false, //自提协议是否勾选
                OrderSelf: [], //获取自提数据
                alertPhone: 0, //自提手机号
                showPhone: true, //是否显示修改自提手机号
                goodsArr: [], //订单商品遍历
                shopdata: [], //店铺
                address: '', //门店地址
                textarea: '' //获取备注信息
            }, () => {
                getShopCartInfo('getSelfMentio', {'': ''}).then(res => {
                    setOrder(res.data.arr);
                    this.getOrderSelf();
                });
            });
        }
    }

    //自提数据获取
    getOrderSelf = () => {
        const {arr} = this.props;
        this.fetch(urlCfg.orderSelf, {
            data: {
                pr_arr: arr,
                type: arr[0].if_express === '3' ? '2' : '1'
            }
        })
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setState({
                        OrderSelf: res,
                        rdata: res.sufficiency.sufficiency_time,
                        tabsr: res.sufficiency.tabs,
                        alertPhone: res.phone,
                        goodsArr: res.data.data,
                        shopdata: res.data,
                        address: res.sufficiency.sufficiency_address,
                        onOffDisable: !res.sufficiency.sufficiency_address
                    });
                } else if (res.status === 1) {
                    showFail(res.message);
                }
            });
    }

    //自提协议radio是否勾选
    radioTreaty = () => {
        this.setState(prveState => ({
            radioTreaty: !prveState.radioTreaty
        }));
    }

    //点击选择自提时间
    showModal = (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            modal: true
        });
    }

    //关闭自提时间弹窗
    onClose = () => {
        this.setState({
            modal: false
        });
    }

    //选择自提时间
    radioChange = (value, valueItem) => {
        console.log('checkbox', value);
        this.setState({
            value,
            valueItem,
            modal: false
        });
    };

    //选择自提日期
    onChangeTab=(tab) => {
        this.setState({
            valueItem: null,
            currentTab: tab.key
        });
    }

    //切换修改预留手机号
    alertPhone = () => {
        this.setState(prevState => ({
            showPhone: !prevState.showPhone
        }));
    }

    //修改预留手机号
    getPhone = (res) => {
        this.setState({
            alertPhone: res
        });
    }

    //获取订单备注
    textarea = (data) => {
        this.setState({
            textarea: data
        });
    }

    renderContent = (key) => {
        key = Number(key);
        return (
            <div className="renderContent-wrap">
                {this.state.OrderSelf.sufficiency && (
                    <List>
                        {this.state.rdata[key].list && this.state.rdata[key].list.map(item => (
                            <div className="renderContent" key={item.value} onClick={() => this.radioChange(item.label, item.value)}>
                                {item.label}
                                <Radio
                                    checked={this.state.valueItem === item.value}
                                />
                            </div>
                        ))}
                    </List>
                )}
            </div>
        );
    }

    //立即付款
    submitSelf = () => {
        const {value, radioTreaty, alertPhone, currentTab, textarea, shopdata} = this.state;
        const {setOrderInfo, arr, carId} = this.props;
        const shopArr = [];
        // console.log(shopdata);
        shopArr.push({shop_id: shopdata.shop_id});
        if (shopdata.data.length > 0) {
            shopdata.data.forEach(items => {
                shopArr.forEach(data => {
                    if (Array.isArray(data.pr_arr)) {
                        data.pr_arr.push({pr_id: items.id, values: items.values, num: items.num, values_name: items.values_name});
                    } else {
                        data.pr_arr = [{pr_id: items.id, values: items.values, num: items.num, values_name: items.values_name}];
                    }
                });
            });
        }
        if ((value === '请选择' && arr[0].if_express !== '3')) {
            showInfo('请选择使用时间');
        } else if (!validator.checkPhone(alertPhone)) {
            showInfo('请输入正确的手机号');
        } else if (!radioTreaty) {
            showInfo('到店自提协议未同意');
        } else {
            //后端判断自提从哪里进入 类型
            let sou = 2;
            const source = decodeURI(getUrlParam('source', encodeURI(this.props.location.search)));
            if (source !== 'null') {
                sou = source;
            }
            this.fetch(urlCfg.orderSubmit, {
                data: {
                    shop_arr: shopArr,
                    white_phone: alertPhone,
                    day: currentTab,
                    timer: arr[0].if_express === '3' ? '' : value,
                    source: sou,
                    remarks: textarea,
                    car_id: carId,
                    type: arr[0].if_express === '3' ? '2' : '1'
                }
            })
                .subscribe((res) => {
                    if (res.status === 0) {
                        setOrderInfo(res);
                        appHistory.replace(`/payMoney?source=${sou}&selfOrder=1`);
                    }
                    setValue('orderInfo', JSON.stringify(res));
                });
        }
    }

    //点击弹出到店协议
    viewShopFile = (ev) => {
        const {showAlert} = this.props;
        showAlert({
            title: '这是到店协议',
            btnText: '好'
        });
        ev.stopPropagation();
    }

    goBackModal = () => {
        const timer = decodeURI(getUrlParam('time', encodeURI(this.props.location.search)));
        if (timer !== 'null') {
            native('goBack');
        } else if (appHistory.length() === 0) {
            appHistory.replace('/selfMention/yw');
        } else {
            appHistory.goBack();
        }
        const arr = JSON.parse(getValue('orderArr'));
        if (arr) {
            //清除缓存
            removeValue('orderArr');
        }
    }

    render() {
        const arr = JSON.parse(getValue('orderArr'));
        const {OrderSelf, radioTreaty, modal, tabsr, currentTab, value, alertPhone, showPhone, shopdata, goodsArr, address, textarea, onOffDisable} = this.state;
        return (
            <div data-component="Self-mentionDetail" data-role="page" className="Self-mentionDetail">
                <AppNavBar goBackModal={this.goBackModal} rightShow title="确认订单"/>
                <div className="store-address">
                    <div className="frame">
                        <div className="address-left">门店地址：</div>
                        <div className="address-center">{address || '暂无'}</div>
                    </div>
                    <div className="appointment">
                        {arr && arr[0].if_express === '3' ? (
                            <div className="time-number">
                                <div className="time-top">有效时间</div>
                                {OrderSelf.effective && (
                                    <div className="time-bottom-tow">{OrderSelf.effective.effective_time}</div>
                                )}
                            </div>
                        ) : (
                            <div className="time-number">
                                <div className="time-top">使用时间</div>
                                <div className="icon time-bottom" onClick={this.showModal}>{value}</div>
                            </div>
                        )}
                        <div className="time-number number">
                            <div className="time-top">预留手机</div>
                            {(showPhone) ? (<div className="icon time-alter" onClick={this.alertPhone}><p className="time-alter-text">{alertPhone}</p></div>)
                                : (
                                    <div>
                                        <InputItem
                                            className="showPhone"
                                            type="number"
                                            placeholder="请输入手机号"
                                            onChange={this.getPhone}
                                            onBlur={this.alertPhone}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className={`my-radio icon ${radioTreaty === true ? 'endorse' : ''}`} onClick={this.radioTreaty}>同意<span className="agreement" onClick={this.viewShopFile}>《到店自提协议》</span></div>
                </div>

                <div className="shop-lists">
                    <div className="shop-name">
                        <div className="shop-title">
                            <img src={shopdata.picpath} alt=""/>
                            <p>{shopdata.shopName}</p>
                            <div className="icon enter"/>
                        </div>
                        <div className="shop-name-right">营业时间{shopdata.open_time || '暂无'}</div>
                    </div>
                    {goodsArr.map(item => (
                        <div className="goods" key={item.id}>
                            <div className="goods-left">
                                <div>
                                    <img src={item.picpath}/>
                                </div>
                            </div>
                            <div className="goods-right">
                                <div className="goods-desc">
                                    <div className="desc-title">{item.title}</div>
                                    <div className="price">￥{item.price}</div>
                                </div>
                                <div className="goods-sku">
                                    <div className="sku-left">
                                        {item.values_name.split(',').map(vaName => <div className="goods-size">{vaName}</div>)}
                                    </div>
                                    <div className="sku-right">x{item.num}</div>
                                </div>
                                <div className="btn-keep">记账量：{item.deposit}</div>
                            </div>
                        </div>
                    ))}
                    <List>
                        <TextareaItem
                            value={textarea}
                            clear
                            title="订单备注"
                            placeholder="请和商家协商一致"
                            onChange={this.textarea}
                        />
                    </List>
                    <div className="shop-bottom">
                        <div className="right-bottom">
                            <div className="total-count">
                                总记账量：<span>{OrderSelf.all_deposit}</span>
                            </div>
                            <div className="total-price">
                                <div className="total-price-left">共{OrderSelf.all_pr_num}件商品</div>
                                <div className="total-price-right"><span>合计：</span><span className="money">{OrderSelf.all_price}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="altogether">
                    <div className="altogether-left">共{OrderSelf.all_pr_num}件</div>
                    <div className="altogether-center">
                        <span className="total-left">合计：</span>
                        <span className="total-right">￥{OrderSelf.all_price}</span>
                    </div>
                    <div className="altogether-right" onClick={this.submitSelf} disable={onOffDisable}>立即付款</div>
                </div>
                {arr && arr[0].if_express !== '3' && (
                    <Modal
                        popup
                        visible={modal}
                        onClose={this.onClose}
                        animationType="slide-up"
                        title="选择自提时间"
                        className="selection-time"
                    >
                        <Tabs
                            tabs={tabsr}
                            initialPage={currentTab}
                            tabBarPosition="left"
                            tabDirection="vertical"
                            onChange={(tab) => this.onChangeTab(tab)}
                        >
                            {this.renderContent(currentTab)}
                        </Tabs>
                    </Modal>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const shopCartState = state.get('shopCart');
    return {
        arr: shopCartState.get('orderArr'),
        carId: shopCartState.get('ids')
    };
};

const mapDispatchToProps = {
    setOrder: shopCartActionCreator.setOrder,
    setOrderInfo: ActionCreator.setOrderInformation,
    showAlert: baseActionCreator.showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(ReDetail);
