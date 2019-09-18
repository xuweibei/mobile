import React from 'react';
import {Route} from 'react-router-dom';
import ShopHome from './ShopHome';
import ShopHomeIndexOnePage from './shop-home-index-one/ShopHomeIndex';
import ShopHomeIndexTwoPage from './shop-home-index-two/ShopHomeIndexTwo';
import ShopHomeIndexThirdPage from './shop-home-index-third/ShopHomeIndexThird';
import ShopHomeIndexFourPage from './shop-home-index-four/ShopHomeIndexFour';
import ShopHomeIndexFivePage from './shop-home-index-five/ShopHomeIndexFive';
import ShopHomeDetailPage from './ShopHomeDetail';

const ShopHomeModal = () => (
    <React.Fragment>
        <Route path="/shopHome" component={ShopHome}/>
        <Route path="/shopHomeIndexOne" component={ShopHomeIndexOnePage}/> {/*我的店铺-模板1*/}
        <Route path="/shopHomeIndexTwo" component={ShopHomeIndexTwoPage}/> {/*我的店铺-模板2*/}
        <Route path="/shopHomeIndexThird" component={ShopHomeIndexThirdPage}/> {/*我的店铺-模板3*/}
        <Route path="/shopHomeIndexFour" component={ShopHomeIndexFourPage}/> {/*我的店铺-模板4*/}
        <Route path="/shopHomeIndexFive" component={ShopHomeIndexFivePage}/> {/*我的店铺-模板5*/}
        <Route path="/shopHomeDetail" component={ShopHomeDetailPage}/> {/*我的店铺-商家信息*/}
    </React.Fragment>
);

export default ShopHomeModal;
