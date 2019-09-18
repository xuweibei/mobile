/**
 * 我的店铺
 */
import {ListView, PullToRefresh} from 'antd-mobile';
import {connect} from 'react-redux';
import ShopHomes from '../../../../common/shop-home/ShopHome';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import {ShopFooter} from '../../../../common/shop-footer/ShopFooter';
import ShopHomeOne from './shop-home-index-one/ShopHomeIndex';
import ShopHomeTwo from './shop-home-index-two/ShopHomeIndexTwo';
import ShopHomeThird from './shop-home-index-third/ShopHomeIndexThird';
import ShopHomeFour from './shop-home-index-four/ShopHomeIndexFour';
import ShopHomeFive from './shop-home-index-five/ShopHomeIndexFive';
import ShopHomeDetail from './ShopHomeDetail';
import LazyLoadIndex from '../../../../common/lazy-load/LazyLoad';
import Nothing from '../../../../common/nothing/Nothing';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './ShopHome.less';

const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, getUrlParam, showInfo} = Utils;
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
        this.getShop();
        this.getShopModel();
    }

    //获取模板信息
    getShopModel = () => {
        const {currentState} = this.state;
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.shopModel, {method: 'post', data: {shop_id: shoppingId}})
            .subscribe(res => {
                if (res.status === 0) {
                    //判断有无模板
                    if (res.data) {
                        this.setState({
                            currentState: currentState || 'homePage',
                            shopModelArr: res.data,
                            modelShow: true
                        });
                    } else {
                        this.setState({
                            currentState: currentState || 'modal',
                            shopModelArr: res.data
                        });
                    }
                }
            });
    }

    //获取商店内的所有商品
    getShop = (noShowLoading = false) => {
        const {page} = this.state;
        this.temp.isLoading = true;
        this.setState({
            hasMore: true
        });
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.props.setshoppingId(shoppingId);
        this.fetch(urlCfg.allGoodsInTheShop, {
            method: 'post',
            data: {
                id: shoppingId,
                page: page,
                pagesize: this.temp.pagesize
            }}, noShowLoading)
            .subscribe(res => {
                this.temp.isLoading = false;
                if (res.status === 0) {
                    this.setState({
                        refreshing: false
                    });
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
                            pageCount: res.data.page_count
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
        if (this.temp.isLoading) return;
        if (pageCount > page) {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getShop();
            });
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    //下拉加载
    onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.getShop(true);
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
                            lazyInfo={{imgUrl: item.picpath, offset: -130, overflow: true}}
                        />
                    </div>
                    <div className="goods-information">
                        <div className="goods-explain">{item.title}</div>
                        {/*FIXME: 不用ul*/}
                        {/* 已修改 */}
                        {/* <div className="goods-label">
                            {
                                item.property && item.property.values_name.split(',').map(data => <span>{data}</span>)
                            }
                        </div> */}
                        <span className="btn-keep">记账量：{item.deposit}</span>
                        <div className="payment">
                            <span>{item.order_num}人付款</span>
                            <span className="payment-r">￥{item.property.original_price}</span>
                        </div>
                        <div className="price">￥{item.property.price}</div>
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
                        ) : ''
                    }
                </div>
            </div>
        );
    }

    //底部tab
    onTabChange = (data) => {
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
            showInfo('im');
            info = 'im';
            break;
        }
        this.setState({
            currentState: info
        });
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
                {blockModel}
                {
                    currentState && <ShopFooter onTabChange={(data) => { this.onTabChange(data) }} active="shopHome" haveModalAll={modelShow}/>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        shoppingId: base.get('shoppingId')
    };
};

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopHome);
