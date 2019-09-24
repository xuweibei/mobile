/**
 * 商品列表页
 */

import {ListView, Flex, PullToRefresh} from 'antd-mobile';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import {categoryActionCreator} from '../../actions/index';
import Nothing from '../../../../common/nothing/Nothing';
import LazyLoadIndex from '../../../../common/lazy-load/LazyLoad';
import Animation from '../../../../common/animation/Animation';

const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, native} = Utils;
const filterData = [
    {
        title: '综合'
    },
    {
        title: '销量'
    },
    {
        title: '价格'
    }
];


const ListBody = (props) => (
    <div className="list-wrap">
        {props.children}
    </div>
);
ListBody.defaultProps  = {
    children: []
};
ListBody.propTypes  = {
    children: PropTypes.array
};

class CategoryListView extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.temp = {
            stackData: [],
            isLoading: true,
            pagesize: 10
        };

        this.state = {
            dataSource,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 1.99),
            hasFetch: false,
            page: 1,
            pageCount: -1,
            currentIndex: null,
            refreshing: false,
            hasMore: true,
            flag: [false, false, false],
            showStatus: [false, false, false],
            initStatus: false,
            compareIndex: null,
            id: props.id.toString()
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getCategoryList();
    }

    componentWillReceiveProps(data, value) {
        if (data.id !== this.state.id) {
            this.setState({
                id: data.id
            }, () => {
                this.getCategoryList();
            });
        }
    }

    // 初始获取获取分类列表数据
    getCategoryList = (num, noLoading) => {
        const {currentIndex, showStatus, id} = this.state;
        if (num) {
            this.setState({
                initStatus: true
            });
            if (num % 2 === 0) {
                showStatus[currentIndex] = !showStatus[currentIndex];
            } else {
                showStatus[currentIndex] = !showStatus[currentIndex];
            }
        }

        const shopId = this.props.shoppingId;
        const {page} = this.state;
        const keywords = this.props.keywords;
        this.temp.isLoading = true;

        //判断是否是店铺搜索
        if (shopId) {
            this.fetch(urlCfg.allGoodsInTheShop, {
                data: {
                    page: page,
                    pagesize: this.temp.pagesize,
                    id: shopId || '',
                    key: '' || keywords
                }
            })
                .subscribe((res) => {
                    this.temp.isLoading = false;
                    if (res.status === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data.data);
                        }
                        this.setState((prevState) => (
                            {
                                dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                                pageCount: res.page_count,
                                hasFetch: true
                            }
                        ));
                    }
                });
        } else {
            this.fetch(urlCfg.getCategoryList, {
                data: {
                    page: page,
                    pagesize: this.temp.pagesize,
                    id: '',
                    types: 2,
                    order: num || null,
                    keyword: '' || keywords
                }
            }, noLoading)
                .subscribe((res) => {
                    this.temp.isLoading = false;
                    if (res.status === 0) {
                        if (this.state.isLoading) {
                            setTimeout(() => {
                                this.setState({
                                    refreshing: false,
                                    isLoading: false
                                });
                            }, 600);
                        }
                        if (page === 1) {
                            this.temp.stackData = res.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data);
                        }
                        this.setState((prevState) => (
                            {
                                dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                                pageCount: res.page_count,
                                hasFetch: true
                            }
                        ));
                    }
                });
        }
    };

    //emptyGoTo 空白页跳转
    emptyGoTo = () => {
        const hybrid = process.env.NATIVE;
        if (hybrid) {
            native('goHome');
            appHistory.reduction();
        } else {
            appHistory.push('/home');
        }
    };

    onEndReached = () => {
        if (this.temp.isLoading) return;
        const {page, pageCount} = this.state;
        if (page >= pageCount) {
            this.setState({hasMore: false});
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getCategoryList();
            });
        }
    };

    // 跳转商品详情
    switchTo = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //跳转到店铺
    goToShop = (e, id) => {
        e.stopPropagation(); //阻止冒泡
        appHistory.push(`/shopHome?id=${id}`);
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
        }, () => {
            this.getCategoryList(0, true);
        });
    };

    //底部提示
    footer = () => (
        !this.state.hasMore && (
            // FIXME: 样式写less里面
            <div style={{padding: 10, textAlign: 'center'}}>加载完成</div>
        )
    )

    // 过滤tab点击切换
    filterTab = (index) => {
        this.listViewCon.scrollTo(0, 0);  // 切换标签的时候滚动回滚到顶部
        this.setState({
            currentIndex: index,
            page: 1,
            hasMore: true
        }, () => {
            if (index === 0) {
                this.setState((pre) => ({
                    flag: !pre.flag
                }));
                if (this.state.flag) {
                    this.getCategoryList(5);
                } else {
                    this.getCategoryList(6);
                }
            } else if (index === 1) {
                this.setState((pre) => ({
                    flag: !pre.flag
                }));
                if (this.state.flag) {
                    this.getCategoryList(3);
                } else {
                    this.getCategoryList(4);
                }
            } else if (index === 2) {
                this.setState((pre) => ({
                    flag: !pre.flag
                }));
                if (this.state.flag) {
                    this.getCategoryList(1);
                } else {
                    this.getCategoryList(2);
                }
            }
        });
    };

    //渲染排序
    renderLine = (initStatus, index, currentIndex, showStatus) => {
        // console.log(showStatus);
        if (initStatus && index === currentIndex) {
            return (
                showStatus[currentIndex] && index === currentIndex ? (
                    <div className="icon-box">
                        <span className="icon list-icon-top"/>
                        <span className="icon list-icon-bdown"/>
                    </div>
                ) : (
                    <div className="icon-box">
                        <span className="icon list-icon-btop"/>
                        <span className="icon list-icon-down"/>
                    </div>
                )
            );
        }
        return (
            <span className="icon list-icon"/>
        );
    };

    render() {
        const {dataSource, height, hasFetch, currentIndex, showStatus, initStatus, refreshing} = this.state;
        const shopId = this.props.shoppingId;
        const row = (item) => (
            <div className="goods" key={item.id} onClick={() => this.switchTo(item.id)}>
                <div className="goods-name">
                    <div className="goods-picture">
                        <LazyLoadIndex lazyInfo={{offset: -50, overflow: true, imgUrl: item.picpath}}/>
                    </div>
                    <div className="goods-information">
                        <div className="goods-explain">{item.title}</div>
                        <div className="bookkeeping">
                            <span className="bookkeeping-left">记账量：{item.deposit}</span>
                            <span className="bookkeeping-right">北京</span>
                        </div>
                        <div className="payment">
                            <span>{item.num_sold}人付款</span>
                            <span className="payment-right">￥{item.deposit}</span>
                        </div>
                        <div className="price">
                            {!shopId && (
                                <div className="price-left">
                                    <span className="enter-left">店铺名称{item.shopName}</span>
                                    <span
                                        className="enter-right"
                                        onClick={(e) => this.goToShop(e, item.shop_id)}
                                    >
                                    进店
                                        <span className="icon"/>
                                    </span>
                                </div>
                            ) }
                            <div className="price-right">￥{item.price}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
        return (
            hasFetch && (
                dataSource && dataSource.getRowCount() > 0
                    ? (
                        <React.Fragment>
                            <div className="classify-screen-box">
                                <div className="classify-screen">
                                    <Flex className="order-list">
                                        {
                                            filterData.map((item, index) => (
                                                <Flex.Item
                                                    className="screen-list"
                                                    onClick={() => this.filterTab(index)}
                                                    key={item.title}
                                                >
                                                    <div className="list">
                                                        <div
                                                            className={`list-text ${index === currentIndex ? 'listRed' : ''}`}
                                                        >{item.title}
                                                        </div>
                                                        {
                                                            this.renderLine(initStatus, index, currentIndex, showStatus)
                                                        }
                                                    </div>
                                                </Flex.Item>
                                            ))
                                        }
                                    </Flex>
                                </div>
                                {/*<WhiteSpace size="md"/>*/}
                                <ListView
                                    ref={ref => { this.listViewCon = ref }}
                                    dataSource={dataSource}
                                    initialListSize={this.temp.pagesize}
                                    renderBodyComponent={() => <ListBody/>}
                                    renderRow={row}
                                    style={{
                                        height
                                    }}
                                    pageSize={this.temp.pagesize}
                                    onEndReachedThreshold={100}
                                    onEndReached={this.onEndReached}
                                    // renderFooter={this.footer}
                                    pullToRefresh={(
                                        <PullToRefresh
                                            refreshing={refreshing}
                                            onRefresh={this.onRefresh}
                                            damping={100}
                                            indicator={{
                                                release: <Animation ref={ref => { this.Animation = ref }}/>
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </React.Fragment>

                    )
                    : (
                        <Nothing text={FIELD.Not_Found} title="我再去瞄两眼" onClick={this.emptyGoTo}/>
                    )
            )
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
    setshoppingId: actionCreator.setshoppingId,
    hideLoading: actionCreator.hideLoading,
    fresh: categoryActionCreator.setFresh
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListView);
