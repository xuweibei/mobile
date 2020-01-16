import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import LazyLoadIndex  from '../../../../../common/lazy-load/LazyLoad';
import Nothing from '../../../../../common/nothing/Nothing';
import MyListView from '../../../../../common/my-list-view/MyListView';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './SelfSearch.less';

const {appHistory, getUrlParam, showInfo, systemApi: {removeValue}} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}, FIELD, navColorR} = Constants;

class ReDetail extends BaseComponent {
    state ={
        refreshing: false, //是否在下拉刷新时显示指示器
        isLoading: false, //是否在上拉加载时显示提示
        hasMore: false, //是否有数据可请求
        page: 1, //列表第几页
        pageSize: 10, //每页多少条
        pageCount: -1, //一共有多少页
        pageList: [], //列表信息
        orderId: 0, //订单id
        height: document.documentElement.clientHeight - (window.isWX ? 0.75 : window.rem * 1.8)
    }

    componentDidMount() {
        this.getList();
    }

    //获取订单列表信息
    getList = (drawCircle = false) => {
        //drawCircle 是否显示转圈圈动画 false 不显示  true 显示
        const {pageSize, pageCount, page} = this.state;
        this.fetch(urlCfg.ondownSearch, {data: {page, pagesize: pageSize, pageCount, status: 0, key: decodeURI(getUrlParam('keywords', encodeURI(this.props.location.search)))}}, drawCircle)
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (page === 1) {
                        this.setState({
                            refreshing: false,
                            pageList: res.list,
                            pageCount: res.pageCount
                        });
                    } else {
                        this.setState(prevState => ({
                            pageList: prevState.pageList.concat(res.list)
                        }));
                    }
                }
            });
    }

    //选择列表状态
    tabChange = (data, index) => {
        this.setState({
            page: 1,
            hasMore: false,
            pageCount: -1,
            status: index
        }, () => {
            this.getList();
        });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            page: 1,
            hasMore: false,
            refreshing: true,
            pageCount: 0
        }, () => {
            this.getList(true);
        });
    }

    //上拉列表回调函数
    onEndReached = () => {
        const {pageCount, page} = this.state;
        //判断是否为最后一页
        if (page >= pageCount) {
            this.setState({
                hasMore: true
            });
            return;
        }
        this.setState(prevState => ({
            page: prevState.page + 1
        }), () => {
            this.getList();
        });
    }

    //删除订单
    deleteOrder = (id) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: '是否删除该订单？',
            callbacks: [null, () => {
                this.fetch(urlCfg.delMallOrder, {data: {deal: 1, id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Del_Success);
                            this.getList();
                        }
                    });
            }]
        });
    }

    //立即评价
    promptlyAssess = (id) => {
        appHistory.push(`/myEvaluate?id=${id}`);
    }

    //跳转立即自提
    skipSelf = (id) => {
        appHistory.push('/paySuccess?id=' + id);
    }

    //跳转到详情页面
    skipDetail = (id) => {
        appHistory.push('/selfOrderingDetails?id=' + id);
    }

    //申请售后/退款
    serviceRefund = (id) => {
        appHistory.push(`/onlyRefund?orderId=${id}&returnType=1&onlyRefund=true`);
    }

    //立即支付
    payNow = (item) => {
        //清除一下订单缓存
        removeValue('orderInfo');
        appHistory.push(`/payMoney?orderId=${item.id}&orderNum=${item.order_no}`);
    }

    goToSearch = () => {
        appHistory.push('/self-search');
    }

    render() {
        const {pageList, refreshing, isLoading, hasMore, height} = this.state;
        //每行渲染样式
        const row = item => (
            <div className="shop-lists" key={item.id}>
                <div className="shop-name">
                    <div className="shop-title">
                        <img src={item.picpath} onError={(e) => { e.target.src = item.df_logo }} alt=""/>
                        <p>{item.shopName}</p>
                        <div className="icon enter"/>
                    </div>
                    <div className="right">{item.status_name}</div>
                </div>
                {item.pr_list && item.pr_list.map(items => (
                    <div className="goods" key={items.pr_id} onClick={() => this.skipDetail(item.id)}>
                        <div className="goods-left">
                            <div>
                                <LazyLoadIndex key={items.pr_picpath} src={items.pr_picpath}/>
                            </div>
                        </div>
                        <div className="goods-right">
                            <div className="goods-desc">
                                <div className="desc-title">{items.pr_title}</div>
                                <div className="price">￥{items.price}</div>
                            </div>
                            <div className="goods-sku">
                                <div className="sku-left">
                                    {items.property_content.map(data => (
                                        <div className="goods-size">{data}</div>
                                    ))}
                                    <div>规格</div>
                                </div>
                                <div className="sku-right">x{items.num}</div>
                            </div>
                            <div className="btn-keep">记账量：{items.deposit}</div>
                        </div>
                    </div>
                ))}
                <div className="shop-bottom">
                    <div className="right-bottom">
                        <div className="total-count">
                            总记账量：<span>{item.all_deposit}</span>
                        </div>
                        <div className="total-price">
                            <div className="total-price-left">共{item.pr_num}件商品</div>
                            <div className="total-price-right"><span>合计：</span><span className="money">{item.all_price}元</span></div>
                        </div>
                        {/*等待付款*/}
                        {item.status === '0' && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={() => this.deleteOrder(item.id)}>删除</span>
                                <div className="evaluate-button" onClick={() => this.payNow(item)}>立即付款</div>
                            </div>
                        )}
                        {/*等待使用*/}
                        {(item.status === '1' && item.return_status === '0') && (
                            <div className="buttons">
                                <div className="evaluate-button" onClick={() => this.skipSelf(item.id)}>立即使用</div>
                            </div>
                        )}
                        {/*订单完成，等待评价*/}
                        {item.status === '2' && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={() => this.deleteOrder(item.id)}>删除</span>
                            </div>
                        )}
                        {/*订单完成*/}
                        {item.status === '3' && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={() => this.deleteOrder(item.id)}>删除</span>
                                <div className="evaluate-button" onClick={() => this.skipDetail(item.id)}>查看详情</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="Self-mention" data-role="page" className="self-search">
                <AppNavBar title="线下订单" backgroundColor={navColorR} goToSearch={this.goToSearch} rightShow white color={navColorR}/>
                <React.Fragment>
                    {pageList && pageList.length > 0 ? (
                        <MyListView
                            data={pageList}
                            height={height}
                            initSize={10}
                            size={5}
                            row={row}
                            onEndReached={this.onEndReached}  //上拉列表回调函数
                            loding={isLoading}
                            more={hasMore}
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}  //下拉刷新
                        />
                    ) : (
                        <Nothing
                            title=""
                            text={FIELD.No_Order}
                        />
                    )}
                </React.Fragment>
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm
};
export default connect(null, mapDidpatchToProps)(ReDetail);
