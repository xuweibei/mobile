/**
 * 对接原生方法
 */
import {store} from '../redux/store';
import {systemApi} from './systemApi';
import {baseActionCreator} from '../redux/baseAction';
import {appHistory} from './appHistory';

const hybrid = process.env.NATIVE;
const {systemApi: {removeValue}, showInfo, showFail} = Utils;
const {LOCALSTORAGE} = Constants;
//跳转到首页
// window.location.href = '?fun=Home';

// 分享接口
// export const showShare = (type, title, content, url, imgUrl) => {
//     window.native.showShare(type, title, content, url, imgUrl);
// };
// 打开首页
// export const goHome = () => {
//     window.native.goHome();
// };
// 跳转购物车
// export const goShop = () => {
//     window.native.goShop();
// };
// 打开相机和相册弹框
// export const gopicCallbackHome = () => {
//     window.native.picCallback();
// };
// 扫一扫
// export const qrCodeScanCallback = () => {
//     window.native.qrCodeScanCallback();
// };
// 绑定微信
// export const bindWxCallback = () => {
//     window.native.bindWxCallback();
// };
// 退出登录
// export const loginoutCallback = () => {
//     window.native.loginoutCallback();
// };
// //保存图片  参数 type":"标识:  1 Bs64格式  2  网络图片"
// export const savePicCallback = () => {
//     window.native.savePicCallback();
// };
// 微信支付
// export const wxPayCallback = () => {
//     window.native.wxPayCallback();
// };

//统一封装原生接口请求
export const native = (str, obj, callBack) => new Promise((resolve, reject) => {
    alert(str);
    hybrid && window.WebViewJavascriptBridge.callHandler(
        str,
        JSON.stringify(obj),
        (responseData) => {
            const info = JSON.parse(responseData);
            if (info.status === '0') {
                resolve(info);
            } else {
                reject(info);
                showInfo(info.message);
            }
        }
    );
});

//设置nav的颜色，回传给原生
export const setNavColor = (str, obj) =>  new Promise((resolve, reject) => {
    setTimeout(() => {
        hybrid && window.WebViewJavascriptBridge.callHandler(
            str,
            JSON.stringify(obj),
            (responseData) => {
                // const info = JSON.parse(responseData);
                // if (info.status === '0') {
                //     resolve(info);
                // } else {
                //     reject(info);
                //     showInfo(info.message);
                // }
            }
        );
    }, 600);
});


//获取购物车点击结算的时候的跳转数据
export const getShopCartInfo = (str, obj, callBack) => new Promise((resolve, reject) => {
    setTimeout(() => {
        hybrid && window.WebViewJavascriptBridge.callHandler(
            str,
            JSON.stringify(obj),
            (responseData) => {
                const info = JSON.parse(responseData);
                if (info.status === '0') {
                    resolve(info);
                } else {
                    showInfo(info.message);
                }
            }
        );
    }, 500);
});

//获取userToken
export const getAppUserToken = () => new Promise((resolve) => {
    setTimeout(() => {
        hybrid && window.WebViewJavascriptBridge.callHandler('wxLoginCallback',
            JSON.stringify({}),
            (responseData) => {
                resolve(responseData);
                if (JSON.parse(responseData).status === '0') {
                    const str = JSON.parse(responseData).data.usertoken || null;
                    systemApi.setValue('userToken', str);
                    store.dispatch(baseActionCreator.setUserToken(str));
                } else {
                    showFail('身份验证失败');
                }
            });
    }, 500);
});

//安卓底部回退按钮 // APP右滑
global.goBack = function () {
    const onOff = store.getState().get('base').get('returnStatus');
    if (!onOff) {
        if (appHistory.length() === 0) {
            setTimeout(() => {
                hybrid && window.WebViewJavascriptBridge.callHandler('goBack');
            }, 500);
        } else {
            appHistory.goBack();
        }
    } else {
        store.dispatch(baseActionCreator.setReturn(false));
    }
};


//h5跳登录页时，清除缓存
global.clearCache = function () {
    alert(231);
    removeValue(LOCALSTORAGE.USER_TOKEN); // 清除token,localstorage
    store.dispatch(baseActionCreator.setUserToken('')); // 清除redux的userToken
};