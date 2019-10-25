import {Route} from 'react-router-dom';

const MyPage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './My'),
    loading: () => null
});
const MyCustomer = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/customer/route'),
    loading: () => null
});
const MyBusiness = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/business/route'),
    loading: () => null
});
const MyInvitation = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/Invitation/route'),
    loading: () => null
});
const MyCollect = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/my-collect/route'),
    loading: () => null
});
const OrderPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/my-order/route'),
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
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/append-order/route'),
    loading: () => null
});
const SelfMention = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/self-mention/route'),
    loading: () => null
});
const MyAssetsRouters = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/my-assets/route'),
    loading: () => null
});
const Edit = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/edit/route'),
    loading: () => null
});
const WithdrawalRouters = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/withdrawal/route'),
    loading: () => null
});
const RecordPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/withdrawal/record/route'),
    loading: () => null
});
const ShopHomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/shop-home/route'),
    loading: () => null
});
const OpenShopPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/open-shop/route'),
    loading: () => null
});
const PeraonalSotes = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/personal-stores/route'),
    loading: () => null
});
const BrowseHistory = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/browse-history/route'),
    loading: () => null
});
const RollOutModal = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/roll-out/route'),
    loading: () => null
});
const InspectModal = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/inspect/route'),
    loading: () => null
});
// const ImModel = Loadable({
//     loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/im/route'),
//     loading: () => null
// });

const hybird = process.env.NATIVE;

const My = () => {
    if (hybird) {
        return (
            <React.Fragment>
                <Edit/>{/* 编辑 */}
                <OrderPage/>{/* 我的订单 */}
                <SelfMention/>{/* 自提 */}
                <MyBusiness/>{/* 我的业务 */}
                <MyCustomer/>{/* 我的客户 */}
                <MyCollect/>{/* 我的收藏 */}
                <MyInvitation/>{/* 分享码 */}
                {/* <MyNotice/>我的消息 */}
                {/* <RecommendList/>我的 推荐界面 */}
                {/* <RecommendDetail/>我的 推荐详情 */}
                <AppendOrder/>
                <MyAssetsRouters/>{/* 我的资产*/}
                <WithdrawalRouters/>
                <ShopHomePage/>{/*我的店铺*/}
                <RecordPage/>
                <OpenShopPage/>{/* 我要开店 */}
                <PeraonalSotes/>{/*我的店铺 */}
                <BrowseHistory/>{/*浏览历史 */}
                <RollOutModal/>{/*CAM转出*/}
                <InspectModal/>{/*核销订单*/}
                {/* <ImModel/>im */}
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <Route path="/my" component={MyPage}/>
            <Edit/>{/* 编辑 */}
            <OrderPage/>{/* 我的订单 */}
            <SelfMention/>{/* 自提 */}
            <MyBusiness/>{/* 我的业务 */}
            <MyCustomer/>{/* 我的客户 */}
            <MyCollect/>{/* 我的收藏 */}
            <MyInvitation/>{/* 分享码 */}
            {/* <MyNotice/>我的消息 */}
            {/* <RecommendList/>我的 推荐界面 */}
            {/* <RecommendDetail/>我的 推荐详情 */}
            <AppendOrder/>
            <MyAssetsRouters/>{/* 我的资产*/}
            <ShopHomePage/>{/*我的店铺*/}
            <WithdrawalRouters/>
            <RecordPage/>
            <OpenShopPage/>{/* 我要开店 */}
            <PeraonalSotes/>{/**我的店铺 */}
            <BrowseHistory/>{/**浏览历史 */}
            <RollOutModal/>{/*CAM转出*/}
            <InspectModal/>{/*核销订单*/}
            {/* <ImModel/>im */}
        </React.Fragment>
    );
};
export default My;
