/**
 *
 * 商品详情页面
 */
import {Carousel, Flex, Icon, List, Popover, Stepper} from 'antd-mobile';
import {connect} from 'react-redux';
import {Link, Element, scrollSpy} from 'react-scroll';
import {shopCartActionCreator as action} from '../../../shop-cart/actions';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import Sku from '../../../../common/sku/Sku';
import './GoodsDetail.less';

const {urlCfg} = Configs;
const {appHistory, getUrlParam, showFail, showInfo, native, TD, systemApi: {setValue, removeValue}} = Utils;
const {MESSAGE: {Form, Feedback}, TD_EVENT_ID} = Constants;
const hybrid = process.env.NATIVE;

const myImg = src => (
    <img src={require(`../../../../../assets/images/${src}`)} className="am-icon am-icon-xs"/>
);
const listText = [
    {
        title: '商品',
        key: 'goods'
    },
    {
        title: '评价',
        key: 'evaluate'
    },
    {
        title: '推荐',
        key: 'recommend'
    },
    {
        title: '详情',
        key: 'details'
    }
];

const Item = Popover.Item;

class GoodsDetail extends BaseComponent {
    state = {
        topSwithe: true,
        indexId: 0,
        popup: false, //sku是否显示
        paginationNum: 1,
        imgHeight: 176,
        goodsDetail: {}, //详情界面
        picPath: [], //轮播
        shop: {}, //  详情商店数据
        recommend: [], //店铺商品推荐
        evaluate: {}, //商品评价
        allState: {},
        goodsAttr: [],
        stocks: [],
        type: '',
        inputStatus: false, //评论框状态
        assess: 0, //评价顶部距离
        detailImg: 0, //商品详情顶部距离
        navHeight: 0, //导航栏到顶部的距离
        recommendTop: 0,
        collect: [], //商品收藏状态
        status: '1', //判断商品是否下架
        visible: false,
        half: false,
        text: '',
        lineStatus: false, //底部商品状态栏
        ids: [], //选中属性id
        goodsSku: [], //商品的结果集
        listHeight: [], //元素头部高度
        shopAddress: '', // 店铺位置
        lineText: '', //商品状态栏文字
        pickType: {}, //配送方式
        selectType: '', //选中配送方式 1快递 2自提
        clickType: 0, //打开sku的方式 0箭头 1购物车 2立即购买
        totalNUm: 0, //商品库存,
        goodId: decodeURI(getUrlParam('id', encodeURI(this.props.location.search)))
    };

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        scrollSpy.unmount();
    }

    init = () => {
        scrollSpy.update();
        scrollSpy.mount(document);
        scrollSpy.addSpyHandler(this.handleScroll, document);
        this.getGoodsDetail();
    }

    //网页滚动
    handleScroll=(e) => {
        if (e / window.devicePixelRatio > 100) {
            this.setState({topSwithe: false});
        } else if (e / window.devicePixelRatio <= 100) {
            this.setState({topSwithe: true});
        }
    }

    componentWillReceiveProps(nextProps, value) { //路由跳转时的判断，id有变化就请求
        if (this.state.goodId !== decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)))) {
            this.setState({
                goodId: decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)))
            }, () => {
                this.init();
            });
        }
    }

    //获取商品详情
    getGoodsDetail = () => {
        const {goodId} = this.state;
        this.fetch(urlCfg.getGoodsDetail, {data: {id: goodId}}).subscribe(res => {
            if (res.status === 0) {
                this.starShow(res.shop.shop_mark);
                const stocks = [];
                res.sku.forEach(item => {
                    stocks.push({
                        attribute: item.attribute,
                        original_price: item.original_price,
                        price: item.price,
                        stock: item.stock,
                        deposit: item.deposit
                    });
                });
                this.setState(
                    {
                        goodsDetail: res.data,
                        picPath: res.data.picpath,
                        shop: res.shop, // 店铺信息,
                        // rank: res.shop.shop_mark,
                        recommend: res.recommend_pr, // 商品推荐
                        evaluate: res.pingjia,
                        allState: res,
                        collect: res.had_coll,
                        status: res.data.status,
                        goodsSku: res.sku,
                        goodsAttr: res.data.attr_arr, //商品属性
                        stocks: stocks,
                        pickType: res.data.distribution_mode,
                        totalNUm: res.data.num_stock
                    },
                    () => {
                        this.getAddress();
                        this.getGoodsStatus();
                    }
                );
            }
        });
    };

    //地址逆解析
    getAddress = () => {
        const myGeo = new window.BMap.Geocoder();
        const {shop} = this.state;
        const lat = shop.latitude;
        const lon = shop.longitude;
        myGeo.getLocation(new window.BMap.Point(lon, lat), result => {
            if (result) {
                console.log(result);
                const city = result.addressComponents.city;
                const province = result.addressComponents.province;
                const shopAddress = province + city;
                this.setState({
                    shopAddress: shopAddress
                });
            }
        });
    };

    //开启sku
    openSku = () => {
        this.setState({
            popup: true,
            clickType: 0
        });
    };

    //关闭sku
    closeSku = () => {
        this.setState({
            popup: false
        });
    };

    //确定按钮点击
    confirmSku = (type, ids) => {
        const {clickType} = this.state;
        console.log('选中商品属性ID：', type, ids);
        this.setState({
            selectType: type,
            ids: ids,
            popup: false
        }, () => {
            switch (clickType) { //判断确认后的回调 1加入购物车 2立即购买
            case 1:
                TD.log(TD_EVENT_ID.STORE.ID, TD_EVENT_ID.STORE.LABEL.STORE_HOME);
                this.addCart();
                break;
            case 2:
                this.emption();
                break;
            default:
                return;
            }
        });
    };

    //添加商品到购物车
    addCart = () => {
        const {shop, goodsDetail, paginationNum, ids, selectType} = this.state;
        if (shop.shoper_open_status === '0') {
            return;
        }
        if (paginationNum === 0 || ids.length === 0) {
            this.setState({
                popup: true,
                clickType: 1
            });
            return;
        }
        if (selectType === '3') {
            showInfo(Feedback.Select_Consume);
            return;
        }
        this.fetch(urlCfg.addShopCart, {
            data: {
                if_express: selectType,
                shop_id: shop.id,
                shop_no: shop.no,
                shop_name: shop.shopName,
                picnum: 1,
                pr_id: goodsDetail.id,
                deposit: goodsDetail.deposit,
                num: paginationNum,
                sku: ids.join(',')
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data) {
                    if (res.data.status === 2) {
                        showFail(Feedback.Not_Allow_Repeat);
                    } else if (res.data.status === 6) {
                        showFail(Feedback.Failed_Property);
                    }
                } else {
                    showInfo(Feedback.Add_Success);
                }
            }
        });
    };

    //立即购买
    emption = () => {
        const {shop} = this.state;
        if (shop.shoper_open_status === '0') {
            return;
        }
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        const {paginationNum, ids, selectType} = this.state;
        const str = ids.toString();
        if (str.length === 0) {
            this.setState({
                popup: true,
                clickType: 2
            });
            return;
        }
        const arr = [];
        arr.push({
            if_express: selectType,
            pr_id: parseInt(id, 10),
            property: str,
            num: paginationNum
        });
        const {setOrder} = this.props;
        setOrder(arr);
        setValue('orderArr', JSON.stringify(arr));
        if (selectType === '1') {
            appHistory.push(`/appendorder?source=${2}`);
        } else {
            appHistory.push('/selfMentionDetail');
        }
        // this.props.history.push({pathname: '/appendorder', arr: arr});
    };

    //收藏商品
    collect = () => {
        const {shop, goodsDetail, collect} = this.state;
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        if (collect.length > 0) {
            this.delCollect();
        } else {
            this.fetch(urlCfg.addCollectSingle, {
                data: {
                    pr_id: id,
                    shop_id: shop.id,
                    shop_name: shop.shopName,
                    price: goodsDetail.price,
                    deposit: goodsDetail.deposit,
                    pr_title: goodsDetail.title
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    this.getGoodsDetail();
                }
            });
        }
    };

    //取消商品收藏
    delCollect = () => {
        const {collect} = this.state;
        this.fetch(urlCfg.cancelCollect, {
            data: {
                type: 1,
                ids: collect
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.getGoodsDetail();
            }
        });
    };

    //跳转全部评价
    skipAssess = id => {
        appHistory.push(`/evaluate?id=${id}`);
    };

    //判断评分等级
    rating = num => {
        const rank = parseInt(num, 10);
        let val = '';
        if (rank >= 4) {
            val = '高';
        } else if (rank > 2.5 && rank < 4) {
            val = '中';
        } else {
            val =  '低';
        }
        return val;
    };

    //图片放大
    openMask = pic => {
        this.setState({
            maskPic: pic,
            maskStatus: true
        });
    };

    maskClose = () => {
        this.setState({
            maskPic: '',
            maskStatus: false
        });
    };

    //跳转店铺首页
    ShopH = id => {
        appHistory.push(`/shopHome?id=${id}`);
    };

    //星星显示
    starShow = num => {
        const a = num.slice(0, 1);
        const b = num.slice(2, 3);
        const arr = Array.from({length: a}, (v, k) => k);
        if (Number(b) <= 9 && Number(b) > 0) {
            this.setState({
                half: true
            });
        }
        this.setState({
            xxArr: arr
        });
    };

    shopCart = () => {
        //判断订单状态
        this.props.setOrderStatus('');
        //店铺里面判断状态的id
        this.props.setshoppingId('');
        //清除收藏状态
        this.props.setTab('');
        if (hybrid) {
            native('goShop');
        } else {
            appHistory.push('/shopCart');
        }
    };

    goHome = (val, key) => {
        if (hybrid && key === 0) {
            native('goHome');
        }
        if (key === 0) {
            appHistory.replace('/home');
            this.setState({
                visible: false
            });
        }
        //判断订单状态
        this.props.setOrderStatus('');
        //店铺里面判断状态的id
        this.props.setshoppingId('');
        //清除收藏状态
        this.props.setTab('');
    };

    //获取商品状态
    getGoodsStatus = () => {
        const {status} = this.state;
        switch (status) {
        case '0':
            this.setState({
                lineStatus: true,
                lineText: '失效'
            });
            break;
        case '2':
            this.setState({
                lineStatus: true,
                lineText: '库存不足'
            });
            break;
        default:
            this.setState({
                lineStatus: false,
                lineText: ''
            });
        }
    };

    goBackModal = () => {
        if (hybrid && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        //清除缓存
        removeValue('orderArr');
    };

    //改变购买数量
    onChangeCount = value => {
        if (value > 100) {
            showFail(Form.No_Stocks);
        } else {
            this.setState({
                paginationNum: value
            });
        }
    };

    //切换右边tab是否显示
    handleVisibleChange = (visible) => {
        this.setState({
            visible
        });
    };

    //右侧按钮点击
    onSelect = (opt) => {
        if (opt.key === '2') {
            appHistory.push('/collect');//收藏页面
        } else if (opt.key === '1') {
            if (hybrid) {
                native('goHome');
                appHistory.reduction();//重置路由
            } else {
                appHistory.push('/home');
            }
        } else if (opt.key === '3') {
            if (hybrid) {
                native('goShop');
                appHistory.reduction();//重置路由
            } else {
                appHistory.push('/shopCart');
            }
        } else if (opt.key === '4') {
            if (hybrid) {
                const obj = {'': ''};
                native('goToIm', obj);
            } else {
                showInfo('im');
            }
        } else if (opt.key === '5') {
            appHistory.push('/invitation');//分享页面
        }
    };

    //联系商家
    goToShoper = () => {
        const {shop, recommend} = this.state;
        if (hybrid) {
            native('goToShoper', {shopNo: shop.no, id: recommend[0].id, type: '1', shopNickName: shop.nickname, imType: '1', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    }

    //分享按钮
    popover = () => (
        <Popover
            onSelect={this.onSelect}
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            overlay={[
                (<Item style={{float: 'left'}} key="1" icon={myImg('family.svg')}><p>首页</p></Item>),
                (<Item style={{float: 'left'}} key="2" icon={myImg('star.svg')}>收藏</Item>),
                (<Item style={{float: 'left'}} key="3" icon={myImg('shop-cart.svg')}>购物车</Item>),
                (<Item style={{float: 'left'}} key="4" icon={myImg('info.svg')}><p>消息</p></Item>),
                (<Item style={{float: 'left'}} key="5" icon={myImg('share.svg')}>分享</Item>)
            ]}
        >
            <Icon type="ellipsis"/>
        </Popover>
    )

    //店铺详情跳转
    goToShopRecom = (id) => {
        this.setState({
            goodId: id
        }, () => {
            this.getGoodsDetail();
        });
    }

    render() {
        const {
            topSwithe, popup, paginationNum, xxArr, half, ids, maskStatus,
            picPath, goodsDetail, shop, recommend, evaluate, allState, collect,
            goodsAttr, stocks, shopAddress, lineStatus, lineText, pickType, selectType
        } = this.state;
        console.log(picPath[0], '肯德基康师傅');
        const renderCount = (
            <List>
                <List.Item
                    wrap
                    extra={(
                        <Stepper
                            style={{width: '100%', minWidth: '100px'}}
                            showNumber
                            max={100}
                            min={1}
                            value={paginationNum}
                            onChange={this.onChangeCount}
                        />
                    )}
                >
                    数量
                </List.Item>
            </List>
        );
        return (
            <div
                data-component="goodsDetail"
                data-role="page"
                className={this.state.popup ? 'goods-detail ido' : 'goods-detail'}
            >
                {topSwithe ? (
                    <div className="navBar-title-top">
                        <Flex>
                            <Flex.Item>
                                {window.isWX ? null : (
                                    <div
                                        className="back-left"
                                        onClick={this.goBackModal}
                                    >
                                        <div className="icon icon-back"/>
                                    </div>
                                )}
                            </Flex.Item>
                            <Flex.Item>
                                <div className="back-right">
                                    {this.popover()}
                                </div>
                            </Flex.Item>
                        </Flex>
                    </div>
                ) : (
                    <div className="navBar-title">
                        <ul className="list-wrapper">
                            <li className="list">
                                <div className="back">
                                    {window.isWX ? null : (
                                        <div
                                            className="icon icon-back"
                                            // onClick={appHistory.goBack}
                                            onClick={this.goBackModal}
                                        />
                                    )}
                                </div>
                            </li>
                            <li className="list">
                                <ul>
                                    {listText.map((item, index) => (
                                        <li key={item.title} className="items">
                                            <Link activeClass="on on-tab" to={item.key} spy smooth duration={500} >
                                                {item.title}
                                                {/*<div className={index === indexId ? 'underlineRed' : 'underline'}/>*/}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="list">
                                <div className="back">
                                    {this.popover()}
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="goods-detail-wrapper">
                    <div className="container">
                        <div className="goods-banner">
                            <Carousel autoplay={false} infinite>
                                {picPath.map((item) => (
                                    <div
                                        key={item}
                                        onClick={e => this.openMask(e)}
                                    >
                                        <img
                                            src={item}
                                            className="banner-img"
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        {/*商品详情规格*/}
                        <Element name="goods" className="goods-norms">
                            <div className="norms-money">
                                <div className="money">
                                    ￥{goodsDetail.price}{' '}
                                    <p className="money-max">￥{goodsDetail.price_original}</p>
                                </div>
                                <div className="money-keep">
                                    <div className="btn-keep">
                                        记账量：{goodsDetail.deposit}
                                    </div>
                                </div>
                            </div>
                            <div className="norms-title">
                                {goodsDetail.title}
                            </div>
                            <div className="norms-bottom">
                                <Flex>
                                    <Flex.Item>
                                        <div className="bot-left">
                                            邮费：
                                            {goodsDetail.freight || '免邮'}
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div className="bot-center">
                                            销量：{goodsDetail.num_sold}
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div className="bot-right">
                                            {shopAddress}
                                        </div>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </Element>
                        {/*店铺、商品规格*/}
                        <Element name="evaluate" className="goods-shop">
                            <div className="framing">
                                <div
                                    className="goods-select"
                                    onClick={this.openSku}
                                >
                                    <div className="select-left">
                                        <div className="chose">选择</div>
                                        <div className="attrs">
                                            <span>选择</span>
                                            <span>颜色规格</span>
                                        </div>
                                    </div>
                                    <div className="select-right">
                                        <span className="icon right-icon"/>
                                    </div>
                                </div>
                            </div>
                            {/*    <div className="valid">
                                <span>有效时间</span>
                            </div>*/}
                            <div className="serve">
                                <div className="waiter">服务</div>
                                <div className="their">
                                    <span>门店可自提</span>
                                    <span className="dolt"/>
                                    <div className="nonsupport">
                                        不支持7天无理由退换货
                                    </div>
                                </div>
                            </div>
                            <div className="shop-detali">
                                <div className="box1">
                                    <div className="shop-logo">
                                        <img
                                            className="logo-img"
                                            src={shop.picpath}
                                            alt=""
                                        />
                                    </div>
                                    <div className="shop-detail">
                                        <div className="Star">
                                            {xxArr
                                            && xxArr.map(item => (
                                                <div
                                                    className="shop-star"
                                                    key={item}
                                                >
                                                    <div className="icon icon-star"/>
                                                </div>
                                            ))}
                                            {half && (
                                                <div className="shop-star">
                                                    <div className="icon icon-stars"/>
                                                </div>
                                            )}
                                            <div className="shop-btn">
                                                {/* <div className="shop-det">
                                                    店铺详情
                                                </div> */}
                                                <div
                                                    className="auxiliary-button red"
                                                    onClick={() => this.ShopH(shop.id)
                                                    }
                                                >
                                                    进店逛逛
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Shop-N">
                                            <span className="Shop-Nl">
                                                {shop.shopName}
                                            </span>
                                            <span className="Shop-Nr">
                                                人均消费
                                            </span>
                                            <span className="Shop-Nr">
                                                ￥99
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="scores">
                                    <div className="shop-score">
                                        <span>店铺评分</span>
                                        <span className="score-eva">
                                            {shop.shop_mark}
                                        </span>
                                        <span className="grade-height">
                                            {this.rating(shop.shop_mark)}
                                        </span>
                                    </div>
                                    <div className="logistics-score">
                                        <span>物流评分</span>
                                        <span className="score-eva">
                                            {shop.logistics_mark}
                                        </span>
                                        <span className="grade-low">{this.rating(shop.logistics_mark)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="goods-assess">
                                <div className="assess-text">
                                    <div className="text-left">
                                        商品评价({allState.pingjia_count})
                                    </div>
                                    <div
                                        className="text-right"
                                        onClick={() => this.skipAssess(goodsDetail.id)
                                        }
                                    >
                                        查看全部
                                        <span className="icon icon-right"/>
                                    </div>
                                </div>
                                <div className="appraise">
                                    <div className="appraise-head">
                                        <div className="head-logo">
                                            <img
                                                className="head-img"
                                                src={evaluate.avatarUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className="head-text">
                                            {evaluate.nickname}
                                        </div>
                                    </div>
                                </div>
                                <div className="appraise-title">
                                    {evaluate.content}
                                </div>
                            </div>
                        </Element>
                        {/*店铺推荐*/}
                        <Element name="recommend" className="home-recommends">
                            <h2 className="recommend-commodity-names">
                                店铺推荐
                            </h2>
                            <div className="Scroll-infeed">
                                <div className="home-recommend-main">
                                    {recommend.map(item => (
                                        <div
                                            className="home-recommend-individual"
                                            key={item.id}
                                            onClick={() => this.goToShopRecom(item.id)}
                                        >
                                            <div className="recommend-individual-imgParent">
                                                <img
                                                    className="recommend-individual-img"
                                                    src={item.picpath}
                                                    alt=""
                                                />
                                            </div>
                                            <h3 className="recommend-individual-title">
                                                {item.title}
                                            </h3>
                                            <div className="recommend-concessional-box">
                                                <div className="recommend-concessional-rate">
                                                    {item.price}
                                                </div>
                                                <div className="recommend-original-price">
                                                    ￥{item.price}
                                                </div>
                                            </div>
                                            <div className="recommend-accounting-volume">
                                                记账量：{item.deposit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="recommend-commodity-detail">
                                <div className="currency-detail">
                                    <Flex className="currency-detail-title">
                                        <Flex.Item className="title-border"/>
                                        <Flex.Item className="title-center">
                                            商品详情
                                        </Flex.Item>
                                        <Flex.Item className="title-border"/>
                                    </Flex>
                                </div>
                            </div>
                        </Element>
                        {/*商品详情*/}
                        <Element name="details" className="detail-img lis">
                            {/* <img
                                className="img"
                                src={require('../../../../../assets/images/dateil.png')}
                                alt=""
                            /> */}
                            {
                                goodsDetail.intro
                            }
                        </Element>
                        {/*失效*/}
                    </div>
                </div>
                {lineStatus ? <div className="timeout">{lineText}</div> : null}
                {/*底部固定购买栏*/}
                {
                    shop.shoper_open_status === '0' && (<div className="rest">该店暂未营业</div>)
                }
                <div className="goodsDetail-bottom">
                    <div className="icons-warp">
                        <div className="icons">
                            <div className="phone-cart">
                                <div className="icon icon-phone"/>
                                <div className="phone-text" onClick={this.goToShoper}>联系卖家</div>
                            </div>
                            <div className="phone-cart">
                                <div
                                    className={`icon ${collect.length > 0 ? 'icon-collect-active' : 'icon-collect'}`}
                                />
                                <div
                                    className="phone-text"
                                    onClick={() => this.collect()}
                                >
                                    收藏
                                </div>
                            </div>
                            <div className="phone-cart">
                                <div className="icon icon-cart"/>
                                <div className="phone-text" onClick={this.shopCart}>
                                    购物车
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-btn">
                        <Flex>
                            <Flex.Item
                                className="cart"
                                onClick={() => this.addCart()}
                            >
                                加入购物车
                            </Flex.Item>
                            <Flex.Item
                                className="emption"
                                onClick={() => this.emption('pay')}
                            >
                                立即购买
                            </Flex.Item>
                        </Flex>
                    </div>
                </div>
                {/*底部弹出选择商品框*/}
                {popup && (
                    <Sku
                        detail={goodsDetail}
                        attributes={goodsAttr}
                        stocks={stocks}
                        cover={picPath[0]}
                        select={ids}
                        onClose={this.closeSku}
                        onSubmit={this.confirmSku}
                        extra={renderCount}
                        type={pickType}
                        selectType={selectType}
                    />
                )}
                {maskStatus && (
                    <div className="picMask" onClick={this.maskClose}>
                        <Carousel autoplay={false} infinite>
                            {picPath.map(item => (
                                <div key={item}>
                                    <img
                                        src={item}
                                        className="banner-img"
                                        alt=""
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = {
    setOrder: action.setOrder,
    setshoppingId: actionCreator.setshoppingId,
    setTab: actionCreator.setTab,
    setOrderStatus: actionCreator.setOrderStatus
};
export default connect(null, mapDispatchToProps)(GoodsDetail);
