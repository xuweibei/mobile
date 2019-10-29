/**我的订单页面 之搜索 */

import React from 'react';
import {connect} from 'react-redux';
import {PullToRefresh, ListView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import LazyLoadIndex  from '../../../../../common/lazy-load/LazyLoad';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import Animation from '../../../../../common/animation/Animation';
import './ShopDetail.less';

const {appHistory, showSuccess, showInfo, getUrlParam} = Utils;
const {MESSAGE: {Form, Feedback}, FIELD, navColorR} = Constants;
const {urlCfg} = Configs;

const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 5
};

class MyOrderSearch extends BaseComponent {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }), //长列表容器
        refreshing: false, //是否显示刷新状态
        height: document.documentElement.clientHeight - (window.isWX ?  window.rem * 1.08 : window.rem * 1.78),
        status: -1, //tab状态
        delOrder: null, //删除订单id
        remind: null, //提醒状态
        page: 1,  //当前页数
        pagesize: 10,  //每页条数
        pageCount: -1,
        hasMore: false, //底部请求状态文字显示情况
        retainArr: []
    };

    componentDidMount() {
        this.getInfo();
    }

    //请求数据
    getInfo = () => {
        const {status, page} = this.state;
        this.getMallOrder(status, page);
    }

    //获取订单列表
    getMallOrder(status, page, noLoading = false) {
        const {pageCount} = this.state;
        temp.isLoading = true;
        this.fetch(urlCfg.mallOrder,
            {data:
            {
                page,
                pagesize: temp.pagesize,
                pageCount,
                status: -1,
                key: decodeURI(getUrlParam('keywords', encodeURI(this.props.location.search)))
            }
            }, noLoading)
            .subscribe((res) => {
                temp.isLoading = false;
                if (res && res.status === 0) {
                    if (page === 1) {
                        temp.stackData = res.list;
                    } else {
                        temp.stackData = temp.stackData.concat(res.list);
                    }
                    //为待付款需要取消订单的时候，或者售后订单需要删除的时候，将数据储存一份。
                    this.setState((prevState) => ({
                        retainArr: prevState.retainArr.concat(res.list)
                    }));
                    if (page >= res.pageCount) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    this.setState((prevState) => ({
                        dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                        pageCount: res.pageCount,
                        refreshing: false
                    }
                    ));
                }
            });
    }

    //进店
    goShopHome = (id) => {
        appHistory.push(`/shopHome?id=${id}`);
    }

    //底部提示
    footerMain = () => (
        <div style={{padding: 10, textAlign: 'center'}}>
            {this.state.hasMore ? '正在加载' : ''}
        </div>
    );

    //状态判断
    tabTopName = (num) => {
        // "0待付款;1待发货;2待收货;3待评价"
        const nameAll = new Map([
            ['0', '等待付款'],
            ['1', '等待发货'],
            ['2', '卖家已发货'],
            ['3', '交易完成'],
            ['4', '交易完成'],
            ['5', '退款中'],
            ['10', '已取消'],
            ['11', '已删除'],
            ['12', '申请退款成功关闭订单'],
            ['13', '商家关闭订单'],
            ['14', '商家删除订单']
        ]);
        return nameAll.get(num);
    }

    //删除订单
    deleteOrder = (id) => {
        const {showConfirm} = this.props;
        const {retainArr} = this.state;
        showConfirm({
            title: '确定删除该订单？',
            callbacks: [null, () => {
                this.fetch(urlCfg.delMallOrder, {data: {deal: 1, id}})
                    .subscribe((res) => {
                        if (res && res.status === 0) {
                            //操作数据，将已经选中取消的id进行去除，
                            const arr = retainArr.filter(item => item.id !== id);
                            this.setState((prevState) => ({
                                dataSource: prevState.dataSource.cloneWithRows(arr),
                                retainArr: arr
                            }));
                        }
                    });
            }]
        });
    }

    //确认收货
    confirmTake = (id, ev) => {
        const {showConfirm} = this.props;
        const {status} = this.state;
        showConfirm({
            title: '是否确认收货！',
            callbacks: [null, () => {
                this.fetch(urlCfg.confirmOrder, {data: {id}})
                    .subscribe((res) => {
                        if (res && res.status === 0) {
                            const dataSouece = new ListView.DataSource({
                                rowHasChanged: (row1, row2) => row1 !== row2
                            });
                            temp.stackData = [];
                            this.setState({
                                page: 1,
                                retainArr: [],
                                dataSouece
                            }, () => {
                                this.getMallOrder(status, 1);
                            });
                        }
                    });
            }]
        });
        ev.stopPropagation();
    }

    //取消订单状态改变  确认取消
    canStateChange = (state, value) => {
        const {canCelId, retainArr} = this.state;
        if (state === 'mastSure' && value) {
            this.fetch(urlCfg.delMallOrder, {data: {deal: 0, id: canCelId, reason: value.label, reason_id: value.value}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        showSuccess(Feedback.Cancel_Success);
                        //操作数据，将已经选中取消的id进行去除，
                        const arr = retainArr.filter(item => item.id !== canCelId);
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(arr),
                            retainArr: arr
                        }));
                    }
                });
        }
        this.setState({
            canStatus: false
        });
    }

    //点击订单的时候的跳转
    goToOrderDetail = (id, state, ev) => {
        //5为退款详情
        if (state === '5') {
            this.refundDetails(id, ev);
        } else {
            this.skipDetail(id);
        }
    }

    //跳转到订单详情页
    skipDetail = (id) => {
        appHistory.push(`/listDetails?id=${id}`);
    }

    //立即支付
    payNow = (id, orderNum) => {
        appHistory.push(`/payMoney?orderId=${id}&orderNum=${orderNum}&source=${4}`);
    }

    //申请售后/退款
    serviceRefund = (id, shopId, ev) => {
        appHistory.push(`/applyService?orderId=${id}&shopId=${shopId}&returnType=1`);
        ev.stopPropagation();
    }

    //延长收货
    extendedReceipt = (id, ev) => {
        const {showConfirm} = this.props;
        const {retainArr} = this.state;
        showConfirm({
            title: (Form.Whether_Lengthen),
            callbacks: [null, () => {
                this.fetch(urlCfg.delayedReceipt, {data: {order_id: id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.receipt_Success);
                            const arr = [];
                            retainArr.forEach((item) => {
                                if (item.id === id) {
                                    item.delayed_receiving = '1';
                                }
                                item.showButton = false;
                                arr.push(Object.assign({}, item));
                            });
                            this.setState((prevState) => ({
                                dataSource: prevState.dataSource.cloneWithRows(arr),
                                retainArr: arr
                            }));
                        }
                    });
            }]
        });
        ev.stopPropagation();
    }

    //查看物流
    goApplyService = (id, ev) => {
        appHistory.push(`/logistics?lgId=${id}`);
        ev.stopPropagation();
    }

    //立即评价
    promptlyEstimate = (id, ev) => {
        appHistory.push(`/myEvaluate?id=${id}`);
        ev.stopPropagation();
    }

    //提醒发货
    remindDelivery = (data) => {
        if (data[1] === 1) {
            this.fetch(urlCfg.remindOrder, {data: {id: data[0]}})
                .subscribe((res) => {
                    if (res && res.status === 0) {
                        showInfo(res.message);
                    }
                });
        } else {
            showInfo(Feedback.Waiting);
        }
    }

    //跳转到退款详情页
    refundDetails = (id, ev) => {
        appHistory.push(`/refundDetails?id=${id}`);
        ev.stopPropagation();
    }


    //底部按钮
    bottomModal = (item) => {
        let blockModal = <div/>;
        switch (item.status) {
        case '0'://待付款
            blockModal = (
                <div className="buttons">
                    <div onClick={() => this.setState({canStatus: true, canCelId: item.id})} className="look-button">取消订单</div>
                    <div onClick={() => this.payNow(item.id, item.order_no)} className="evaluate-button">立即付款</div>
                </div>
            );
            break;
        case '1': //待发货
            blockModal = (
                <div className="buttons">
                    <div className="evaluate-button" onClick={() => this.remindDelivery([item.id, item.can_tip])}>提醒发货</div>
                </div>
            );
            break;
        case '2'://待收货
            blockModal = (
                <div className="buttons">
                    {
                        item.delayed_receiving === '0' && <div className="look-button" onClick={(ev) => this.extendedReceipt(item.id, ev)}>延长收货</div>
                    }
                    <div className="look-button" onClick={(ev) => this.goApplyService(item.id, ev)}>查看物流</div>
                    <div className="evaluate-button" onClick={(ev) => this.confirmTake(item.id, ev)}>确认收货</div>
                </div>
            );
            break;
        case '3'://待评价
            blockModal = (
                <div className="buttons">
                    <div className="look-button" onClick={(ev) => this.goApplyService(item.id, ev)}>查看物流</div>
                </div>
            );
            break;
        case '6'://售后
            blockModal = (
                <div className="buttons">
                    <div className="delete-button" onClick={() => this.deleteOrder(item.id)}>删除</div>
                </div>
            );
            break;
        default:
            blockModal = <div/>;
        }
        return blockModal;
    }

    //搜索点击
    goToSearch = () => {
        appHistory.push('/shop-search');
    }

    //下拉刷新
    onRefresh = () => {
        const {status} = this.state;
        this.setState({
            page: 1,
            refreshing: true,
            hasMore: true,
            pageCount: -1
        }, () => {
            temp.stackData = [];
            this.getMallOrder(status, 1, true);
        });
    };

    //上拉加载
    onEndReached = () => {
        const {page, pageCount, status} = this.state;
        if (temp.isLoading) return;
        this.setState({isLoading: true});
        if (page >= pageCount) {
            //加载完成
            this.setState({hasMore: false});
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1,
                hasMore: true
            }), () => {
                this.getMallOrder(status, this.state.page);
            });
        }
    };

    //返回到我的页面
    goToBack = () => {
        appHistory.goBack();
    }

    render() {
        const {dataSource, height, canStatus, refreshing} = this.state;
        const row = item => (
            <div className="shop-lists" >
                <div className="shop-name" onClick={() => this.goShopHome(item.shop_id)}>
                    <div className="shop-title">
                        <LazyLoadIndex lazyInfo={{offset: -30, imgUrl: item.picpath, overflow: true}}/>
                        <p>{item.shopName}</p>
                        <div className="icon enter"/>
                    </div>
                    <div className="right">{this.tabTopName(item.status)}</div>
                </div>
                {item.pr_list && item.pr_list.map(items => (
                    <div className="goods" onClick={(ev) => this.goToOrderDetail(item.id, item.status, ev)}>
                        <div className="goods-left">
                            <div>
                                <LazyLoadIndex lazyInfo={{offset: -30, imgUrl: items.pr_picpath, overflow: true}}/>
                            </div>
                        </div>
                        <div className="goods-right">
                            <div className="goods-desc">
                                <div className="desc-title">{items.pr_title}</div>
                                <div className="price">￥{items.price}</div>
                            </div>
                            <div className="goods-sku">
                                <div className="sku-left">
                                    {items.property_content && items.property_content.map(pro => <div className="goods-size">{pro}</div>)}
                                </div>
                                <div className="sku-right">x{items.pr_num}</div>
                            </div>
                            <div className="btn-keep">记账量：{items.deposit}</div>
                        </div>
                    </div>
                ))}
                <div className="shop-bottom">
                    <div className="right-bottom">
                        <div className="total-count">
                            总记账量：<span>{item.all_price}</span>
                        </div>
                        <div className="total-price">
                            <div className="total-price-left">共{item.pr_count}件商品</div>
                            <div className="total-price-right"><span>合计：</span><span className="zxa">{item.all_price}元</span></div>
                        </div>
                        {this.bottomModal(item)}
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="my-order" data-role="page" className={`online-transaction ${window.isWX ? 'WX' : ''}`}>
                {
                    window.isWX ? null : (<AppNavBar title="线上订单" backgroundColor={navColorR} redBackground goBackModal={this.goToBack} white color={navColorR}/>)
                }
                {   //弹出取消弹框
                    canStatus &&  (<CancelOrder canStateChange={this.canStateChange}/>)
                }
                <div className="tabs">
                    <div className="shop-list">
                        {
                            dataSource.getRowCount() > 0 ? (
                                <ListView
                                    dataSource={dataSource}
                                    initialListSize={temp.pagesize}
                                    renderRow={row}
                                    style={{
                                        height: height
                                    }}
                                    pageSize={temp.pagesize}
                                    onEndReachedThreshold={30}
                                    onEndReached={this.onEndReached}
                                    renderFooter={this.footerMain}
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
                            ) : <Nothing title="" text={FIELD.No_Order}/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm
};

export default connect(null, mapDispatchToProps)(MyOrderSearch);
