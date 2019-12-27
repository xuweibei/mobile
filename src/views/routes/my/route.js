import {Route} from 'react-router-dom';

const MyPage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './My'),
    loading: () => null
});


const OrderPage = Loadable({
    loader: () => import(/* webpackChunkName: 'OrderPage' */ './subpage/my-order/route'),
    loading: () => null
});
const MyCustomer = Loadable({
    loader: () => import(/* webpackChunkName: 'MyCustomer' */ './subpage/customer/route'),
    loading: () => null
});
const MyBusiness = Loadable({
    loader: () => import(/* webpackChunkName: 'MyBusiness' */ './subpage/business/route'),
    loading: () => null
});
const MyInvitation = Loadable({
    loader: () => import(/* webpackChunkName: 'MyInvitation' */ './subpage/Invitation/route'),
    loading: () => null
});
const MyCollect = Loadable({
    loader: () => import(/* webpackChunkName: 'MyCollect' */ './subpage/my-collect/route'),
    loading: () => null
});


const AppendOrder = Loadable({
    loader: () => import(/* webpackChunkName: 'AppendOrder' */ './subpage/append-order/route'),
    loading: () => null
});
const SelfMention = Loadable({
    loader: () => import(/* webpackChunkName: 'SelfMention' */ './subpage/self-mention/route'),
    loading: () => null
});
const Edit = Loadable({
    loader: () => import(/* webpackChunkName: 'Edit' */ './subpage/edit/route'),
    loading: () => null
});
const WithdrawalRouters = Loadable({
    loader: () => import(/* webpackChunkName: 'WithdrawalRouters' */ './subpage/withdrawal/route'),
    loading: () => null
});
const RecordPage = Loadable({
    loader: () => import(/* webpackChunkName: 'RecordPage' */ './subpage/withdrawal/record/route'),
    loading: () => null
});
const ShopHomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'ShopHomePage' */ './subpage/shop-home/route'),
    loading: () => null
});
const OpenShopPage = Loadable({
    loader: () => import(/* webpackChunkName: 'OpenShopPage' */ './subpage/open-shop/route'),
    loading: () => null
});
const PeraonalSotes = Loadable({
    loader: () => import(/* webpackChunkName: 'PeraonalSotes' */ './subpage/personal-stores/route'),
    loading: () => null
});
const BrowseHistory = Loadable({
    loader: () => import(/* webpackChunkName: 'BrowseHistory' */ './subpage/browse-history/route'),
    loading: () => null
});
const InspectModal = Loadable({
    loader: () => import(/* webpackChunkName: 'InspectModal' */ './subpage/inspect/route'),
    loading: () => null
});
const My = () => (
    <React.Fragment>
        <Route path="/my" component={MyPage}/>
        <Route path="/customer" component={MyCustomer}/>
        <Route path="/business" component={MyBusiness}/>
        <Route path="/collect" component={MyCollect}/>
        <Route path="/appendorder" component={AppendOrder}/>
        <Route path="/withdrawal" component={WithdrawalRouters}/>
        <Route path="/shopHome" component={ShopHomePage}/>
        <Route path="/invitation" component={MyInvitation}/>
        <Route path="/record" component={RecordPage}/>
        <Route path="/openShopPage" component={OpenShopPage}/>
        <Route path="/personalStores" component={PeraonalSotes}/>
        <Route path="/browseHistory" component={BrowseHistory}/>
        <Route path="/inspect" component={InspectModal}/>
        <SelfMention/>
        <Edit/>
        <OrderPage/>
    </React.Fragment>
);


export default My;
