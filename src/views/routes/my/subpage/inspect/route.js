import React from 'react';
import {Route} from 'react-router-dom';
import Inspect from './Inspect';
import InspectOrder from './inspect-order/InspectOrder';
import Consumer from './consumer/Consumer';
import Succcess from './success-file/SuccessFile';
import consumerSearch from './consumer-search/ConsumerSearch';
import consumerDetail from './consumer-search/ConsumerDetail';
import FailWrite from './fail-write/FailWrite';

const InspectModal = () => (
    <React.Fragment>
        <Route path="/inspect" component={Inspect}/>{/*立即核销*/}
        <Route path="/inspectOrder" component={InspectOrder}/>{/*核销订单*/}
        <Route path="/consumer" component={Consumer}/>{/*确认核销*/}
        <Route path="/success-file" component={Succcess}/>{/*确认核销*/}
        <Route path="/consumer-search" component={consumerSearch}/>{/*核销订单搜索*/}
        <Route path="/consumer-detail" component={consumerDetail}/>{/*核销订单搜索详情*/}
        <Route path="/fail-write" component={FailWrite}/>{/*核销失败*/}
    </React.Fragment>
);

export default InspectModal;
