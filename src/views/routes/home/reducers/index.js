/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';
import {demoActionTypes as ActionsTypes} from '../actions/index';

const {createReducer} = Utils;
const homeState = {
    indexData: null,
    indexDataMd5: null
};

/**
 * baseState 初始化
 * @type {state}
 */
const demoState =  Immutable.fromJS({
    ...homeState
});
export default {
    home: createReducer(demoState, {
        [ActionsTypes.GET_AUTH_CODE](state, action) {
            const {currentIndex} = action.playload;
            return state.set('currentIndex', currentIndex);
        }
    })
};
