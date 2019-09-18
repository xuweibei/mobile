import React from 'react';
import CacheRoute from 'react-router-cache-route';
import {Route} from 'react-router-dom';
import OrderPage from './myOrder';
import ListDetails from './List-details/ListDetails';
import payMoney from './pay-money/PayMoney';
import PaymentCompleted from './payment-completed/PaymentCompleted';
import possessEvaluatePage from './possess-evaluate/PossessEvaluate';
import MyEvaluatePage from './my-evaluation-detail/MyEvaluate';
import EvaluationSuccessPage from './my-evaluation-detail/EvaluationSuccess';
import publishReview from './publish-review/PublishReview';
import refundDetailsPage from './refund-details/RefundDetails';
import ApplyServicePage from './apply-service/ApplyService';
import OnlyRefund from './apply-service/OnlyRefund';
import ReturnGoods from './apply-service/ReturnGoods';
import Logistics from './logistics/Logistics';
import MyComplain from './my-complain/MyComplain';
import ConsultHistory from './consult-history/ConsultHistory';
import ApplyDrawback from './apply-drawback/ApplyDrawback';
import ShopSearch from './shop-search/ShopSearch';
import shopDetail from './shop-search/shopDetail';

const OrderModal = () => (
    <React.Fragment>
        <CacheRoute path="/myOrder" when="back" cacheKey="OrderPage" component={OrderPage}/>
        <Route path="/listDetails" component={ListDetails}/> {/* 订单详情-(5.3.1)*/}
        <Route path="/payMoney" component={payMoney}/> {/* 订单支付*/}
        <Route path="/paymentCompleted" component={PaymentCompleted}/> {/* 支付成功*/}
        <CacheRoute path="/possessEvaluate" when="back" cacheKey="PossessEvaluate" component={possessEvaluatePage}/> {/* 我的所有评价*/}
        <CacheRoute path="/myEvaluate" component={MyEvaluatePage} when="forward"/> {/* 立即评论*/}
        <Route path="/evaluationSuccess" component={EvaluationSuccessPage}/> {/* 评论成功*/}
        <Route path="/publishReview" component={publishReview}/> {/* 发表追评*/}
        <Route path="/applyService" component={ApplyServicePage}/> {/*选择售后类型*/}
        <Route path="/onlyRefund" component={OnlyRefund}/> {/*仅退款*/}
        <Route path="/returnGoods" component={ReturnGoods}/> {/*退货退款*/}
        <Route path="/refundDetails" component={refundDetailsPage}/> {/* 售后退款详情页*/}
        <Route path="/logistics" component={Logistics}/> {/* 我的 物流*/}
        <Route path="/myComplain" component={MyComplain}/> {/*我要投诉*/}
        <Route path="/consultHistory" component={ConsultHistory}/> {/*协商历史*/}
        <Route path="/applyDrawback" component={ApplyDrawback}/> {/*修改申请*/}
        <Route path="/shop-search" component={ShopSearch}/> {/*商店搜索*/}
        <Route path="/shop-detail" component={shopDetail}/> {/*商店搜索详情*/}
    </React.Fragment>
);

export default OrderModal;
