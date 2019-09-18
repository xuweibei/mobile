import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import Customer from './Customer';
import CustomerInfo from './CustomerInfo';
import OrderList from './OrderList';

const MyCustomerModal = () => (
    <React.Fragment>
        <CacheRoute path="/customer" component={Customer} when="back"/>
        <Route path="/customer-info" component={CustomerInfo}/>
        <Route path="/customer-order-list" component={OrderList}/>
    </React.Fragment>
);

export default MyCustomerModal;