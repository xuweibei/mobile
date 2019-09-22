/*
* 确认订单
* */
import {connect} from 'react-redux';
import {InputItem, List, Button, Icon} from 'antd-mobile';
import {myActionCreator as ActionCreator} from '../../actions/index';
import {shopCartActionCreator} from '../../../shop-cart/actions/index';
import AppNavBar from '../../../../common/navbar/NavBar';
import './AppendOrder.less';

const {appHistory, showFail, getUrlParam, getShopCartInfo, systemApi: {setValue, removeValue}, native} = Utils;
const {urlCfg} = Configs;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const hybrid = process.env.NATIVE;

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
        order: {}, //订单备注信息
        IDcard: [],
        date: now,
        self: true, //发票类型
        currentIndex: 0, //默认发票选中类型
        textInfo: '企业',
        invoiceStatus: false,  //发票弹框显示状态
        notAllow: true, //不支持提交状态
        invoice: {}
    };

    componentDidMount() {
        const {setOrder, setIds, arr} = this.props;
        const that = this;
        const obj = {'': ''};
        if (hybrid) {
            if (arr.length > 0) {
                that.getOrderState();
            } else { //这里的情况是，原生那边跳转的时候，需要处理一些问题，所以就购物车过来的时候，存数据，这边取数据
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
        const {addressInfo, shopInfo, order} = this.state;
        const {address} = this.props;
        const source = decodeURI(getUrlParam('source', encodeURI(this.props.location.search)));
        if (addressInfo.length === 0) {
            showFail('请选择您的收货地址');
            return;
        }
        const addArr = [];
        if (address) {
            console.log('只是心撒旦画');
            addArr.push({
                ...address
            });
        } else {
            addArr.push({
                ...addressInfo
            });
        }
        const shopArr = shopInfo.map((item, index) => {
            const objTemp = {shop_id: item.shop_id, remarks: order[index].toString()};
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
            const {setOrderInfo} = this.props;
            setOrderInfo(res);
            setValue('orderInfo', JSON.stringify(res));//将订单相关数据存入locastage
            appHistory.replace('/payMoney');
        });
    };

    goToShop = (id) => {
        appHistory.push({pathname: `/shopHome?id=${id}`});
    };

    //保存身份证
    getIdCart = (val, index) => {
        const {IDcard} = this.state;
        const array = IDcard.concat([]);
        array[index] = val;
        this.setState({
            IDcard: array
        });
    };

    //獲取備注信息
    getRemark = (val, index) => {
        const {order} = this.state;
        const array = order.concat([]);
        array[index] = val;
        this.setState({
            order: array
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

    //图片接收
    onChange = (file, type, index) => {
        const {files} = this.state;
        const array = files.concat([]);
        array[index] = file;
        this.setState({
            files: array
        });
    };

    //获取订单页面数据
    getOrderState = () => {
        const {arr} = this.props;
        const {address} = this.props;
        // console.log(address);
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
                    for (let i = 0; i < res.data.length; i++) {
                        array.push([]);
                        cardArr.push([]);
                        infoArry.push([]);
                        invoice.push([]);
                    }
                    this.setState({
                        total: res.all_price,
                        shopInfo: res.data,
                        addressInfo: res.addr,
                        files: array,
                        goods: res.data.map(shop => shop.data.map(goods => goods)),
                        IDcard: cardArr,
                        order: infoArry,
                        invoice
                    }, () => {
                        console.log(this.state.shopInfo);
                        const {goods} = this.state;
                        const status = goods[0] && goods[0].map(item => item.in_area);
                        if (status && status.includes(0)) {
                            this.setState({
                                notAllow: false
                            });
                        }
                    });
                }
            });
    };

    goBack = () => {
        appHistory.goBack();
        removeValue('orderInfo');
    };

    //发票弹框显示状态
    showPanel = () => {
        this.setState({
            invoiceStatus: true
        });
    }

    //关闭发票弹框
    hidePanel = () => {
        this.setState({
            invoiceStatus: false
        });
    }

    //切换发票选中类型
    checkIndex = index => {
        this.setState({
            currentIndex: index
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

    goBackModal = () => {
        if (hybrid && appHistory.length === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    //发票信息
    invoiceChange = (e, type) => {
        switch (type) {
        case 'name':
            this.setState({
                invoiceName: e
            });
            break;
        case 'num':
            this.setState({
                invoiceNum: e
            });
            break;
        case 'address':
            this.setState({
                invoiceAddress: e
            });
            break;
        case 'bank':
            this.setState({
                invoiceBank: e
            });
            break;
        case 'bankAddress':
            this.setState({
                bankAddress: e
            });
            break;
        case 'phone':
            this.setState({
                invoicePhone: e
            });
            break;
        default:
            console.log('object');
        }
    }

    //保存发票
    saveInvoice = () => {

    }

    render() {
        const {shopInfo, addressInfo, total, order, self, currentIndex, textInfo, notAllow, invoiceStatus} = this.state;
        const {address} = this.props;
        const kind = [
            {title: '企业'},
            {title: '个人'}
        ];
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
                            shopInfo.map((shop, index) => (
                                <div className="shopCart-goods" key={shop.shop_id}>
                                    <div className="goods-top">
                                        <div className="shop-avatar">
                                            <div className="avatar"><img
                                                src={shop.picpath}
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
                                        shop.data.map((goods) => (
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
                                                                        {goods.title}
                                                                    </div>
                                                                    <div className="desc-sku">
                                                                        <div className="sku-left">
                                                                            {goods.values_name.split(',').map(item => (
                                                                                <span key={item}>{item}</span>
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
                                        <ul>
                                            <div className="range-top">
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
                                            </div>
                                        </ul>
                                    </div>
                                    <List>
                                        <InputItem
                                            placeholder="请和商家协议一致"
                                            maxLength={200}
                                            value={order[index]}
                                            onChange={(val) => this.getRemark(val, index)}
                                        >订单备注
                                        </InputItem>
                                        {
                                            shop.data.map(goods => goods.if_invoice.includes('1')) && (<List.Item onClick={this.showPanel} className="invoice">发票抬头</List.Item>)
                                        }
                                        {/* <InputItem
                                            // value={card[index]}
                                            placeholder="请输入您的身份证"
                                            value={IDcard[index]}
                                            maxLength="18"
                                            type="text"
                                            onChange={val => this.getIdCart(val, index)}
                                        >身份证
                                        </InputItem> */}
                                        {/* <DatePicker
                                            mode="date"
                                            value={this.state.date}
                                            onChange={date => this.setState({date})}
                                        >
                                            <List.Item arrow="horizontal">日期选择</List.Item>
                                        </DatePicker> */}
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
                    <Button onClick={() => this.postOrder()} disabled={!notAllow}>立即付款</Button>
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
                                                <div className={currentIndex === index ? 'active' : ''} onClick={() => this.checkIndex(index)} key={index.toString()}>{item.title}</div>
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
                                                onChange={(e) => { this.invoiceChange(e, 'name') }}
                                            >
                                                <span>*</span>{textInfo}
                                            </InputItem>
                                            {self && (
                                                <InputItem
                                                    placeholder="请填写纳税人识别号"
                                                    maxLength={50}
                                                    onChange={(e) => { this.invoiceChange(e, 'num') }}
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
                                                        onChange={(e) => { this.invoiceChange(e, 'bank') }}
                                                    >
                                                        开户银行
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写企业地址"
                                                        maxLength={50}
                                                        onChange={(e) => { this.invoiceChange(e, 'address') }}
                                                    >
                                                        企业地址
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写银行地址"
                                                        maxLength={50}
                                                        onChange={(e) => { this.invoiceChange(e, 'bankAddress') }}
                                                    >
                                                        银行地址
                                                    </InputItem>
                                                    <InputItem
                                                        placeholder="请填写企业电话"
                                                        type="number"
                                                        maxLength={11}
                                                        onChange={(e) => { this.invoiceChange(e, 'phone') }}
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
    saveAddress: ActionCreator.saveAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(appendOrder);
