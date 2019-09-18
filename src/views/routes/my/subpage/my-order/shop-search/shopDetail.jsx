/**我的订单页面 */

import React from 'react';
import {connect} from 'react-redux';
import {PullToRefresh, ListView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import LazyLoadIndex  from '../../../../../common/lazy-load/LazyLoad';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import Animation from '../../../../../common/animation/Animation';
import './ShopSearch.less';

const {appHistory, showSuccess, showInfo, getUrlParam} = Utils;
const {MESSAGE: {Form, Feedback}, FIELD} = Constants;
const {urlCfg} = Configs;

const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 5
};

class MyOrder extends BaseComponent {
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
        if (status === 4) { //退款申请成功后，返回售后列表
            this.refundMllOder(page);
        } else {
            this.getMallOrder(status, page);
        }
    }

    //进入订单页面，判断为什么状态
    statusChoose = (str) => {
        let numStr = -1;
        switch (str) {
        case 'fk':
            numStr = 0;
            break;
        case 'fh':
            numStr = 1;
            break;
        case 'sh':
            numStr = 2;
            break;
        case 'pj':
            numStr = 3;
            break;
        case 'ssh':
            numStr = 4;
            break;
        default:
            numStr = -1;
        }
        return numStr;
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
                pageCount: pageCount,
                status: -1,
                key: decodeURI(getUrlParam('keywords', encodeURI(this.props.location.search)))
            }
            }, noLoading)
            .subscribe((res) => {
                if (res) {
                    temp.isLoading = false;
                    if (res.status === 0) {
                        if (page === 1) {
                            temp.stackData = res.list;
                        } else {
                            temp.stackData = temp.stackData.concat(res.list);
                        }
                        document.onclick =  () => { res.list.forEach(item => { item.showButton = false }) };
                        res.list.forEach(item => { item.showButton = false });
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
                }
            });
    }

    //售后接口请求
    refundMllOder = (page, noLoading = false) => {
        temp.isLoading = true;
        const {pageCount} = this.state;
        this.fetch(urlCfg.refundMllOder, {method: 'post', data: {page, pageCount, pagesize: temp.pagesize}}, noLoading)
            .subscribe(res => {
                temp.isLoading = false;
                if (res.status === 0) {
                    if (page === 1) {
                        temp.stackData = res.list;
                    } else {
                        temp.stackData = temp.stackData.concat(res.list);
                    }
                    //为待付款需要取消订单的时候，或者售后订单需要删除的时候，将数据储存一份。
                    this.setState((prevState) => ({
                        retainArr: prevState.retainArr.concat(res.list)
                    }));
                    this.setState((prevState) => ({
                        dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                        pageCount: res.pageCount,
                        refreshing: false
                    }
                    ));
                }
            });
    }

    //tab状态变更
    tabChange = (data, index) => {
        const dataSource2 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        const status = index - 1;
        //储存我的订单的tab状态在哪一个
        this.props.setOrderStatus(status);
        this.setState({
            page: 1,
            status,
            pageCount: -1,
            dataSource: dataSource2,
            retainArr: []
        }, () => {
            temp.stackData = [];
            if (status === 4) {
                this.refundMllOder(this.state.page);
            } else {
                this.getMallOrder(this.state.status, this.state.page);
            }
        });
    };

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
            ['3', '待评价'],
            ['4', '交易完成']
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
                this.fetch(urlCfg.delMallOrder, {data: {deal: 1, id: id}})
                    .subscribe((res) => {
                        if (res) {
                            if (res.status === 0) {
                            //操作数据，将已经选中取消的id进行去除，
                                const arr = retainArr.filter(item => item.id !== id);
                                this.setState((prevState) => ({
                                    dataSource: prevState.dataSource.cloneWithRows(arr),
                                    retainArr: arr
                                }));
                            }
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
                this.fetch(urlCfg.confirmOrder, {data: {id: id}})
                    .subscribe((res) => {
                        if (res) {
                            if (res.status === 0) {
                                const dataSouece = new ListView.DataSource({
                                    rowHasChanged: (row1, row2) => row1 !== row2
                                });
                                temp.stackData = [];
                                this.setState({
                                    page: 1,
                                    retainArr: [],
                                    dataSouece
                                }, () => {
                                    this.getMallOrder(status, this.state.page);
                                });
                            }
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
            this.fetch(urlCfg.delMallOrder, {method: 'post', data: {deal: 0, id: canCelId, reason: value.label, reason_id: value.value}})
                .subscribe(res => {
                    if (res.status === 0) {
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
                this.fetch(urlCfg.delayedReceipt, {method: 'post', data: {order_id: id}})
                    .subscribe(res => {
                        if (res.status === 0) {
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
                    if (res.status === 0) {
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

    //控制显示与否申请退款按钮
    showRetunButton = (item, ev) => {
        const {retainArr} = this.state;
        const arr = [];
        retainArr.forEach(value => {
            if (item.id === value.id) {
                value.showButton = !value.showButton;
            }
            //赋址改变，为重新渲染
            arr.push(Object.assign({}, value));
        });
        this.setState((prevState) => ({
            dataSource: prevState.dataSource.cloneWithRows(arr),
            retainArr: arr
        }));
        ev.stopPropagation();
    }

    //点击其他位置，将弹出的 申请退款 按钮隐藏
    closeButton = () => {
        const {retainArr} = this.state;
        const arr = [];
        retainArr.forEach(value => {
            value.showButton = false;
            //赋址改变，为重新渲染
            arr.push(Object.assign({}, value));
        });
        this.setState((prevState) => ({
            dataSource: prevState.dataSource.cloneWithRows(arr),
            retainArr: arr
        }));
    }

    //发表追评
    publishReview = (id, ev) => {
        appHistory.push(`/publishReview?id=${id}`);
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
                    <div className="button-more icon" onClick={(ev) => this.showRetunButton(item, ev)}>
                        {
                            item.showButton && <span onClick={(ev) => this.serviceRefund(item.id, item.shop_id, ev)}>申请退款</span>
                        }
                    </div>
                    <div className="evaluate-button" onClick={() => this.remindDelivery([item.id, item.can_tip])}>提醒发货</div>
                </div>
            );
            break;
        case '2'://待收货
            blockModal = (
                <div className="buttons">
                    <div className="button-more icon" onClick={(ev) => this.showRetunButton(item, ev)}>
                        {
                            item.showButton && <span onClick={(ev) => this.serviceRefund(item.id, item.shop_id, ev)}>申请退款</span>
                        }
                    </div>
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
                    <div className="evaluate-button" onClick={(ev) => this.promptlyEstimate(item.id, ev)}>立即评价</div>
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

    //点击多选
    checkAllStatus = (data, ev) => {
        const {retainArr} = this.state;
        const arr = [];
        const checkArr = [];//选中的订单集合
        retainArr.forEach(item => {
            if (data.id === item.id) {
                item.select = !item.select;
            }
            if (item.select) {
                checkArr.push(item);
            }
            //赋址改变，为重新渲染
            arr.push(Object.assign({}, item));
        });
        this.setState((prevState) => ({
            dataSource: prevState.dataSource.cloneWithRows(arr),
            retainArr: arr,
            checkArr
        }));

        ev.stopPropagation();
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
            if (status === 4) {
                this.refundMllOder(this.state.page, true);
            } else {
                this.getMallOrder(status, this.state.page, true);
            }
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
                if (status === 4) {
                    this.refundMllOder(this.state.page);
                } else {
                    this.getMallOrder(status, this.state.page);
                }
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
                        {/* { 是否多条订单一起付款
                            item.status === '0' && (
                                <span
                                    className={`icon ${item.select ? 'icon-select-z' : 'icon-unselect-z'}`}
                                    onClick={(ev) => this.checkAllStatus(item, ev)}
                                />
                            )
                        } */}
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
                                    <div>规格</div>
                                </div>
                                <div className="sku-right">x{items.pr_num}</div>
                            </div>
                            <div className="btn-keep">记账量：{items.deposit}</div>
                            <div className="buttons drawback">
                                {(item.status === '5') && <div className="evaluate-button" onClick={(ev) => this.refundDetails(item.id, ev)}>查看详情</div>}
                            </div>
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
            <div data-component="my-order" data-role="page" className={`my-order ${window.isWX ? 'WX' : ''}`}>
                {
                    window.isWX ? null : (<AppNavBar title="线上订单" goBackModal={this.goToBack} white/>)
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
                                    // renderBodyComponent={() => <ListBody/>}
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
                                                // activate: <Animation ref={ref => { this.Animation = ref }}/>,
                                                // deactivate: ' ',
                                                release: <Animation ref={ref => { this.Animation = ref }}/>
                                                // finish: <Animation ref={ref => { this.Animation = ref }}/>
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

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        orderStatus: base.get('orderStatus')
    };
};

const mapDispatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus,
    showConfirm: actionCreator.showConfirm
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrder);
