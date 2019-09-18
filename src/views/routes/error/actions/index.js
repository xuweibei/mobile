/**
 * demoAction 模块
 */

const demoActionTypes = Utils.keyMirror({
});


function _getData(data) {
    return {
        type: demoActionTypes.GET_AUTH_CODE,
        payload: {
            data
        }
    };
}


const demoActionCreator = {
    getData: _getData
};


export {demoActionTypes, demoActionCreator};
