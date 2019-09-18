/**
 * myAction 模块
 */

const myActionTypes = Utils.keyMirror({
    SET_ORDER_INFORMATION: '',
    SET_IDS_ARR: '',
    SET_VERIFICATION: '',  //储存核销订单信息
    SET_ORDERS_INFO: '', //储存核销订单
    SET_PAGE_STATUS: '', // 储存页面显示状态
    GET_ADDRESS: '', // 获取收货地址
    SET_ADDRESS: '', //, 设置收货地址
    GET_MYINFO: '', // 获取我的页面
    SET_MYINFO: '', // 设置我的页面
    DEL_MYINFO: '', // 刪除我的页面
    GET_USERINFO: '', // 获取用户信息
    SET_USERINFO: '', // 设置用户信息
    DEL_USERINFO: '', // 删除用户信息
    GET_NICKNAME: '', // 获取用户昵称
    SET_NICKNAME: '', // 设置用户昵称
    GET_AREA: '', // 获取所在区域
    SET_AREA: '', // 设置所在区域
    GET_UID: '', // 查看源头uid
    SET_UID: '', // 查看源头uid
    GET_BANK: '', // 获取银行卡
    SET_BANK: '', // 设置银行卡信息
    SAVE_ADDRESS: ''//保存当前用户守护地址
});


//定义方法储存从view获取到的数据
function _setOrderInformation(data) {
    return {
        type: myActionTypes.SET_ORDER_INFORMATION,
        payload: {
            data
        }
    };
}

//保存核销订单数据
function _setVerification(data) {
    return {
        type: myActionTypes.SET_VERIFICATION,
        payload: {
            data
        }
    };
}

//改变开店页面状态
function _setPageStatus(data) {
    return {
        type: myActionTypes.SET_PAGE_STATUS,
        payload: {
            data
        }
    };
}

//保存核销订单数据
function _setOrdersInfo(data) {
    return {
        type: myActionTypes.SET_ORDERS_INFO,
        payload: {
            data
        }
    };
}

//获取我的頁面信息
function _getMyInfo(data) {
    return {
        type: myActionTypes.GET_MYINFO,
        payload: {
            data
        }
    };
}
//刪除我的頁面信息
function _delMyInfo(data) {
    return {
        type: myActionTypes.DEL_MYINFO,
        payload: {
            data
        }
    };
}
//获取用户信息
function _getUserInfo() {
    return {
        type: myActionTypes.GET_USERINFO
    };
}

//清除用户信息
function _removeUserInfo() {
    return {
        type: myActionTypes.DEL_USERINFO
    };
}

//获取用户昵称
function _getUserNickName() {
    return {
        type: myActionTypes.GET_NICKNAME
    };
}

function _getAddress() {
    return {
        type: myActionTypes.GET_ADDRESS
    };
}

//获取当前区域
function _getArea() {
    return {
        type: myActionTypes.GET_AREA
    };
}
//获取UID
function _getUid() {
    return {
        type: myActionTypes.GET_UID
    };
}
//获取UID
function _getBank() {
    return {
        type: myActionTypes.GET_BANK
    };
}

//保存用户选中地址
function _saveAddress(obj) {
    return {
        type: myActionTypes.SAVE_ADDRESS,
        payload: {
            obj
        }
    };
}

const myActionCreator = {
    setOrderInformation: _setOrderInformation,
    setVerification: _setVerification,
    setOrdersInfo: _setOrdersInfo,
    setPageStatus: _setPageStatus,
    getAddress: _getAddress,
    getMyInfo: _getMyInfo,
    delMyInfo: _delMyInfo,
    getUserInfo: _getUserInfo,
    removeUserInfo: _removeUserInfo,
    getNickName: _getUserNickName,
    getArea: _getArea,
    getUid: _getUid,
    getBank: _getBank,
    saveAddress: _saveAddress
};


export {myActionTypes, myActionCreator};
