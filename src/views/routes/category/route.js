import CacheRoute from 'react-router-cache-route';
import React from 'react';
import {Route} from 'react-router-dom';
import EvaluatePage from './subpage/evaluate/Evaluate';
import EvaluateDetailPage from './subpage/evaluate-detail/EvaluateDetail';
import CategoryListPage from './subpage/category-list/CategoryList';
import CategoryPage from './Category';
import GoodsDetailPage from './subpage/goods-detail/GoodsDetail';

const Classify = () => (
    <React.Fragment>
        <Route path="/category" component={CategoryPage}/>
        <CacheRoute path="/categoryList" cacheKey="CategoryListPage" component={CategoryListPage} when="back"/>
        <CacheRoute path="/goodsDetail" cacheKey="GoodsDetailPage" component={GoodsDetailPage}/>
        <CacheRoute path="/evaluate" component={EvaluatePage}/>
        <Route path="/evaluateDetail" component={EvaluateDetailPage}/>
    </React.Fragment>
);
export default Classify;

// const hybird = process.env.NATIVE;
// if (hybird) {
//     return (
//         <React.Fragment>
//             <Route path="/category" component={CategoryPage}/>
//             <Route path="/categoryList" component={CategoryListPage}/>
//             {/* <CacheRoute path="/goodsDetail" component={GoodsDetailPage} when="forward"/> */}
//             <CacheRoute path="/goodsDetail" cacheKey="GoodsDetailPage" component={GoodsDetailPage}/>
//             <CacheRoute path="/evaluate" component={EvaluatePage} when="forward"/>
//             <Route path="/evaluateDetail" component={EvaluateDetailPage}/>
//         </React.Fragment>
//     );
// }