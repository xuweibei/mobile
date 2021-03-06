/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';
import {homeActionTypes as ActionsTypes} from '../actions/index';

const {createReducer} = Utils;
const initState = {
    banner: null,
    logo: null,
    nav: null,
    count: 0
};

/**
 * baseState 初始化
 * @type {state}
 */
const homeState =  Immutable.fromJS({
    ...initState
});
export default {
    home: createReducer(homeState, {
        [ActionsTypes.SET_BANNER](state, action) {
            const {banner, logo} = action.payload;
            return state.set('banner', banner)
                .set('logo', logo);
        },
        [ActionsTypes.SET_NAV](state, action) {
            const {nav} = action.payload;
            console.log(nav, 'sadaihNKas');
            return state.set('nav', nav);
        }
    })
};
