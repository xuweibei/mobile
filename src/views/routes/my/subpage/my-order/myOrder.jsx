/**我的订单页面 */

import {connect} from 'react-redux';
import {Tabs, PullToRefresh, ListView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';
import LazyLoadIndex  from '../../../../common/lazy-load/LazyLoad';
import CancelOrder from '../../../../common/cancel-order/CancleOrder';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './myOrder.less';

const {appHistory, showSuccess, getUrlParam, showInfo, native, setNavColor, systemApi: {removeValue}, TD} = Utils;
const {TD_EVENT_ID} = Constants;
const {MESSAGE: {Form, Feedback}, FIELD} = Constants;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;

const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 5
};
const tabs = [
    {title: '全部'},
    {title: '待付款'},
    {title: '待发货'},
    {title: '待收货'},
    {title: '待评价'},
    {title: '售后'}
];

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
        retainArr: [],
        navColor: '#ff2d51' //标题头部颜色
    };

    componentWillMount() {
        const num = this.props.orderStatus || this.statusChoose(this.props.location.pathname.split('/')[2]);
        this.init(num);
    }

    componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
        const num = this.statusChoose(nextProps.location.pathname.split('/')[2]);
        if (num !== this.props.orderStatus) {
            this.init(num);
        }
    }

    componentDidMount() {
        this.getInfo();
    }

    init = (num) => {
        this.setState({
            status: num
        }, () => {
            //储存我的订单的tab状态在哪一个
            this.props.setOrderStatus(num);
        });
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
        this.setState({
            hasMore: true
        });
        this.fetch(urlCfg.mallOrder,
            {
                data: {
                    status: status,
                    page,
                    pagesize: temp.pagesize,
                    pageCount: pageCount
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
                        if (page >= res.pageCount) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                            pageCount: res.pageCount,
                            retainArr: prevState.retainArr.concat(res.list),
                            refreshing: false
                        }));

                        const {navColor} = this.state;
                        if (hybrid) {
                            setNavColor('setNavColor', {color: navColor});
                        }
                    }
                }
            });
    }

    //售后接口请求
    refundMllOder = (page, noLoading = false) => {
        temp.isLoading = true;
        const {pageCount} = this.state;
        this.setState({
            hasMore: true
        });
        this.fetch(urlCfg.refundMllOder, {method: 'post', data: {page, pageCount, pagesize: temp.pagesize}}, noLoading)
            .subscribe(res => {
                temp.isLoading = false;
                if (res.status === 0) {
                    if (page === 1) {
                        temp.stackData = res.list;
                    } else {
                        temp.stackData = temp.stackData.concat(res.list);
                    }
                    if (page >= res.pageCount) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    this.setState((prevState) => ({
                        dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                        pageCount: res.pageCount,
                        retainArr: prevState.retainArr.concat(res.list),
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
            retainArr: [],
            hasMore: false
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

    //状态判断
    tabTopName = (num) => {
        // "0待付款;1待发货;2待收货;3待评价"
        const nameAll = new Map([
            ['0', '等待付款'],
            ['1', '等待发货'],
            ['2', '卖家已发货'],
            ['3', '待评价'],
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
            title: Form.Whether_delete,
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
    confirmTake = (id, ev, returnId) => {
        const {showConfirm} = this.props;
        const {status} = this.state;
        showConfirm({
            title: returnId ? Form.No_Error_Has_Return : Form.No_Error_Take,
            callbacks: [null, () => {
                this.fetch(urlCfg.confirmOrder, {data: {id: id, if_refund: returnId ? 1 : ''}})
                    .subscribe((res) => {
                        if (res) {
                            if (res.status === 0) {
                                const dataSource = new ListView.DataSource({
                                    rowHasChanged: (row1, row2) => row1 !== row2
                                });
                                temp.stackData = [];
                                this.setState({
                                    page: 1,
                                    retainArr: [],
                                    dataSource
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
        TD.log(TD_EVENT_ID.MY.ID, TD_EVENT_ID.MY.LABEL.CANCEL_ORDER);
        if (state === 'mastSure' && value) {
            this.fetch(urlCfg.delMallOrder, {
                data: {deal: 0, id: canCelId, reason: value.label, reason_id: value.value}
            })
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
    goToOrderDetail = (id, state, returnId, returnType, ev) => {
        //return_status也就是这里的status大于0就是申请售后的订单了
        if (state > 0) {
            this.refundDetails(returnId, ev);
        } else {
            this.skipDetail(id, returnType);
        }
    }

    //跳转到订单详情页
    skipDetail = (id, returnType) => {
        appHistory.push(`/listDetails?id=${id}&refurn=${returnType ? '1' : ''}`);
    }

    //立即支付
    payNow = (id, orderNum) => {
        //清除一下订单缓存
        removeValue('orderInfo');
        appHistory.push(`/payMoney?orderId=${id}&orderNum=${orderNum}&source=${4}`);
    }

    //申请售后/退款
    serviceRefund = (id, shopId, ev, yes) => {
        appHistory.push(`/applyService?orderId=${id}&shopId=${shopId}&returnType=1&onlyReturnMoney=${yes}`);
        ev.stopPropagation();
    }

    //延长收货
    extendedReceipt = (id, ev) => {
        const {showConfirm} = this.props;
        const {retainArr} = this.state;
        showConfirm({
            title: Form.Whether_Lengthen,
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

    //点击撤销申请
    revoke = (id, ev) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Revocation_Apply,
            btnTexts: ['我再想想', '确认撤销'],
            callbacks: [null, () => {
                this.fetch(urlCfg.revokeOrder, {data: {id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Rovke_Success);
                            this.setState({
                                showModal: false,
                                modalTitle: '',
                                status: 2
                            });
                            //确定撤销后，跳转到待收货那列
                            this.getMallOrder(2, 1);
                            //储存我的订单的tab状态在哪一个
                            this.props.setOrderStatus(2);
                        }
                    });
            }]
        });
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
                    {
                        !item.all_refund && (
                            <div className="button-more icon" onClick={(ev) => this.showRetunButton(item, ev)}>
                                {
                                    item.showButton && <span onClick={(ev) => this.serviceRefund(item.id, item.shop_id, ev, 1)}>申请退款</span>
                                }
                            </div>

                        )
                    }
                    {
                        !item.all_refund && <div className="evaluate-button" onClick={() => this.remindDelivery([item.id, item.can_tip])}>提醒发货</div>
                    }

                </div>
            );
            break;
        case '2'://待收货
            blockModal = (
                <div className="buttons">
                    {
                        !item.all_refund && (
                            <div className="button-more icon" onClick={(ev) => this.showRetunButton(item, ev)}>
                                {
                                    item.showButton && <span onClick={(ev) => this.serviceRefund(item.id, item.shop_id, ev)}>申请退款</span>
                                }
                            </div>
                        )
                    }
                    <div className="look-button" onClick={(ev) => this.extendedReceipt(item.id, ev)}>延长收货</div>
                    <div className="look-button" onClick={(ev) => this.goApplyService(item.id, ev)}>查看物流</div>
                    <div className="evaluate-button" onClick={(ev) => this.confirmTake(item.id, ev, item.all_refund)}>确认收货</div>
                    {/* {
                        item.all_refund === 1 ? <div className="evaluate-button" onClick={(ev) => this.revoke(item.pr_list[0].return_id, ev)}>撤销申请</div> : <div className="evaluate-button" onClick={(ev) => this.confirmTake(item.id, ev)}>确认收货</div>
                    } */}

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
        // case '12'://售后
        case '10'://已取消
        case '13'://商家取消
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

    //修改申请
    application = (ev, id) => {
        appHistory.push(`/applyDrawback?id=${id}&type=0&refurn=1`); //refurn 退款状态下，修改时仅可以选择 仅退款
        ev.stopPropagation();
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
            pageCount: -1,
            retainArr: []
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
        if (pageCount > page) {
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
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    //返回到我的页面
    goToBack = () => {
        const hybird = process.env.NATIVE;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        if (hybird) {
            native('goBack');
        } else if (appHistory.length() === 0) {
            appHistory.push('/my');
        } else if (type === 'car') {
            appHistory.replace('/home');
        } else {
            appHistory.goBack();
        }
        //清除订单tab的状态
        this.props.setOrderStatus('');
    }

    render() {
        const {dataSource, hasMore, height, status, canStatus, refreshing, navColor} = this.state;
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
                    <div className="right">{item.return_name ? item.return_name : this.tabTopName(item.status)}</div>
                    {/* <div className="right">{item.return_status !== '0' ? item.return_name : this.tabTopName(item.status)}</div> */}
                </div>
                {item.pr_list && item.pr_list.map(items => (
                    <div className="goods" key={item.id} onClick={(ev) => this.goToOrderDetail(item.id, item.return_status, item.return_id, items.return_types, ev)}>
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
                                    {items.property_content && items.property_content.map(pro => <div className="goods-size" key={pro}>{pro}</div>)}
                                    <div>规格</div>
                                </div>
                                <div className="sku-right">x{items.num}</div>
                            </div>
                            <div className="btn-keep">记账量：{items.deposit}</div>
                            <div className="buttons">{items.return_name}</div>
                            <div className="buttons drawback">
                                {item.is_shoper === 0 && item.status === '5' && <div className="evaluate-button" onClick={(ev) => this.refundDetails(item.id, ev)}>查看详情</div>}
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
                        {//售后状态下 退款申请中
                            item.is_shoper === 0 && item.return_status === '1' && (
                                <div className="buttons">
                                    <div className="look-button" onClick={(ev) => this.revoke(item.return_id, ev)}>撤销申请</div>
                                    <div onClick={(ev) => this.application(ev, item.return_id)} className="evaluate-button">修改申请</div>
                                </div>
                            )
                        }
                        { //售后状态下 //商家已同意  is_shoper 为0是消费者的订单 1是商家的订单
                            item.is_shoper === 0 && item.return_status === '2' && <div className="evaluate-button" onClick={(ev) => this.revoke(item.return_id, ev)}>撤销申请</div>
                        }
                        {item.is_shoper === 0 && this.bottomModal(item)}
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="my-order" data-role="page" className={`my-order ${window.isWX ? 'WX' : ''}`}>
                {
                    window.isWX ? null : (<AppNavBar title="线上订单" backgroundColor={navColor} goBackModal={this.goToBack} redBackground goToSearch={this.goToSearch} rightShow search/>)
                }
                {   //弹出取消弹框
                    canStatus &&  (<CancelOrder canStateChange={this.canStateChange}/>)
                }
                <div className="tabs">
                    <Tabs
                        tabs={tabs}
                        page={status + 1}
                        animated={false}
                        useOnPan
                        swipeable={false}
                        onChange={this.tabChange}
                        activeKey={new Date()}
                    >
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
                                ) : <Nothing text={FIELD.No_Order}/>
                            }
                        </div>
                    </Tabs>
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
