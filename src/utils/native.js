/**
 * 对接原生方法
 */
import {store} from '../redux/store';
import {systemApi} from './systemApi';
import {baseActionCreator} from '../redux/baseAction';
import {appHistory} from './appHistory';

const {systemApi: {removeValue}, showInfo, showFail} = Utils;
const {LOCALSTORAGE} = Constants;

//统一封装原生接口请求
export const native = (str, obj, callBack) => new Promise((resolve, reject) => {
    if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
        window.WebViewJavascriptBridge.callHandler(
            str,
            JSON.stringify(obj),
            (responseData) => {
                const info = JSON.parse(responseData);
                if (info && info.status === '0') {
                    resolve(info);
                } else if (info) {
                    reject(info);
                    showInfo(info.message);
                }
            }
        );
    }
});

//设置nav的颜色，回传给原生
export const setNavColor = (str, obj) =>  new Promise((resolve, reject) => {
    if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler) {
        process.env.NATIVE && window.WebViewJavascriptBridge.callHandler(
            str,
            JSON.stringify(obj),
            (responseData) => {
            }
        );
    }
});


//获取购物车点击结算的时候的跳转数据
export const getShopCartInfo = (str, obj, callBack) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
            window.WebViewJavascriptBridge.callHandler(
                str,
                JSON.stringify(obj),
                (responseData) => {
                    const info = JSON.parse(responseData);
                    if (info && info.status === '0') {
                        resolve(info);
                    }
                }
            );
        }
    }, 500);
});

//获取userToken
export const getAppUserToken = () => new Promise((resolve) => {
    setTimeout(() => {
        if (window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler && process.env.NATIVE) {
            window.WebViewJavascriptBridge.callHandler('wxLoginCallback',
                JSON.stringify({}),
                (responseData) => {
                    resolve(responseData);
                    if (responseData && JSON.parse(responseData).status === '0') {
                        const str = JSON.parse(responseData).data.usertoken || null;
                        systemApi.setValue('userToken', str);
                        store.dispatch(baseActionCreator.setUserToken(str));
                    } else if (responseData) {
                        showFail('身份验证失败');
                    }
                });
        }
    }, 500);
});

//安卓底部回退按钮 // APP右滑
global.goBack = function () {
    const onOff = store.getState().get('base').get('returnStatus');
    if (!onOff) {
        if (appHistory.length() === 0) {
            setTimeout(() => {
                process.env.NATIVE && window.WebViewJavascriptBridge.callHandler('goBack');
            }, 500);
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
//返回封装
export function goBackModal() {
    if (process.env.NATIVE && appHistory.length() === 0) {
        native('goBack');
    } else {
        appHistory.goBack();
    }
}

global.goBackApp = function () {
    // 跳回app时调用;
};