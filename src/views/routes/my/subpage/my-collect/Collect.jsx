/**我的收藏页面 */
import {connect} from 'react-redux';
import {Tabs, ListView, PullToRefresh} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';
// import LazyLoad from '../../../../common/lazy-load/LazyLoad';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './Collect.less';

const tabs = [
    {title: '商品'},
    {title: '店铺'}
];
const {appHistory, native, showInfo} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}, FIELD} = Constants;
class Collect extends BaseComponent {
    constructor(props) {
        super(props);
        const goodsSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        const shopSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            stackShopData: [],
            isLoading: true,
            pagesize: 5
        };
        const value = this.props.tabValue;
        this.state = {
            goodsSource, //商品列表
            shopSource, //店铺列表
            pageShop: 1, //初始化商品当前页码
            pageShopping: 1, //初始化商店当前页码
            pageCount: -1, //商品总页码初始
            pageCountShopping: -1, //店铺总页码初始
            refreshing: false, //刷新状态是否可见
            statusNum: value || 1, //返回时tab状态
            tabKey: value ? value - 1 : 0, //tab状态
            hasMore: true, // 是否有更多数据
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 1.98)
        };
    }

    componentDidMount() {
        this.getCollectionList(this.state.pageShop);
    }

    //获取列表数据
    getCollectionList = (page, noLoading = false) => {
        const {statusNum, tabKey} = this.state;
        this.temp.isLoading = true;
        this.fetch(urlCfg.CollectionList, {data: {type: statusNum, page,  pagesize: this.temp.pagesize}}, noLoading)
            .subscribe((res) => {
                this.temp.isLoading = false;
                if (res && res.status === 0) {
                    this.setState({
                        isEdit: window.isWX && (res.data && res.data.length > 0)
                    });
                    if (tabKey === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data);
                        }
                        if (page >= res.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            goodsSource: prevState.goodsSource.cloneWithRows(this.temp.stackData),
                            pageCountShop: res.page_count,
                            refreshing: false
                        }));
                    } else {
                        if (page === 1) {
                            this.temp.stackShopData = res.data;
                        } else {
                            this.temp.stackShopData = this.temp.stackShopData.concat(res.data);
                        }

                        if (page >= res.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            shopSource: prevState.shopSource.cloneWithRows(this.temp.stackShopData),
                            pageCountShopping: res.page_count,
                            refreshing: false
                        }));
                    }
                }
            });
    };

    //下拉刷新
    onRefresh = () => {
        const {tabKey} = this.state;
        if (tabKey === 0) {
            this.temp.stackData = [];
            this.setState({
                pageShop: 1
            }, () => {
                this.getCollectionList(1, true);
            });
        } else {
            this.temp.stackShopData = [];
            this.setState({
                pageShopping: 1
            }, () => {
                this.getCollectionList(1, true);
            });
        }
    };

    //上拉加载
    onEndReached = () => {
        const {pageShop, pageShopping, pageCountShop, pageCountShopping, tabKey} = this.state;
        if (this.temp.isLoading) return;
        if (tabKey === 0) {
            if (pageShop >= pageCountShop) {
                this.setState({
                    hasMore: false
                });
            } else {
                this.setState((pervState) => ({
                    pageShop: pervState.pageShop + 1
                }), () => {
                    this.getCollectionList(this.state.pageShop);
                });
            }
        } else if (tabKey === 1) {
            if (pageShopping >= pageCountShopping) {
                this.setState({
                    hasMore: false
                });
            } else {
                this.setState((pervState) => ({
                    pageShopping: pervState.pageShopping + 1
                }), () => {
                    this.getCollectionList(this.state.pageShopping);
                });
            }
        }
    };

    //切换tab
    tabChange = (data, index) => {
        // const {shopState, pageShopping} = this.state;
        if (index === 1) {
            this.temp.stackShopData = [];
            this.setState({
                tabKey: 1,
                statusNum: 2,
                shopState: true,
                hasMore: true,
                isEdit: false,
                pageShopping: 1
            }, () => {
                // if (!shopState) {
                //     this.getCollectionList(pageShopping);
                // }
                this.getCollectionList(1);
            });
        } else {
            this.temp.stackData = [];
            this.setState({
                tabKey: 0,
                statusNum: 1,
                hasMore: true,
                isEdit: false,
                pageShop: 1
            }, () => {
                // if (!shopState) {
                //     this.getCollectionList(pageShopping);
                // }
                this.getCollectionList(1);
            });
        }
    };

    //跳往商品详情页增加字段判断；以便回来的时候找到状态
    shopGoods = (value) => {
        const {statusNum} = this.state;
        this.props.setTab(statusNum);
        appHistory.push({pathname: `/goodsDetail?id=${value}`});
    }

    //去往商店
    shopHome = (event, id) => {
        const {statusNum} = this.state;
        this.props.setTab(statusNum);
        appHistory.push(`/shopHome?id=${id}`);
        event.stopPropagation();
    }

    //点击顶部导航右侧按钮 编辑按钮
    changeNavRight = () => {
        const {tabKey} = this.state;
        const arr = tabKey === 0 ? this.temp.stackData.map(item => Object.assign({}, item)) : this.temp.stackShopData.map(item => Object.assign({}, item));
        if (tabKey === 0) {
            this.setState((prevState) => ({
                isEdit: !prevState.isEdit,
                goodsSource: prevState.goodsSource.cloneWithRows(arr)
            }));
        } else {
            this.setState((prevState) => ({
                isEdit: !prevState.isEdit,
                shopSource: prevState.shopSource.cloneWithRows(arr)
            }));
        }
    };

    //点击单选
    onChangeCheck = (id) => {
        const {tabKey} = this.state;
        const arr = [];
        if (tabKey === 0) {
            this.temp.stackData.forEach(data => {
                if (data.id === id) {
                    data.select = !data.select;
                }
                arr.push(Object.assign({}, data));
            });
            this.setState((prevState) => ({
                goodsSource: prevState.goodsSource.cloneWithRows(arr)
            }));
        } else {
            this.temp.stackShopData.forEach(data => {
                if (data.id === id) {
                    data.select = !data.select;
                }
                arr.push(Object.assign({}, data));
            });
            this.setState((prevState) => ({
                shopSource: prevState.shopSource.cloneWithRows(arr)
            }));
        }
    }

    //删除商品或者店铺
    onDelList = () => {
        const {tabKey} = this.state;
        if (tabKey === 0) {
            if (this.temp.stackData.some(item => (item.select))) {
                this.deleteFn(1, this.temp.stackData);
            } else {
                showInfo(Form.No_Select_Select);
            }
        } else if (this.temp.stackShopData.some(item => (item.select))) {
            this.deleteFn(2, this.temp.stackShopData);
        } else {
            showInfo(Form.No_Select_Select);
        }
    }

    //清空
    emptyFn = () => {
        const {tabKey} = this.state;
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Empty_Favorite,
            callbacks: [null, () => { this.deleteFn(tabKey === 0 ? 1 : 2) }]
        });
    }

    //删除函数
    deleteFn = (type, arrAll) => {
        const {tabKey} = this.state;
        const ids = [];
        if (arrAll) {
            arrAll.forEach(item => {
                if (item.select) {
                    ids.push(item.id);
                }
            });
        }
        this.fetch(urlCfg.cancelCollect, {data: {ids, type}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (ids.length > 0) {
                        showInfo(Feedback.Del_Success);
                    } else {
                        showInfo(Feedback.Empty_Success);
                    }
                    if (tabKey === 0) {
                        this.temp.stackData = [];
                        this.setState({
                            pageShop: 1,
                            isEdit: false,
                            hasMore: false,
                            pageCount: -1,
                            goodsArr: []
                        }, () => {
                            this.getCollectionList(this.state.pageShop);
                        });
                    } else {
                        this.temp.stackShopData = [];
                        this.setState({
                            pageShop: 1,
                            isEdit: false,
                            hasMore: false,
                            pageCount: -1,
                            shopArr: []
                        }, () => {
                            this.getCollectionList(this.state.pageShop);
                        });
                    }
                }
            });
    }

    //底部主体内容
    messageMain = (row, row2) => {
        const {tabKey, goodsSource, isEdit, height, shopSource, refreshing, hasMore} = this.state;
        let blockModal = <div/>;
        if (tabKey === 0 ? goodsSource.getRowCount() > 0 : shopSource.getRowCount() > 0) {
            blockModal = (
                <ListView
                    dataSource={tabKey === 0 ? goodsSource : shopSource}
                    initialListSize={this.temp.pagesize}
                    // renderBodyComponent={() => <ListBody/>}
                    renderRow={isEdit ? row : row2}
                    style={{
                        height: height
                    }}
                    pageSize={this.temp.pagesize}
                    onEndReachedThreshold={20}
                    onEndReached={this.onEndReached}
                    renderFooter={() => ListFooter(hasMore)}
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
                />
            );
        } else {
            blockModal = (
                <Nothing text={FIELD.No_Collection}/>
            );
        }
        return blockModal;
    }

    //渲染的结构
    defauleModal = (item) => {
        const {tabKey} = this.state;
        return (
            tabKey === 0 ? (
                <div className="goods" key={item.id} onClick={() => this.shopGoods(item.pr_id)}>
                    <div className="goods-box">
                        <div>
                            {/* <LazyLoad lazyInfo={{imgUrl: item.picpath, offset: -50, overflow: true}}/> */}
                            <img src={item.picpath}/>
                        </div>
                        <div className="desc">
                            <div className="desc-title">{item.title}</div>
                            <div className="goods-sku">
                                {
                                    item.mark && item.mark.length && item.mark.map((data, index) => {
                                        if (index < item.mark.length - 1) {
                                            return <div>{data}<span>|</span></div>;
                                        }
                                        return data;
                                    })
                                }
                            </div>
                            <div className="count">
                                <div className="num">记账量：{item.deposit}</div>
                                {item.status === '0' && <span>已下架</span>}
                                <div className="city">{item.city || '北京'}</div>
                            </div>
                            <div className="pay">
                                <div>销售量：{item.num_sold}</div>
                                <div className="dele">￥{item.price_original}</div>
                            </div>
                            <div className="shop-name">
                                <div className="s-name">
                                    <span className="store-name">{item.shop_name}</span>
                                    <span className="enter-shop" onClick={(event) => this.shopHome(event, item.shop_id)}>
                                        <span>进店</span>
                                        <div className="icon get-into"/>
                                    </span>
                                </div>
                                <div className="goods-price">￥{item.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="shop-content" key={item.id}>
                    <div className="shop-name" onClick={(event) => this.shopHome(event, item.shop_id)}>
                        {/* <LazyLoad lazyInfo={{imgUrl: item.picpath, offset: -30, overflow: true}}/> */}
                        <img
                            src={item.picpath}
                            onError={(e) => { e.target.src = item.df_logo }}
                        />
                        <div className="shop-space ">
                            <p>{item.shop_name}</p>
                            <span className="Shop-Nr">人均消费</span>
                            <span className="Shop-Nr wide">￥{item.consume_per}</span>
                        </div>
                        <div className="button">进店</div>
                    </div>
                    <div className="shop-goods">
                        {
                            item.pr && item.pr.length ? item.pr.map(data => (
                                <div className="item" key={data.title}>
                                    <div className="image" onClick={() => this.shopGoods(data.id)}>
                                        {/* <LazyLoad lazyInfo={{imgUrl: data.picpath, offset: -50, overflow: true}}/> */}
                                        <img src={data.picpath}/>
                                        <span>{data.price}</span>
                                    </div>
                                    <p onClick={() => this.shopGoods(data.id)}>{data.title}</p>
                                </div>
                            )) : ''
                        }
                    </div>
                </div>
            )
        );
    }

    goBackModal = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        //将tab选中状态清除
        this.props.setTab('');
    }

    render() {
        const {isEdit, goodsSource, shopSource, tabKey, height} = this.state;
        const row = (item) => (
            <span key={item.id} className="callect-list-show">
                <div className="callect-list-show-select">
                    <span
                        className={item.select ? 'icon select' : 'icon unselect'}
                        onClick={() => this.onChangeCheck(item.id)}
                    />
                </div>
                {this.defauleModal(item)}
            </span>
        );
        const row2 = item => (
            <span key={item.id} className="callect-list-hide">
                {this.defauleModal(item)}
            </span>
        );
        return (
            <div data-component="collect" data-role="page" className={`collect ${window.isWX ? 'WX-CL' : ''}`}>
                <AppNavBar
                    title="我的收藏"
                    {
                    ...tabKey === 0 && goodsSource.getRowCount() > 0 ? {
                        isEdit,
                        rightEdit: true,
                        changeNavRight: this.changeNavRight
                    } : null
                    }
                    {
                    ...tabKey !== 0 && shopSource.getRowCount() > 0 ? {
                        isEdit,
                        rightEdit: true,
                        changeNavRight: this.changeNavRight
                    } : null
                    }
                    goBackModal={this.goBackModal}
                />
                <Tabs
                    tabs={tabs}
                    swipeable={false}
                    initialPage={this.state.tabKey}
                    onTabClick={this.tabChange}
                >
                    <div className="mainInfo" style={{height: height}}>
                        {this.messageMain(row, row2)}
                        {!isEdit ? null : (
                            <div className="callect-menu">
                                <span
                                    className="callect-menu-left"
                                    onClick={this.emptyFn}
                                >
                            清空
                                </span>
                                <span
                                    className="callect-menu-right"
                                    onClick={this.onDelList}
                                >
                            删除
                                </span>
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        tabValue: base.get('tabValue')
    };
};

const mapDispatchToProps = {
    setTab: actionCreator.setTab,
    showConfirm: actionCreator.showConfirm
};

export default connect(mapStateToProps, mapDispatchToProps)(Collect);
