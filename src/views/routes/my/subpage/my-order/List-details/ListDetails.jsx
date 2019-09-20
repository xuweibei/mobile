/**订单详情页面 */
import copy from 'copy-to-clipboard';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {IconFont} from '../../../../../common/icon-font/IconFont';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import './ListDetails.less';

const {appHistory, getUrlParam, showSuccess, native, showInfo} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;
const hybird = process.env.NATIVE;
class ListDetails extends BaseComponent {
    state = {
        canInfo: {} //数据容器
    };

    componentWillMount() {
        //这里是为了控制原生右滑退出
        this.props.setReturn(true);
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(data, value) {
        //原生右滑退出处理
        if (!data.returnStatus) {
            this.goBackModal();
        }
    }

    getList = () => {
        const orderId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.orderDetailInfo, {data: {id: orderId}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        canInfo: res.data
                    });
                }
            });
    }

    //收藏、取消收藏
    collectDoIt = (value, status) => {
        //添加收藏
        if (status === 'add') {
            this.fetch(urlCfg.addCollectShop, {data: {shop_id: value.id, shop_name: value.name}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        showSuccess(Feedback.Collect_Success);
                        this.getList();
                    }
                });
        } else { //取消收藏
            this.fetch(urlCfg.cancelCollect, {data: {ids: [value.id], type: 2}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        showSuccess(Feedback.Cancel_Success);
                        this.getList();
                    }
                });
        }
    }

    //申请售后  单个商品进行售后退款
    serviceRefund = (data, value, ev) => {
        appHistory.push(`/applyService?orderId=${data.order_id}&shopId=${data.shop_id}&returnType=2&prId=${value.pr_id}&arrInfo=${value.property_content}&onlyReturnMoney=${data.status === '1' ? 1 : ''}`);
        ev.stopPropagation();
    }

    //复制
    duplicate = (no) => {
        copy(no);
        showSuccess(Feedback.Copy_Success);
    }

    //进店
    goShopHome = (id, ev) => {
        appHistory.push(`/shopHome?id=${id}`);
        ev.stopPropagation();
    }

    //去往商品
    goToShopping = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    }

    //确认收货
    confirmTake = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.No_Error_Take,
            callbacks: [null, () => {
                this.fetch(urlCfg.confirmOrder, {data: {id}})
                    .subscribe((res) => {
                        if (res) {
                            if (res.status === 0) {
                                appHistory.goBack();
                            }
                        }
                    });
            }]
        });
    }

    //删除订单
    deleteOrder = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_delete,
            callbacks: [null, () => {
                this.fetch(urlCfg.delMallOrder, {method: 'post', data: {id, deal: 1}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            dropByCacheKey('OrderPage');//清除我的订单的缓存
                            appHistory.goBack();
                        }
                    });
            }]
        });
    }

    //拨打商家电话
    shopPhone = (tel) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: `拨打商家电话：${tel}`,
            callbacks: [null, () => {
                if (hybird) {
                    native('callTel', {phoneNum: tel});
                }
            }]
        });
    };

    //立即评价
    promptlyEstimate = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.push(`/myEvaluate?id=${id}`);
    }

    //提醒发货
    remindDelivery = (data) => {
        const {canInfo} = this.state;
        this.fetch(urlCfg.remindOrder, {data: {id: canInfo.order_id}})
            .subscribe((res) => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Deliver_Success);
                }
            });
    }

    //前往售后页面
    afterSale = (ev, id) => {
        const refurn = decodeURI(getUrlParam('refurn', encodeURI(this.props.location.search)));
        appHistory.push(`/refundDetails?id=${id}&refurn=${refurn}`);
        ev.stopPropagation();
    }

    //立即支付
    payNow = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.push(`/payMoney?orderId=${id}&orderNum=${this.state.canInfo.order_no}`);
    }

    //底部按钮内容
    bottomButton = (num) => {
        const blockMadel = new Map([
            ['0', <div className="immediate-evaluation new-style-paynow" onClick={this.payNow}>立即付款</div>],
            ['1', <div className="immediate-evaluation deliver" onClick={this.remindDelivery}>提醒发货</div>],
            ['2', <div className="immediate-evaluation" onClick={this.confirmTake}>确认收货</div>],
            ['3', <div className="immediate-evaluation" onClick={this.promptlyEstimate}>立即评价</div>]
        ]);
        return blockMadel.get(num);
    }

    //确认取消订单
    canStateChange = (state, value) => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (state === 'mastSure' && value) {
            this.fetch(urlCfg.delMallOrder, {data: {deal: 0, id, reason: value.label, reason_id: value.value}})
                .subscribe((res) => {
                    if (res) {
                        if (res.status === 0) {
                            showSuccess(Feedback.Cancel_Success);
                            appHistory.goBack();
                        }
                    }
                });
        }
        this.setState({
            canStatus: false
        });
    }

    //查看物流信息
    goToLocaice = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.push(`/logistics?lgId=${id}`);
    }

    //前往im
    goToIm = (ev) => {
        showInfo('前往im');
        ev.stopPropagation();
    }

    goBackModal = () => {
        if (appHistory.length() === 0) {
            appHistory.replace('/myOrder/fh');
        } else {
            appHistory.goBack();
        }
    }

    //页面卸载
    componentWillUnmount() {
        //返回弹框的回调是否显示
        this.props.setReturn(false);
    }

    //联系商家
    goToShoper = () => {
        const {canInfo} = this.state;
        if (hybird) {
            native('goToShoper', {shopNo: canInfo.shop_no, id: canInfo.order_id, type: '2', shopNickName: canInfo.nickname, imType: '1', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    }

    render() {
        const {canInfo, canStatus} = this.state;
        return (
            <div data-component="List-details" data-role="page" className="List-details">
                <AppNavBar goBackModal={this.goBackModal} rightShow title="订单详情"/>
                {
                    canInfo.status ? (
                        <div>
                            <div className="wait-box">
                                <div className="wait-top">{canInfo.status_title}</div>
                                <div className="wait-center">{canInfo.status_msg}</div>
                                {/* <div className="wait-bottom" onClick={() => appHistory.push(`/goodsDetail/?id=${canInfo.pr_id}`)}>再下一单</div> */}
                            </div>
                            {
                                // (canInfo.status !== '0' && canInfo.status !== '1')
                                canInfo.logistics && (
                                    <div className="message" onClick={this.goToLocaice}>
                                        <div className="message-left icon"/>
                                        <div className="message-center">
                                            <div className="logistics">{canInfo.logistics.msg}</div>
                                            <div className="datetime">
                                                <div className="datetime-left">{canInfo.logistics.time}</div>
                                            </div>
                                        </div>
                                        <div className="message-right icon"/>
                                    </div>
                                )
                            }
                            <div className="address">
                                <div className="address-top">
                                    <div className="name">{canInfo.linkname}</div>
                                    <div className="number">{canInfo.linktel}</div>
                                </div>
                                <div className="address-bottom">{canInfo.area} {canInfo.address}</div>
                            </div>

                            <div>
                                <div className="shop-lists">
                                    <div className="common-margin">
                                        <div className="shop-name">
                                            <div className="shop-title">
                                                <img src={canInfo.shoper_pic} alt=""/>
                                                <p>{canInfo.shopName}</p>
                                            </div>
                                            <span><div className="right" onClick={(ev) => this.goShopHome(canInfo.shop_id, ev)}>进店</div></span>
                                        </div>
                                        {
                                            canInfo.pr_list.map((item, index) => (
                                                <div key={item.pr_id} className="goods" onClick={() => this.goToShopping(item.pr_id)}>
                                                    <div className="goods-left" >
                                                        <div>
                                                            <img src={item.pr_picpath} alt=""/>
                                                        </div>
                                                    </div>
                                                    <div className="goods-right">
                                                        <div className="goods-desc">
                                                            <div className="desc-title">{item.pr_title}</div>
                                                        </div>
                                                        <div className="goods-sku">
                                                            <div className="sku-left">
                                                                {item.values_name.map(value => <div className="goods-size">{value}</div>)}
                                                            </div>
                                                        </div>
                                                        <div className="accounting">
                                                            <div className="btn-keep">记账量：{item.deposit}</div>
                                                            <div className="local">x{item.num}</div>
                                                        </div>
                                                        {   //订单为待评价的时候
                                                            canInfo.is_shoper === 0 &&  (canInfo.status === '3' || canInfo.status === '4') && <div className="after-service" onClick={(ev) => this.goToIm(ev)}>申请售后</div>
                                                        }
                                                        {   //退款中，按钮
                                                            canInfo.is_shoper === 0 && item.button_name && <div className="after-service" onClick={(ev) => this.afterSale(ev, item.return_id)}>{item.button_name}</div>
                                                        }
                                                        {   //订单为待发货或待收货时
                                                            canInfo.is_shoper === 0 && !item.return_name && (canInfo.status === '1' || canInfo.status === '2') && <div className="after-service" onClick={(ev) => this.serviceRefund(canInfo, item, ev)}>申请退款</div>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className="total-price">
                                    <div className="common-margin">
                                        <div className="total">
                                            <span>记账量</span>
                                            <span>{canInfo.all_deposit}</span>
                                        </div>
                                        <div className="total total-center">
                                            <div>商品总价</div>
                                            <div>￥{canInfo.all_price}</div>
                                        </div>
                                        <div className="total">
                                            <div>运费</div>
                                            <div>{canInfo.express_money}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="payable">
                                    <span>实付款</span>
                                    <span>￥{canInfo.countprice}</span>
                                </div>
                                <div className="order common-margin">
                                    <div className="number">
                                        <span className="number-left">订单编号：</span>
                                        <span className="number-center">{canInfo.order_no}</span>
                                        <span className="number-right" onClick={() => this.duplicate(canInfo.order_no)}>复制</span>
                                    </div>
                                    <div className="order-time">
                                        <span className="order-time-left">下单时间：</span>
                                        <span className="order-time-center">{canInfo.crtdate}</span>
                                    </div>
                                    {
                                        Number(canInfo.pay_date) ? (
                                            <div className="payment-time">
                                                <span className="payment-time-left">支付时间：</span>
                                                <span className="payment-time-center">{canInfo.pay_date}</span>
                                            </div>
                                        ) : ''
                                    }
                                    {/* <div className="order-remarks">
                                        <span className="order-remarks-left">订单备注：</span>
                                        <span>麻烦打包好，仔细检查物品</span>
                                    </div> */}
                                </div>
                            </div>

                            <div className="business-box">
                                <div className="business">
                                    <div className="business-left" onClick={this.goToShoper}><IconFont iconText="iconIM-zhutou" onClick={this.goToShoper}/><span>联系商家</span></div>
                                    <span className="business-right icon" onClick={() => this.shopPhone(canInfo.shop_tel)}>商家电话</span>
                                </div>
                            </div>

                            <div className="collection common-margin">
                                <div className="collection-left">
                                    <img src={canInfo.shoper_pic} alt=""/>
                                </div>
                                <div className="collection-center">{canInfo.shopName}</div>
                                {
                                    canInfo.is_shoper === 0 && (canInfo.shop_collect === '0' ? <div onClick={() => this.collectDoIt({id: canInfo.shop_id, name: canInfo.shopName}, 'add')} className="collection-right">+收藏</div> : <div onClick={() => this.collectDoIt({id: canInfo.shop_collect, name: canInfo.shopName})} className="removeCollect">已收藏</div>)
                                }
                            </div>

                            <div className="recommend-box">
                                <div className="recommend common-margin">热门推荐</div>
                                <div className="hot-push-goods">
                                    {
                                        canInfo.recommend.length > 0 ? canInfo.recommend.map(item => (
                                            <div className="shop-lists">
                                                <div className="common-margin">
                                                    <div className="goods" onClick={() => this.goToShopping(item.pr_id)}>
                                                        <div className="goods-left">
                                                            <div>
                                                                <img src={item.picpath}/>
                                                            </div>
                                                        </div>
                                                        <div className="goods-right">
                                                            <div className="goods-desc">
                                                                <div className="desc-title">{item.title}</div>
                                                            </div>
                                                            <div className="goods-sku">
                                                                <div className="sku-left">
                                                                    {
                                                                        item.property ? item.property.values_name.split(',').map(value => <div className="goods-size">{value}</div>) : ''
                                                                    }
                                                                    {/* <div className="goods-size">zxc</div> */}
                                                                </div>
                                                            </div>
                                                            <div className="accounting">
                                                                <div className="btn-keep accounting-left">记账量：{item.property.deposit}</div>
                                                                <div className="accounting-right">{item.area}</div>
                                                            </div>
                                                            <div className="drawee">
                                                                <div className="drawee-left">{item.order_num}付款</div>
                                                                <div className="drawee-right">￥{item.property.original_price}</div>
                                                            </div>
                                                            <div className="name-price">
                                                                <div className="name-price-left" onClick={(ev) => this.goShopHome(item.shop_id, ev)}>{item.shopName}</div>
                                                                <div className="icon name-price-center" onClick={(ev) => this.goShopHome(item.shop_id, ev)}>进店</div>
                                                                <div className="name-price-right">￥{item.property.price}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : ''
                                    }
                                </div>
                                <div className="cancel-order-box">
                                    {   //退款订单
                                        (canInfo.status === '10' || canInfo.status === '6' || canInfo.status === '4' || canInfo.status === '3') &&  <div className="cancel-order" onClick={this.deleteOrder}>删除订单</div>
                                    }
                                    {   //待付款订单状态可操作
                                        (canInfo.status === '0') &&  <div className="cancel-order new-style-cancel" onClick={() => this.setState({canStatus: true, canCelId: canInfo.pr_id})}>取消订单</div>
                                    }
                                    {
                                        canInfo.is_shoper === 0 && this.bottomButton(canInfo.status)
                                    }
                                </div>
                                {canStatus && (
                                    <CancelOrder
                                        canStateChange={this.canStateChange}
                                    />
                                )}
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        returnStatus: base.get('returnStatus')
    };
};
const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm,
    setReturn: actionCreator.setReturn
};
export default connect(mapStateToProps, mapDidpatchToProps)(ListDetails);
