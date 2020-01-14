import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import Business from './Business';
// import BusinessInfo from './BusinessInfo';
// import OrderList from './OrderList';

const BusinessInfo = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './BusinessInfo'),
    loading: () => null
});

const OrderList = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './OrderList'),
    loading: () => null
});
const MyBusinessModal = () => (
    <React.Fragment>
        <CacheRoute path="/business" component={Business} when="back"/>
        <Route path="/business-info" component={BusinessInfo}/>
        <Route path="/business-order-list" component={OrderList}/>
    </React.Fragment>
);

export default MyBusinessModal;