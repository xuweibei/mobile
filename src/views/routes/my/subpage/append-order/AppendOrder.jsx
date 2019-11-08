/*
* 确认订单
* */
import {connect} from 'react-redux';
import {InputItem, List, Button, Icon} from 'antd-mobile';
import {myActionCreator as ActionCreator} from '../../actions/index';
import {shopCartActionCreator} from '../../../shop-cart/actions/index';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './AppendOrder.less';

const {appHistory, showFail, getUrlParam, getShopCartInfo, systemApi: {setValue, removeValue, getValue}, native} = Utils;
const {urlCfg} = Configs;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const kind = [
    {title: '企业'},
    {title: '个人'}
];
class appendOrder extends BaseComponent {
    state = {
        shopInfo: [],
        addressInfo: {},
        goodsCount: 0,
        goods: [],
        idCard: '', //身份证
        total: 0, // 总价
        totalCount: 0, //商品总数量
        files: {},
        order: [], //订单备注信息
        IDcard: [],
        date: now,
        self: true, //发票类型
        currentIndex: 0, //默认发票选中类型
        textInfo: '企业',
        invoiceStatus: false,  //发票弹框显示状态
        notAllow: true, //不支持提交状态
        invoice: [],
        invoiceIndex: '',
        invoiceName: '',
        invoiceNum: '',
        invoiceBank: '',
        invoiceAddress: '',
        bankCard: '',
        invoicePhone: ''
    };

    componentDidMount() {
        const {setOrder, setIds} = this.props;
        const timer = decodeURI(getUrlParam('time', encodeURI(this.props.location.search)));
        const that = this;
        const obj = {'': ''};
        if (process.env.NATIVE) {
            if (timer === 'null') { //非购物车进入的时候
                this.getOrderState();
            } else {
                getShopCartInfo('getInfo', obj).then(res => {
                    setOrder(res.data.arr);
                    setIds(res.data.cartArr);
                    that.getOrderState();
                });//原生方法获取前面的redux
            }
        } else {
            this.getOrderState();
        }
    }

    componentWillReceiveProps(next, data) {
        const {setOrder, setIds, location} = this.props;
        const timerNext = decodeURI(getUrlParam('time', encodeURI(next.location.search)));
        const timer = decodeURI(getUrlParam('time', encodeURI(location.search)));
        if (process.env.NATIVE && timer && timerNext !== timer) {
            this.setState({
                shopInfo: [],
                addressInfo: {},
                goodsCount: 0,
                goods: [],
                idCard: '', //身份证
                total: 0, // 总价
                totalCount: 0, //商品总数量
                files: {},
                order: {}, //订单备注信息
                IDcard: [],
                date: now,
                self: true, //发票类型
                currentIndex: 0, //默认发票选中类型
                textInfo: '企业',
                invoiceStatus: false,  //发票弹框显示状态
                notAllow: true, //不支持提交状态
                invoice: {},
                invoiceIndex: ''
            }, () => {
                getShopCartInfo('getInfo', {'': ''}).then(res => {
                    setOrder(res.data.arr);
                    setIds(res.data.cartArr);
                    this.getOrderState();
                });//原生方法获取前面的redux
            });
        }
    }

    componentWillUnmount() {
        const {saveAddress} = this.props;
        saveAddress('');
    }

    //地址页面跳转
    addressTo = () => {
        appHistory.push({pathname: '/address?from=order'});
    };

    //立即付款
    postOrder = () => {
        const {addressInfo, shopInfo, order, invoice} = this.state;
        const invoices = JSON.parse(getValue('invoices'));
        const orders = JSON.parse(getValue('order'));
        let remark;
        if (orders) {
            remark = orders;
        } else {
            remark = order;
        }
        const {address} = this.props;
        const source = decodeURI(getUrlParam('source', encodeURI(this.props.location.search)));
        let invoiceInfo;
        if (invoices) {
            invoiceInfo = invoices;
        } else {
            invoiceInfo = invoice;
        }
        if (!addressInfo && !address) {
            showFail('请选择您的收货地址');
            return;
        }
        const addArr = [];
        if (address) {
            addArr.push({
                ...address
            });
        } else {
            addArr.push({
                ...addressInfo
            });
        }

        const shopArr = shopInfo.map((item, index) => {
            const objTemp = {shop_id: item.shop_id, remarks: remark[index].toString(), invoice: invoiceInfo[index]};
            const prArr = [];
            if (item.data.length > 0) {
                item.data.forEach(value => {
                    prArr.push({pr_id: value.id, values: value.values, num: value.num, values_name: value.values_name});
                });
            }
            objTemp.pr_arr = prArr;
            return objTemp;
        });
        const {carId} = this.props;
        this.fetch(urlCfg.shopCartOrder, {
            data: {
                shop_arr: shopArr,
                add_arr: addArr,
                car_id: carId,
                source: Number(source)
            }
        }).subscribe((res) => {
            if (res && res.status === 0) {
                const {setOrderInfo} = this.props;
                setOrderInfo(res);
                setValue('orderInfo', JSON.stringify(res));//将订单相关数据存入locastage
                appHistory.replace('/payMoney');
                removeValue('invoices');
                removeValue('order');
            }
        });
    };

    // 跳转店铺首页
    goToShop = (id) => {
        appHistory.push({pathname: `/shopHome?id=${id}`});
    };

    //獲取備注信息
    getRemark = (val, index) => {
        const {order} = this.state;
        const array = order;
        array[index] = val;
        setValue('order', JSON.stringify(array));
        this.setState(prevState => {
            prevState.order = array;
            return {
                order: prevState.order
            };
        });
    };

    //总共几件商品
    totalCount = () => {
        const {goods} = this.state;
        let num = 0;
        goods.map(item => item.map(good => {
            num += Number(good.num);
        }));
        return num;
    };

    //获取订单页面数据
    getOrderState = () => {
        const {arr} = this.props;
        const {address} = this.props;
        let addressId;
        if (address) {
            addressId = address.id;
        }
        this.fetch(urlCfg.submitOrder, {
            data: {
                pr_arr: arr,
                type: 2,
                address_id: addressId
            }
        })
            .subscribe((res) => {
                if (res.status === 0) {
                    const array = [];
                    const cardArr = [];
                    const infoArry = [];
                    const invoice = [];
                    if (res.data) {
                        for (let i = 0; i < res.data.length; i++) {
                            array.push([]);
                            cardArr.push([]);
                            infoArry.push([]);
                            invoice.push([]);
                        }
                    }
                    this.setState({
                        total: res.all_price,
                        shopInfo: res.data,
                        addressInfo: res.addr,
                        files: array,
                        goods: res.data ? res.data.map(shop => shop.data.map(goods => goods)) : [],
                        IDcard: cardArr,
                        order: infoArry,
                        invoice
                    }, () => {
                        const {goods} = this.state;
                        if (goods && goods.length > 0) {
                            goods.forEach(item => {
                                if (item && item.length > 0) {
                                    if (item.some((value) => value.in_area === 0)) {
                                        this.setState({
                                            notAllow: false
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
    };

    //发票弹框显示状态
    showPanel = (index) => {
        this.setState({
            invoiceStatus: true,
            invoiceIndex: index
        });
    }

    //关闭发票弹框
    hidePanel = () => {
        this.setState({
            invoiceStatus: false,
            currentIndex: 0
        });
    }

    //切换发票选中类型
    checkIndex = index => {
        this.setState({
            currentIndex: index,
            invoiceNum: '',
            invoiceBank: '',
            invoiceAddress: '',
            bankCard: '',
            invoicePhone: ''
        }, () => {
            const currentIndex = this.state.currentIndex;
            if (currentIndex === 1) {
                this.setState({
                    self: false,
                    textInfo: '个人'
                });
            } else {
                this.setState({
                    self: true,
                    textInfo: '企业'
                });
            }
        });
    }

    //发票信息
    invoiceChange = (e, type) => {
        this.setState({
            [type]: e
        }, () => {
            const {invoiceIndex, invoice, currentIndex, invoiceName, invoiceNum, invoiceBank, invoiceAddress, bankCard, invoicePhone} = this.state;
            const array = invoice;
            array[invoiceIndex] = {
                invoice_type: 1,
                head_type: currentIndex + 1,
                name: invoiceName,
                tax_id: invoiceNum,
                bank: invoiceBank,
                enterprise_addr: invoiceAddress,
                bank_card_no: bankCard,
                enterprise_phone: invoicePhone
            };
            setValue('invoices', JSON.stringify(array));
            this.setState(prevState => {
                prevState.invoice = array;
                return {
                    invoice: prevState.invoice
                };
            });
        });
    }

    //保存发票
    saveInvoice = () => {
        this.setState({
            invoiceStatus: false
        });
    }

    goBackModal = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
            removeValue('invoices');
            removeValue('order');
        } else {
            appHistory.goBack();
            removeValue('invoices');
            removeValue('order');
        }
    }

    render() {
        const {shopInfo, addressInfo, total, self, currentIndex, textInfo, notAllow, invoiceStatus, invoice, invoiceIndex} = this.state;
        const {address} = this.props;
        const invoices = JSON.parse(getValue('invoices'));
        const orders = JSON.parse(getValue('order'));
        return (
            <div data-component="append-order" data-role="page" className="append-order">
                <AppNavBar goBackModal={this.goBackModal} title="确认订单"/>
                <div>
                    <div className="container">
                        {
                            addressInfo ? (
                                <div className="user-address" onClick={this.addressTo}>
                                    <div className="address-left">
                                        <div className="left-top">
                                            <span>{(address && address.linkname) || addressInfo.linkname}</span>
                                            <span>{(address && address.linktel) || addressInfo.linktel}</span>
                                        </div>
                                        <div className="left-bottom">{(address && address.address) || addressInfo.address}
                                        </div>
                                    </div>
                                    <div className="address-right">
                                        <Icon type="right" size="lg"/>
                                    </div>
                                </div>
                            ) : (
                                <div className="user-address" onClick={this.addressTo}>
                                    <span className="chose-add">请选择您的收货地址</span>
                                    <div className="address-right">
                                        <Icon type="right" size="lg"/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            shopInfo && shopInfo.map((shop, index) => (
                                <div className="shopCart-goods" key={shop.shop_id}>
                                    <div className="goods-top">
                                        <div className="shop-avatar">
                                            <div className="avatar"><img
                                                src={shop.picpath}
                                                onError={(e) => { e.target.src = shop.df_logo }}
                                                alt=""
                                                className="image"
                                            />
                                            </div>
                                            <span>{shop.shopName}</span>
                                        </div>
                                        <div className="top-enter">
                                            <span onClick={() => this.goToShop(shop.shop_id)}>进店</span>
                                        </div>
                                    </div>
                                    {
                                        shop && shop.data.map((goods) => (
                                            <React.Fragment>
                                                <div key={goods.id}>
                                                    <div className="distance-box">
                                                        <div className="distance">
                                                            <div className="goods-desc">
                                                                <div className="desc-left">
                                                                    <img
                                                                        src={goods.picpath}
                                                                        alt=""
                                                                        className="thumb-img"
                                                                    />
                                                                </div>
                                                                <div className="desc-right">
                                                                    <div className="desc-title">
                                                                        <div>{goods.title}</div>
                                                                        <div className="single-price">￥{goods.price}</div>
                                                                    </div>
                                                                    <div className="desc-sku">
                                                                        <div className="sku-left">
                                                                            {goods.values_name.split(',').map((item, idx) => (
                                                                                <span className="goods-size" key={item + idx.toString()}>{item}</span>
                                                                            ))}

                                                                        </div>
                                                                    </div>
                                                                    <div className="num-add">
                                                                        <div className="desc-count">
                                                                            记账量：{goods.deposit}
                                                                        </div>
                                                                        <span
                                                                            className="sku-right"
                                                                        >X{goods.num}
                                                                        </span>
                                                                    </div>
                                                                    {
                                                                        (goods && goods.in_area === 0) && (<div className="not-allow">该商品在该地区暂不支持销售</div>)
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))
                                    }
                                    <div className="goods-attr">
                                        <ul className="range-top">
                                            <li className="list">
                                                <span>记账量</span>
                                                <span>{shop.all_deposit}</span>
                                            </li>
                                            <li className="list">
                                                <span>商品总价</span>
                                                <span>￥{shop.all_price}</span>
                                            </li>
                                            <li className="list">
                                                <span>运费</span>
                                                <span>￥{shop.express_money}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <List>
                                        <InputItem
                                            placeholder="请和商家协议一致"
                                            maxLength={50}
                                            defaultValue={orders && orders[index]}
                                            onChange={(val) => this.getRemark(val, index)}
                                        >订单备注
                                        </InputItem>
                                        {
                                            shop.data.some(goods => goods.if_invoice === '1') && (<List.Item key={index.toString()} onClick={() => { this.showPanel(index) }} className="invoice">发票抬头</List.Item>)
                                        }
                                    </List>
                                    <div className="payable">
                                        <span>实付款</span>
                                        <span>￥{shop.actual_all_price}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    !notAllow && (<div className="notAllow">当前有商品在该地区暂不支持销售，非常抱歉！</div>)
                }
                <div className="pay">
                    <div className="pay-left">
                        <span className="space">共{this.totalCount()}件</span>
                        <span>合计：</span>
                        <span>￥{total}</span>
                    </div>
                    <Button onClick={this.postOrder} disabled={!notAllow}>立即付款</Button>
                </div>
                {
                    invoiceStatus && (
                        <div className="panel">
                            <div className="panel-info">
                                <div className="panel-title">
                                    <div className="title-left">发票</div>
                                    <div className="icon icon-close" onClick={this.hidePanel}/>
                                </div>
                                <div className="kind">
                                    <div className="kind-title">发票类型</div>
                                    <div className="kind-info">
                                        <div className="kind-select">增值税普通发票</div>
                                    </div>
                                </div>
                                <div className="rise-kind">
                                    <div className="rise-title">抬头类型</div>
                                    <div className="rise-content">
                                        {
                                            kind.map((item, index) => (
                                                <div className={currentIndex === index ? 'active' : ''} onClick={() => this.checkIndex(index)} key={item + index.toString()}>{item.title}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="invoice-info">
                                    <List>
                                        <div className="enterprise">
                                            <InputItem
                                                placeholder={`请填写${textInfo}名称`}
                                                maxLength={50}
                                                defaultValue={(invoice && invoice[invoiceIndex].name) || (invoices && invoices[invoiceIndex].name)}
                                                onChange={(e) => { this.invoiceChange(e, 'invoiceName') }}
                                            >
                                                <span>*</span>{textInfo}
                                            </InputItem>
                                            {self && (
                                                <InputItem
                                                    placeholder="请填写纳税人识别号"
                                                    maxLength={50}
                                                    defaultValue={(invoice && invoice[invoiceIndex].tax_id) || (invoices && invoices[invoiceIndex].tax_id)}
                                                    onChange={(e) => { this.invoiceChange(e, 'invoiceNum') }}
                                                >
                                                    <span>*</span>纳税人识别号
                                                </InputItem>
                                            )}
                                        </div>
                                        {
                                            self && (
                                                <div className="invoice-content">
                                                    <InputItem
                                                        placeholder="请填写开户银行"
                                                        maxLength={50}
                                                        defaultValue={(invoice && invoice[invoiceIndex].bank) || (invoices && invoices[invoiceIndex].bank)}
                                                        onChange={(e) => { this.invoiceChange(e, 'invoiceBank') }}
                                                    >
                                                        开户银行
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写企业地址"
                                                        maxLength={50}
                                                        defaultValue={(invoice && invoice[invoiceIndex].enterprise_addr) || (invoices && invoices[invoiceIndex].enterprise_addr)}
                                                        onChange={(e) => { this.invoiceChange(e, 'invoiceAddress') }}
                                                    >
                                                        企业地址
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写银行卡号"
                                                        maxLength={50}
                                                        defaultValue={(invoice && invoice[invoiceIndex].bank_card_no) || (invoices && invoices[invoiceIndex].bank_card_no)}
                                                        type="number"
                                                        onChange={(e) => { this.invoiceChange(e, 'bankCard') }}
                                                    >
                                                        银行卡号
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写企业电话"
                                                        type="number"
                                                        defaultValue={(invoice && invoice[invoiceIndex].enterprise_phone) || (invoices && invoices[invoiceIndex].enterprise_phone)}
                                                        maxLength={11}
                                                        onChange={(e) => { this.invoiceChange(e, 'invoicePhone') }}
                                                    >
                                                        企业电话
                                                    </InputItem>
                                                </div>
                                            )
                                        }
                                    </List>
                                </div>
                                <Button onClick={this.saveInvoice}>确定</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}


const mapStateToProps = state => {
    const shopCartState = state.get('shopCart');
    const myState = state.get('my');
    return {
        arr: shopCartState.get('orderArr'),
        carId: shopCartState.get('ids'),
        address: myState.get('defaultAddress')
    };
};

const mapDispatchToProps = {
    setOrderInfo: ActionCreator.setOrderInformation,
    setOrder: shopCartActionCreator.setOrder,
    setIds: shopCartActionCreator.setIds,
    saveAddress: ActionCreator.saveAddress,
    showConfirm: actionCreator.showConfirm
};

export default connect(mapStateToProps, mapDispatchToProps)(appendOrder);
