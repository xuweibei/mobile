import {Route} from 'react-router-dom';
import React from 'react';

const FindPage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './Find'),
    loading: () => null
});

const shopListPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './shopList'),
    loading: () => null
});

const Find = () => {
    const hybird = process.env.NATIVE;
    if (hybird) {
        return (
            <React.Fragment>
                <Route path="/shop-list" component={shopListPage}/>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <Route path="/find" component={FindPage}/>
            <Route path="/shop-list" component={shopListPage}/>
        </React.Fragment>
    );
};


export default Find;
