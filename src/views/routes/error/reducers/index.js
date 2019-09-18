/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';


const {createReducer} = Utils;
const indexState = {
    indexData: null,
    indexDataMd5: null
};

/**
 * baseState 初始化
 * @type {state}
 */
const homeState = Immutable.fromJS({
    ...indexState
});

export default {
    home: createReducer(homeState, {
    })
};
