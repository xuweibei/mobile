import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import Customer from './Customer';
// import CustomerInfo from './CustomerInfo';
// import OrderList from './OrderList';

const CustomerInfo = Loadable({
    loader: () => import(/* webpackChunkName: 'MyCustomer' */ './CustomerInfo'),
    loading: () => null
});
const OrderList = Loadable({
    loader: () => import(/* webpackChunkName: 'MyCustomer' */ './OrderList'),
    loading: () => null
});
const MyCustomerModal = () => (
    <React.Fragment>
        <CacheRoute path="/customer" component={Customer} when="back"/>
        <Route path="/customer-info" component={CustomerInfo}/>
        <Route path="/customer-order-list" component={OrderList}/>
    </React.Fragment>
);

export default MyCustomerModal;