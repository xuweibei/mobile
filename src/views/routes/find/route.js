import {Route} from 'react-router-dom';
import React from 'react';
import FindPage from './Find';
import shopListPage from './shopList';

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
