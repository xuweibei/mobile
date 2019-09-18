import React from 'react';
import {Route} from 'react-router-dom';
import SelfMention from './SelfMention';
import SelfAddress from './self-address/SelfAddress';
import PaySuccess from './pay-success/PaySuccess';
import SelfOrderingDetails from './self-ordering-detail/SelfOrderingDetails';
import SelfMentionDetail from './self-mention-detail/SelfMentionDetail';
import seleSearch from './self-search/SelfSearch';
import seleList from './self-search/SelfDetail';

const SelfMentionModal = () => (
    <React.Fragment>
        <Route path="/selfMention" component={SelfMention}/>
        <Route path="/selfMentionDetail" component={SelfMentionDetail}/> {/* 自提*/}
        <Route path="/selfOrderingDetails" component={SelfOrderingDetails}/> {/* 自提订单详情*/}
        <Route path="/paySuccess" component={PaySuccess}/> {/* 自提支付成功*/}
        <Route path="/selfAddress" component={SelfAddress}/> {/* 自提地址*/}
        <Route path="/self-search" component={seleSearch}/> {/* 线下订单搜索*/}
        <Route path="/self-list" component={seleList}/> {/* 线下订单搜索列表*/}
    </React.Fragment>
);

export default SelfMentionModal;
