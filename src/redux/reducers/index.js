/**
 * rootReducer
 */
import baseReducer from './baseReducer';
import routeReducer from './routerReducer';
import categoryReducer from '../../views/routes/category/reducers';
import shopCartReducer from '../../views/routes/shop-cart/reducers/index';
import findReducer from '../../views/routes/find/reducers/index';
import MyReducer from '../../views/routes/my/reducers';

export const rootReducer = {
    ...baseReducer,
    ...routeReducer,
    ...categoryReducer,
    ...shopCartReducer,
    ...findReducer,
    ...MyReducer
};
