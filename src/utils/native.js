/**
 * 对接原生方法
 */
import {store} from '../redux/store';
import {systemApi} from './systemApi';
import {baseActionCreator} from '../redux/baseAction';
import {appHistory} from './appHistory';

const {systemApi: {removeValue}, showFail, getUrlParam} = Utils;
const {LOCALSTORAGE} = Constants;
//统一封装原生接口请求
export const native = (str, obj) => {
    window.DsBridge.call(str, obj);
};

// new Promise((resolve, reject) => {
//     if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
//         window.WebViewJavascriptBridge.callHandler(
//             str,
//             JSON.stringify(obj),
//             (responseData) => {
//                 const info = JSON.parse(responseData);
//                 if (info && info.status === '0') {
//                     resolve(info);
//                 } else if (info) {
//                     reject(info);
//                     showInfo(info.message);
//                 }
//             }
//         );
//     }
// });

//设置nav的颜色，回传给原生
export const setNavColor = (str, obj) => {
    window.DsBridge.call(str, obj);
};

// new Promise((resolve, reject) => {
//     if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler) {
//         process.env.NATIVE && window.WebViewJavascriptBridge.callHandler(
//             str,
//             JSON.stringify(obj),
//             (responseData) => {
//             }
//         );
//     }
// });


//获取购物车点击结算的时候的跳转数据
export const getShopCartInfo = (str, obj, callBack) => {
    window.DsBridge.call(str, obj);
};


// new Promise((resolve, reject) => {
//     setTimeout(() => {
//         if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
//             window.WebViewJavascriptBridge.callHandler(
//                 str,
//                 JSON.stringify(obj),
//                 (responseData) => {
//                     const info = JSON.parse(responseData);
//                     if (info && info.status === '0') {
//                         resolve(info);
//                     }
//                 }
//             );
//         }
//     }, 500);
// });

//获取userToken
export const getAppUserToken = () => new Promise((resolve, reject) => {
    // setTimeout(() => {
    if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
        window.WebViewJavascriptBridge.callHandler('wxLoginCallback',
            JSON.stringify({}),
            (responseData) => {
                console.log(responseData, '卡列表估计快了发过火');
                alert(responseData);
                resolve(responseData);
                if (responseData && JSON.parse(responseData).status === '0') {
                    const str = JSON.parse(responseData).data.usertoken || null;
                    systemApi.setValue('userToken', str);
                    store.dispatch(baseActionCreator.setUserToken(str));
                } else if (responseData) {
                    showFail('身份验证失败');
                }
            });
        resolve();
    } else {
        reject();
    }
    // }, 500);
});

//安卓底部回退按钮 // APP右滑
global.goBack = function () {
    const onOff = store.getState().get('base').get('returnStatus');
    if (!onOff) {
        if (appHistory.length() === 0 && process.env.NATIVE) {
            if (!window.location.href.includes('userAgreementDetail')) {
                window.DsBridge.call('goBack');
            }
        } else {
            appHistory.goBack();
        }
    } else {
        store.dispatch(baseActionCreator.setReturn(false));
    }
    return 1;
};


//h5跳原生登录页时，清除缓存
global.clearCache = function () {
    removeValue(LOCALSTORAGE.USER_TOKEN); // 清除token,localstorage
    store.dispatch(baseActionCreator.setUserToken('')); // 清除redux的userToken
};


//原生跳h5重置历史
global.restHistory = function () {
// appHistory.reduction();
};

global.goBackApp = function () {
    // 跳回app时调用;
};


//返回封装
export function goBackModal() {
    if (process.env.NATIVE && appHistory.length() === 0) {
        // native('goBack');
        window.DsBridge.call('goBack');
    } else {
        appHistory.goBack();
    }
}

//判断部分机型边框样式不兼容
export function nativeCssDiff() {
    const str = navigator.userAgent;
    console.log(str, '型号参数查看');
    const phoneModal =  ['OPPO R7sm', 'm1 note', 'Letv X501', 'Redmi Note 4X', 'OPPO A59m'];
    let onOff = false;
    phoneModal.forEach(item => {
        if (str.indexOf(item) > -1) {
            onOff = true;
        }
    });
    return onOff;
}