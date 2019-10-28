/**
 * 我的店铺
 */
import {ListView, PullToRefresh} from 'antd-mobile';
import {connect} from 'react-redux';
import ShopHomes from '../../../../common/shop-home-nav/ShopHome';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import {ShopFooter} from '../../../../common/shop-footer/ShopFooter';
import ShopHomeOne from './shop-home-index-one/ShopHomeIndex';
import ShopHomeTwo from './shop-home-index-two/ShopHomeIndexTwo';
import ShopHomeThird from './shop-home-index-third/ShopHomeIndexThird';
import ShopHomeFour from './shop-home-index-four/ShopHomeIndexFour';
import ShopHomeFive from './shop-home-index-five/ShopHomeIndexFive';
import ShopHomeDetail from './ShopHomeDetail';
import LazyLoadIndex from '../../../../common/lazy-load/LazyLoad';
import Top from '../../../../common/top/Top';
import Nothing from '../../../../common/nothing/Nothing';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './ShopHome.less';

const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, getUrlParam, showInfo, native} = Utils;
class ShopHome extends BaseComponent {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            isLoading: true,
            pagesize: 5
        };
        this.state = {
            dataSource,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 2.7 : window.rem * 3.5),
            page: 1,
            pageCount: -1,
            currentState: '', //判断当前点击状态对应的页面展示
            refreshing: false,
            modelShow: false, //判断有无模板
            hasPage: true, //有无更多数据
            lat: '',
            lon: '',
            hasMore: false //底部请求状态文字显示情况
        };
    }

    componentWillMount() {
        const str = decodeURI(getUrlParam('business', encodeURI(this.props.location.search)));
        if (str === '1') { //发现页面  跳转过来的时候，需要直接跳到商家信息的页面
            this.setState({
                currentState: 'business'
            });
        }
    }

    componentDidMount() {
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.getShop(shoppingId);
        this.getShopModel(shoppingId);
    }

    componentWillReceiveProps(nextProps) {
        if (process.env.NATIVE) {
            const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
            const nextId = decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)));
            if (shoppingId !== nextId) {
                this.getShop(nextId);
                this.getShopModel(nextId);
            }
        }
    }

    //获取模板信息
    getShopModel = (id) => {
        // const {currentState} = this.state;
        this.fetch(urlCfg.shopModel, {method: 'post', data: {shop_id: id}})
            .subscribe(res => {
                if (res.status === 0) {
                    //判断有无模板
                    if (res.data) {
                        this.setState({
                            currentState: 'homePage',
                            shopModelArr: res.data,
                            modelShow: true
                        });
                    } else {
                        this.setState({
                            currentState: 'modal',
                            shopModelArr: res.data,
                            modelShow: false
                        });
                    }
                }
            });
    }

    //获取商店内的所有商品
    getShop = (id, noShowLoading = false) => {
        const {setshoppingId} = this.props;
        const {page} = this.state;
        this.temp.isLoading = true;
        this.setState({
            hasMore: true
        });
        setshoppingId(id);
        this.fetch(urlCfg.allGoodsInTheShop, {
            method: 'post',
            data: {
                id,
                page: page,
                pagesize: this.temp.pagesize
            }}, noShowLoading)
            .subscribe(res => {
                this.temp.isLoading = false;
                if (res && res.status === 0) {
                    this.setState({
                        refreshing: false
                    });
                    res.data.page = page;
                    if (page === 1) {
                        this.temp.stackData = res.data.data;
                    } else {
                        this.temp.stackData = this.temp.stackData.concat(res.data.data);
                    }
                    if (page >= res.data.page_count) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    this.setState((prevState) => (
                        {
                            dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                            pageCount: res.data.page_count,
                            shopOnsInfo: res.data.shop_info
                        }
                    ));
                }
            });
    }

    //商品详情
    allgoods = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //模板
    template = (num) => {
        let block = '';
        const {shopModelArr} = this.state;
        switch (num) {
        case '1':
            block = <ShopHomeOne shopModelArr={shopModelArr}/>;
            break;
        case '2':
            block = <ShopHomeTwo shopModelArr={shopModelArr}/>;
            break;
        case '3':
            block = <ShopHomeThird shopModelArr={shopModelArr}/>;
            break;
        case '4':
            block = <ShopHomeFour shopModelArr={shopModelArr}/>;
            break;
        case '5':
            block = <ShopHomeFive shopModelArr={shopModelArr}/>;
            break;
        default:
            block = <Nothing text={FIELD.No_Template} title=""/>;
        }
        return block;
    }

    //上拉刷新
    onEndReached = () => {
        const {page, pageCount} = this.state;
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (this.temp.isLoading) return;
        if (pageCount > page) {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getShop(shoppingId);
            });
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    //下拉加载
    onRefresh = () => {
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.setState({
            refreshing: true
        }, () => {
            this.getShop(shoppingId, true);
        });
    };

    //全部商品
    structure = () => {
        const {height, dataSource, refreshing, hasMore} = this.state;
        const row = (item) => (
            <div className="goods">
                <div className="goods-name" onClick={() => this.allgoods(item.id)}>
                    <div className="goods-picture">
                        <LazyLoadIndex
                            lazyInfo={{imgUrl: item.picpath, offset: -30, overflow: true}}
                        />
                    </div>
                    <div className="goods-information">
                        <div className="goods-explain">{item.title}</div>
                        <span className="btn-keep">记账量：{item.deposit}</span>
                        <div className="payment">
                            <span>{item.num_sold}人付款</span>
                            <span className="payment-r">￥{item.original_price}</span>
                        </div>
                        <div className="price">￥{item.price}</div>
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="shopHome" data-role="page" className="all-merchandise">
                <div className="all-goods">
                    {
                        dataSource.getRowCount() > 0 ? (
                            <ListView
                                dataSource={dataSource}
                                initialListSize={this.temp.pagesize}
                                renderRow={row}
                                style={{
                                    height: height
                                }}
                                pageSize={this.temp.pagesize}
                                onEndReachedThreshold={100}
                                onEndReached={this.onEndReached}
                                pullToRefresh={(
                                    <PullToRefresh
                                        refreshing={refreshing}
                                        onRefresh={this.onRefresh}
                                        damping={70}
                                        indicator={{
                                            release: <Animation ref={ref => { this.Animation = ref }}/>
                                        }}
                                    />
                                )}
                                renderFooter={() => ListFooter(hasMore)}
                            />
                        ) : <Nothing text={FIELD.No_Commodity}/>
                    }
                </div>
            </div>
        );
    }

    //底部tab
    onTabChange = (data) => {
        const {shopOnsInfo} = this.state;
        let info = '';
        switch (data) {
        case 'category':
            info = 'modal';
            break;
        case 'find':
            info = 'business';
            break;
        case 'shopHome':
            info = 'homePage';
            break;
        default:
            if (process.env.NATIVE) {
                native('goToShoper', {shopNo: shopOnsInfo.no, id: '', type: '', shopNickName: shopOnsInfo.nickname, imType: '1', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
            } else {
                showInfo('联系商家');
            }
            break;
        }
        if (data !== 'im') {
            this.setState({
                currentState: info
            });
        }
    }

    //判断底部显示的状态
    activeFn = (onOff, type) => {
        let str = '';
        if (type === 'business') {
            str = 'find';
        } else if (onOff) {
            str = 'shopHome';
        } else {
            str = 'category';
        }
        return str;
    }

    render() {
        const {currentState, modelShow, shopModelArr, lat, lon} = this.state;
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        let blockModel = <div/>;
        switch (currentState) {
        case 'homePage':
            blockModel = modelShow && this.template(shopModelArr.mol_id);
            break;
        case 'business':
            blockModel = <ShopHomeDetail id={shoppingId} lat={lat} lon={lon}/>;
            break;
        case 'modal':
            blockModel = this.structure();
            break;
        default:
            blockModel = '';
        }
        return (
            <React.Fragment>
                <ShopHomes id={shoppingId} shopModelArr={shopModelArr} show={currentState === 'business'}/>
                <Top/>
                {blockModel}
                {
                    currentState && <ShopFooter onTabChange={(data) => { this.onTabChange(data) }} active={this.activeFn(modelShow, currentState)} haveModalAll={modelShow}/>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        shoppingId: base.get('shoppingId'),
        shopInfos: base.get('shopInfos'),
        shopModal: base.get('shopModal')
    };
};

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopHome);
