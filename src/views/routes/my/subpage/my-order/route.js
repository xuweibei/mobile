import React from 'react';
import CacheRoute from 'react-router-cache-route';
import {Route} from 'react-router-dom';
import OrderPage from './myOrder';
import ListDetails from './List-details/ListDetails';
import payMoney from './pay-money/PayMoney';
import PaymentCompleted from './payment-completed/PaymentCompleted';
import Logistics from './logistics/Logistics';
import possessEvaluatePage from './possess-evaluate/PossessEvaluate';
import MyEvaluatePage from './my-evaluation-detail/MyEvaluate';
import EvaluationSuccessPage from './my-evaluation-detail/EvaluationSuccess';
import publishReview from './publish-review/PublishReview';
import refundDetailsPage from './refund-details/RefundDetails';
import ApplyServicePage from './apply-service/ApplyService';
import OnlyRefund from './apply-service/OnlyRefund';
import ReturnGoods from './apply-service/ReturnGoods';
import ApplyDrawback from './apply-drawback/ApplyDrawback';
import ShopSearch from './shop-search/ShopSearch';
import shopDetail from './shop-search/shopDetail';
import MyComplain from './my-complain/MyComplain';

// const PossessEvaluate = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './possess-evaluate/PossessEvaluate'),
//     loading: () => null
// });
// const ListDetails = Loadable({
//     loader: () => import(/* webpackChunkName: 'ListDetails' */ './List-details/ListDetails'),
//     loading: () => null
// });
// const payMoney = Loadable({
//     loader: () => import(/* webpackChunkName: 'payMoney' */ './pay-money/PayMoney'),
//     loading: () => null
// });
// const PaymentCompleted = Loadable({
//     loader: () => import(/* webpackChunkName: 'PaymentCompleted' */ './payment-completed/PaymentCompleted'),
//     loading: () => null
// });
// const Logistics = Loadable({
//     loader: () => import(/* webpackChunkName: 'Logistics' */ './logistics/Logistics'),
//     loading: () => null
// });
// const MyEvaluatePage = Loadable({
//     loader: () => import(/* webpackChunkName: 'MyEvaluatePage' */ './my-evaluation-detail/MyEvaluate'),
//     loading: () => null
// });
// const EvaluationSuccessPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'EvaluationSuccessPage' */ './my-evaluation-detail/EvaluationSuccess'),
//     loading: () => null
// });
// const publishReview = Loadable({
//     loader: () => import(/* webpackChunkName: 'publishReview' */ './publish-review/PublishReview'),
//     loading: () => null
// });

// const refundDetailsPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'refundDetailsPage' */ './refund-details/RefundDetails'),
//     loading: () => null
// });
// const ApplyServicePage = Loadable({
//     loader: () => import(/* webpackChunkName: 'ApplyServicePage' */ './apply-service/ApplyService'),
//     loading: () => null
// });
// const OnlyRefund = Loadable({
//     loader: () => import(/* webpackChunkName: 'OnlyRefund' */ './apply-service/OnlyRefund'),
//     loading: () => null
// });
// const ReturnGoods = Loadable({
//     loader: () => import(/* webpackChunkName: 'ReturnGoods' */ './apply-service/ReturnGoods'),
//     loading: () => null
// });
// const ApplyDrawback = Loadable({
//     loader: () => import(/* webpackChunkName: 'ApplyDrawback' */ './apply-drawback/ApplyDrawback'),
//     loading: () => null
// });
// const ShopSearch = Loadable({
//     loader: () => import(/* webpackChunkName: 'ShopSearch' */ './shop-search/ShopSearch'),
//     loading: () => null
// });
// const shopDetail = Loadable({
//     loader: () => import(/* webpackChunkName: 'shopDetail' */ './shop-search/shopDetail'),
//     loading: () => null
// });
// const MyComplain = Loadable({
//     loader: () => import(/* webpackChunkName: 'MyComplain' */ './my-complain/MyComplain'),
//     loading: () => null
// });
const OrderModalOther = () => (
    <React.Fragment>
        <CacheRoute path="/myOrder" when="back" cacheKey="OrderPage" component={OrderPage}/>
        <Route path="/listDetails" component={ListDetails}/> {/* 订单详情-(5.3.1)*/}
        <Route path="/payMoney" component={payMoney}/> {/* 订单支付*/}
        <Route path="/paymentCompleted" component={PaymentCompleted}/> {/* 支付成功*/}
        <CacheRoute path="/possessEvaluate" when="back" cacheKey="PossessEvaluate" component={possessEvaluatePage}/> {/**我的所有评价 */}
        <CacheRoute path="/myEvaluate" component={MyEvaluatePage} when="forward"/> {/* 立即评论*/}
        <Route path="/evaluationSuccess" component={EvaluationSuccessPage}/> {/* 评论成功*/}
        <Route path="/publishReview" component={publishReview}/> {/* 发表追评*/}
        <Route path="/applyService" component={ApplyServicePage}/> {/* 选择售后类型*/}
        <Route path="/onlyRefund" component={OnlyRefund}/> {/* 仅退款*/}
        <Route path="/returnGoods" component={ReturnGoods}/> {/* 退货退款*/}
        <Route path="/refundDetails" component={refundDetailsPage}/> {/* 售后退款详情页*/}
        <Route path="/logistics" component={Logistics}/> {/* 我的 物流*/}
        <Route path="/myComplain" component={MyComplain}/> {/* 我要投诉 */}
        {/* <Route path="/consultHistory" component={ConsultHistory}/> 协商历史 */}
        <Route path="/applyDrawback" component={ApplyDrawback}/> {/* 修改申请*/}
        <Route path="/shop-search" component={ShopSearch}/> {/*商店搜索*/}
        <Route path="/shop-detail" component={shopDetail}/> {/*商店搜索详情*/}
    </React.Fragment>
);

export default OrderModalOther;
