import {Route} from 'react-router-dom';
import OrderModalOther from './subpage/my-order/route';
// import MyCustomer from './subpage/customer/route';
// import MyBusiness from './subpage/business/route';
// import MyInvitation from './subpage/Invitation/route';
// import MyCollect from './subpage/my-collect/route';
// import OrderPage from './subpage/my-order/route';
// import AppendOrder from './subpage/append-order/route';
// import SelfMention from './subpage/self-mention/route';
// import MyAssetsRouters from './subpage/my-assets/route';
// import Edit from './subpage/edit/route';
// import WithdrawalRouters from './subpage/withdrawal/route';
// import RecordPage from './subpage/withdrawal/record/route';
// import ShopHomePage from './subpage/shop-home/route';
// import OpenShopPage from './subpage/open-shop/route';
// import PeraonalSotes from './subpage/personal-stores/route';
// import BrowseHistory from './subpage/browse-history/route';
// import RollOutModal from './subpage/roll-out/route';
// import InspectModal from './subpage/inspect/route';


const MyPage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './My'),
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
const OrderPage = Loadable({
    loader: () => import(/* webpackChunkName: 'OrderPage' */ './subpage/my-order/myOrder'),
    loading: () => null
});


// const MyNotice = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/notice/route'),
//     loading: () => null
// });
// const RecommendList = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/recommend/route'),
//     loading: () => null
// });
// const RecommendDetail = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/recommend-detail/route'),
//     loading: () => null
// });


const AppendOrder = Loadable({
    loader: () => import(/* webpackChunkName: 'AppendOrder' */ './subpage/append-order/route'),
    loading: () => null
});
const SelfMention = Loadable({
    loader: () => import(/* webpackChunkName: 'SelfMention' */ './subpage/self-mention/route'),
    loading: () => null
});
// const MyAssetsRouters = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/my-assets/route'),
//     loading: () => null
// });
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
// const RollOutModal = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/roll-out/route'),
//     loading: () => null
// });
const InspectModal = Loadable({
    loader: () => import(/* webpackChunkName: 'InspectModal' */ './subpage/inspect/route'),
    loading: () => null
});
// const ImModel = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/im/route'),
//     loading: () => null
// });
const My = () => {
    if (process.env.NATIVE) {
        return (
            <React.Fragment>
                <Route path="/myOrder" component={OrderPage}/>
                <Route path="/customer" component={MyCustomer}/>
                <Route path="/business" component={MyBusiness}/>
                <Route path="/collect" component={MyCollect}/>
                <Route path="/appendorder" component={AppendOrder}/>
                <Route path="/selfMention" component={SelfMention}/>
                <Route path="/withdrawal" component={WithdrawalRouters}/>
                <Route path="/shopHome" component={ShopHomePage}/>
                <Route path="/invitation" component={MyInvitation}/>
                <Route path="/record" component={RecordPage}/>
                <Route path="/openShopPage" component={OpenShopPage}/>
                <Route path="/personalStores" component={PeraonalSotes}/>
                <Route path="/browseHistory" component={BrowseHistory}/>
                <Route path="/inspect" component={InspectModal}/>
                <Edit/>
                <OrderModalOther/>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <Route path="/my" component={MyPage}/>
            <Route path="/myOrder" component={OrderPage}/>
            <Route path="/customer" component={MyCustomer}/>
            <Route path="/business" component={MyBusiness}/>
            <Route path="/collect" component={MyCollect}/>
            <Route path="/appendorder" component={AppendOrder}/>
            <Route path="/selfMention" component={SelfMention}/>
            <Route path="/withdrawal" component={WithdrawalRouters}/>
            <Route path="/shopHome" component={ShopHomePage}/>
            <Route path="/invitation" component={MyInvitation}/>
            <Route path="/record" component={RecordPage}/>
            <Route path="/openShopPage" component={OpenShopPage}/>
            <Route path="/personalStores" component={PeraonalSotes}/>
            <Route path="/browseHistory" component={BrowseHistory}/>
            <Route path="/inspect" component={InspectModal}/>
            <Edit/>
            <OrderModalOther/>
        </React.Fragment>
    );
};


// const My = () => {
//     if (!process.env.NATIVE) {
//         return (
//             <React.Fragment>
//                 <Route path="/my" component={MyPage}/>
//                 <Edit/>{/* 编辑 */}
//                 <OrderPage/>{/* 我的订单 */}
//                 <SelfMention/>{/* 自提 */}
//                 <MyBusiness/>{/* 我的业务 */}
//                 <MyCustomer/>{/* 我的客户 */}
//                 <MyCollect/>{/* 我的收藏 */}
//                 <MyInvitation/>{/* 分享码 */}
//                 {/* <MyNotice/>我的消息 */}
//                 {/* <RecommendList/>我的 推荐界面 */}
//                 {/* <RecommendDetail/>我的 推荐详情 */}
//                 <AppendOrder/>
//                 <MyAssetsRouters/>{/* 我的资产*/}
//                 <ShopHomePage/>{/*我的店铺*/}
//                 <WithdrawalRouters/>
//                 <RecordPage/>
//                 <OpenShopPage/>{/* 我要开店 */}
//                 <PeraonalSotes/>{/**我的店铺 */}
//                 <BrowseHistory/>{/**浏览历史 */}
//                 <RollOutModal/>{/*CAM转出*/}
//                 <InspectModal/>{/*核销订单*/}
//                 {/* <ImModel/>im */}
//             </React.Fragment>
//         );
//     }
//     return (
//         <React.Fragment>
//             <Edit/>{/* 编辑 */}
//             <OrderPage/>{/* 我的订单 */}
//             <SelfMention/>{/* 自提 */}
//             <MyBusiness/>{/* 我的业务 */}
//             <MyCustomer/>{/* 我的客户 */}
//             <MyCollect/>{/* 我的收藏 */}
//             <MyInvitation/>{/* 分享码 */}
//             {/* <MyNotice/>我的消息 */}
//             {/* <RecommendList/>我的 推荐界面 */}
//             {/* <RecommendDetail/>我的 推荐详情 */}
//             <AppendOrder/>
//             <MyAssetsRouters/>{/* 我的资产*/}
//             <WithdrawalRouters/>
//             <ShopHomePage/>{/*我的店铺*/}
//             <RecordPage/>
//             <OpenShopPage/>{/* 我要开店 */}
//             <PeraonalSotes/>{/*我的店铺 */}
//             <BrowseHistory/>{/*浏览历史 */}
//             <RollOutModal/>{/*CAM转出*/}
//             <InspectModal/>{/*核销订单*/}
//             {/* <ImModel/>im */}
//         </React.Fragment>
//     );
// };
export default My;
