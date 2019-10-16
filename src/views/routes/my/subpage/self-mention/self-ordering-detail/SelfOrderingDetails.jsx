import React from 'react';
import copy from 'copy-to-clipboard';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './SelfOrderingDetails.less';

const {showSuccess, appHistory, getUrlParam, native, showFail, showInfo, setNavColor} = Utils;
const {MESSAGE: {Feedback}, navColorF} = Constants;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;
//right:0未付款;1已付款（待使用）;3已使用（未评价）;4交易成功（已评价）;10取消订单 ;11删除订单;12申请退款成功关闭订单;13商家关闭订单14商家删除订单


class ReDetail extends BaseComponent {
    state = {
        selfSufficiency: [], //订单列表
        selfGoods: [], //订单商品列表
        recommendGoods: [], //推荐商品列表
        collectId: null, //判斷是否收藏
        shopId: 0 //订单shop_id
    }

    componentWillMount() {
        if (hybrid) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybrid) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentDidMount() {
        this.getList();
    }

    //获取订单列表信息
    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.selfOrderDetail, {method: 'post', data: {id}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        selfSufficiency: res.data,
                        shopId: res.data.shop_id,
                        selfGoods: res.data.pr_list,
                        recommendGoods: res.data.recommend
                    }, () => {
                        this.ollectType();
                    });
                }
            });
    }

    //判斷是否收藏
    ollectType = () => {
        const {shopId} = this.state;
        this.fetch(urlCfg.shopCollectType, {method: 'post', data: {shop_id: shopId}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        collectId: res.id || null
                    });
                }
            });
    }

    //收藏、取消收藏
    collectDoIts = (value) => {
        const {selfSufficiency, collectId} = this.state;
        //添加收藏
        if (value === 'add') {
            this.fetch(urlCfg.addCollectShop, {method: 'post', data: {shop_name: selfSufficiency.shopName, shop_id: selfSufficiency.shop_id}})
                .subscribe(res => {
                    if (res.status === 0) {
                        showSuccess(Feedback.Collect_Success);
                        this.ollectType();
                    }
                });
        } else { //取消收藏
            this.fetch(urlCfg.cancelCollect, {method: 'post', data: {ids: [collectId], type: 2}})
                .subscribe(res => {
                    if (res.status === 0) {
                        showSuccess(Feedback.Cancel_Success);
                        this.ollectType();
                    }
                });
        }
    }

    //删除订单
    deleteOrder = () => {
        const {showConfirm} = this.props;
        const {selfSufficiency} = this.state;
        showConfirm({
            title: '是否删除该订单?',
            callbacks: [null, () => {
                this.fetch(urlCfg.delMallOrder, {method: 'post', data: {deal: 1, id: selfSufficiency.order_id}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            showInfo('成功删除订单');
                            setTimeout(() => {
                                appHistory.goBack();
                            }, 1500);
                        } else if (res.status === 1) {
                            showFail(res.message);
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
                if (hybrid) {
                    native('callTel', {phoneNum: tel});
                }
            }]
        });
    };

    //复制
    duplicate = () => {
        const {selfSufficiency} = this.state;
        copy(selfSufficiency.order_no);
        showSuccess(Feedback.Copy_Success);
    }

    //图片放大
    openMask = pic => {
        this.setState({
            maskPic: pic,
            maskStatus: true
        });
    };

    //关闭图片放大
    maskClose = () => {
        this.setState({
            maskPic: '',
            maskStatus: false
        });
    };

    //跳转立即使用
    skipSelf = (id) => {
        appHistory.push('/paySuccess?id=' + id);
    }

    //跳转到店铺
    goToShop = (e, id) => {
        e.stopPropagation();
        appHistory.push(`/shopHome?id=${id}`);
    };

    //跳转到商品详情
    goToGoodsDetail = id => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //前往售后详情页
    skipAfterSale = (e, id) => {
        appHistory.push(`/refundDetails?id=${id}&type=2`);
        e.stopPropagation();
    }

    //立即评价
    promptlyAssess = (id) => {
        appHistory.push(`/myEvaluate?id=${id}&assess=2`);
    }

    //申请售后/退款
    serviceRefund = (e, id) => {
        const {selfSufficiency} = this.state;
        if (selfSufficiency.status === '4') {
            showFail('跳转到im');
        } else {
            appHistory.push(`/onlyRefund?orderId=${id}&returnType=1&onlyRefund=true`);
        }
        e.stopPropagation();
    }

    //调起地图
    openMap = () => {
        const {selfSufficiency} = this.state;
        appHistory.push(`/find?longitude=${selfSufficiency.sufficiency_longitude}&latitude=${selfSufficiency.sufficiency_latitude}`);
    }

    //跳转到商品详情
    goodsDetaid = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    }

    goBackModal = () => {
        if (appHistory.length() === 0) {
            appHistory.replace('/selfMention');
        } else {
            appHistory.goBack();
        }
    }

    //联系商家
    goToShoper = () => {
        const {selfSufficiency} = this.state;
        if (hybrid) {
            native('goToShoper', {shopNo: selfSufficiency.shop_no, id: selfSufficiency.order_id, type: '2', shopNickName: selfSufficiency.nickname, imType: '1', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    }

    render() {
        const {selfSufficiency, selfGoods, recommendGoods, maskStatus, collectId} = this.state;
        return (
            <div data-component="Self-orderingDetails" data-role="page" className="Self-orderingDetails">
                <AppNavBar goBackModal={this.goBackModal} title="订单详情"/>

                <div className="wait-box">
                    <div className="wait-top">{selfSufficiency.status_title}</div>
                    <div className="wait-center">{selfSufficiency.status_msg}</div>
                    {((selfSufficiency.status === '1' && !selfSufficiency.return_status) || selfSufficiency.return_status === '1') && (
                        <div className="wait-bottom" onClick={() => this.skipSelf(selfSufficiency.order_id)}>立即使用</div>
                    )}
                </div>

                <div className="address">
                    <div className="address-left">
                        <div className="shop-name">
                            <span className="shop-name-left">{selfSufficiency.shopName}</span>
                            <span className="shop-name-right">{selfSufficiency.shop_tel}</span>
                        </div>
                        <div className="time">营业时间{selfSufficiency.open_time}</div>
                        <div className="icon place" onClick={this.openMap}><span>{selfSufficiency.sufficiency_address}</span></div>
                    </div>
                    <div className="address-right" onClick={e => this.openMask(e)}>
                        <img src={selfSufficiency.shoper_pic} alt=""/>
                    </div>
                </div>
                <div>
                    <div className="shop-lists">
                        <div className="common-margin">
                            <div className="shop-name">
                                <div className="shop-title">
                                    <img src={selfSufficiency.shoper_pic} alt=""/>
                                    <p>{selfSufficiency.shopName}</p>
                                </div>
                                <span><div className="right" onClick={(e) => this.goToShop(e, selfSufficiency.shop_id)}>进店</div></span>
                            </div>
                            {selfGoods.map(item => (
                                <div className="goods" key={item.pr_id} onClick={() => this.goodsDetaid(item.pr_id)}>
                                    <div className="goods-left">
                                        <div>
                                            <img src={item.pr_picpath}/>
                                        </div>
                                    </div>
                                    <div className="goods-right">
                                        <div className="goods-desc">
                                            <div className="desc-title">{item.pr_title}</div>
                                        </div>
                                        <div className="goods-sku">
                                            <div className="sku-left">
                                                {item.property_content.map(items => (
                                                    <div className="goods-size">{items}</div>
                                                ))}
                                            </div>
                                            <div className="local">x{item.num}</div>
                                        </div>
                                        <div className="accounting">
                                            <div className="btn-keep">记账量：{item.deposit}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="total-price">
                        <div className="common-margin">
                            <div className="bookkeeping">
                                <span className="bookkeeping-left">记账量</span>
                                <span className="bookkeeping-riht">{selfSufficiency.all_deposit}</span>
                            </div>
                            <div className="all-prices">
                                <div className="all-prices-left">商品总价</div>
                                <div className="all-prices-right">￥{selfSufficiency.all_price}</div>
                            </div>
                            <div className="self-mention">
                                <div className="self-mention-left">自提</div>
                            </div>
                        </div>
                    </div>
                    <div className="payable">
                        <span>实付款</span>
                        <span>￥{selfSufficiency.countprice}</span>
                    </div>
                    <div className="order common-margin">
                        <div className="number">
                            <span className="number-left">订单编号：</span>
                            <span className="number-center">{selfSufficiency.order_no}</span>
                            <span className="number-right" onClick={this.duplicate}>复制</span>
                        </div>
                        <div className="order-time">
                            <span className="order-time-left">下单时间：</span>
                            <span className="order-time-center">{selfSufficiency.crtdate}</span>
                        </div>
                        <div className="payment-time">
                            <span className="payment-time-left">支付时间：</span>
                            <span className="payment-time-center">{selfSufficiency.pay_date}</span>
                        </div>
                        <div className="order-remarks">
                            <span className="order-remarks-left">订单备注：</span>
                            <span>{selfSufficiency.remarks}</span>
                        </div>
                    </div>
                </div>

                <div className="business">
                    <div className="frame-lfet icon" onClick={this.goToShoper}><span>联系商家</span></div>
                    <div className="frame-right icon" onClick={() => this.shopPhone(selfSufficiency.shop_tel)}><span>商家电话</span></div>
                </div>

                <div className="collection common-margin">
                    <div className="collection-left">
                        <img src={selfSufficiency.shoper_pic} alt=""/>
                    </div>
                    <div className="collection-center">{selfSufficiency.shopName}</div>
                    {
                        (!collectId ? <div className="collection-right" onClick={() => this.collectDoIts('add')}>+收藏</div> : <div className="collection-right" onClick={() => this.collectDoIts('off')}>取消收藏</div>)
                    }
                </div>

                <div className="recommend-box">
                    <div className="recommend common-margin">热门推荐</div>
                    <div className="hot-push-goods">
                        {recommendGoods.map(item => (
                            <div className="shop-lists" onClick={() => this.goToGoodsDetail(item.pr_id)}>
                                <div className="common-margin">
                                    <div className="goods">
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
                                                    <div className="goods-size">{item.values_name}</div>
                                                </div>
                                            </div>
                                            <div className="accounting">
                                                <div className="btn-keep accounting-left">记账量：{item.deposit || 0}</div>
                                                <div className="accounting-right">{item.area}</div>
                                            </div>
                                            <div className="drawee">
                                                <div className="drawee-left">{item.order_num}人付款</div>
                                                <div className="drawee-right">￥{item.original_price}</div>
                                            </div>
                                            <div className="name-price">
                                                <div className="name-price-left">{item.shopName}</div>
                                                <div className="icon name-price-center" onClick={(e) => this.goToShop(e, item.shop_id)}>进店</div>
                                                <div className="name-price-right">￥{item.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {maskStatus && (
                        <div className="picMask" onClick={this.maskClose}>
                            <div className="address-right" onClick={e => this.openMask(e)}>
                                <img className="max-img" src={selfSufficiency.shoper_pic} alt=""/>
                            </div>
                        </div>
                    )}
                </div>
                <div className="cancel-order-box" >
                    {(selfSufficiency.status === '3' || selfSufficiency.status === '4' || selfSufficiency.status === '10') && (
                        <div className="assessment">
                            <div className="cancel-order" onClick={() => this.deleteOrder()}>刪除订单</div>
                            {/* {selfSufficiency.status === '3' && (
                                    <div className="immediate-evaluation" onClick={() => this.promptlyAssess(selfSufficiency.order_id)}>立即评价</div>
                                )} 暂时屏蔽 */}
                        </div>
                    )}
                    {/* {(selfSufficiency.status === '1' || selfSufficiency.status === '3' || selfSufficiency.status === '4') && (
                            <div>
                                {selfSufficiency.return_name ? (
                                    <div className="cancel-order" onClick={(e) => this.skipAfterSale(e, selfSufficiency.return_id)}>{selfSufficiency.return_name}</div>
                                ) : (
                                    <div className="cancel-order" onClick={(e) => this.serviceRefund(e, selfSufficiency.order_id)}>申请售后</div>
                                )
                                }
                                {selfSufficiency.return_name && <div className="cancel-order" onClick={(e) => this.skipAfterSale(e, selfSufficiency.return_id)}>{selfSufficiency.return_name}</div>}
                            </div>
                        )} */}
                </div>
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
export default connect(mapStateToProps, mapDidpatchToProps)(ReDetail);
