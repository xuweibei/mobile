/**
 *  账号模块 epics
 */
import {acctActionTypes as actionTypes} from '../index';
import 'rxjs/add/operator/switchMap';

const {urlCfg} = Configs;
const {errorType} = Utils;

// 会员注册
export function signIn(action$) {
    return action$.ofType(actionTypes.SIGN_IN)
        .switchMap(
            (action) => XHR.fetch(urlCfg.signup, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_TOKEN,
                        payload: {
                            token: data.data.token
                        }
                    });
                })
        );
}

// 会员登录
export function login(action$) {
    return action$.ofType(actionTypes.LOGIN)
        .switchMap(
            (action) => XHR.fetch(urlCfg.login, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_TOKEN,
                        payload: {
                            token: data.data.token
                        }
                    });
                })
        );
}

export function login2(action$) {
    return action$.ofType(actionTypes.LOGIN2)
        .switchMap(
            (action) => XHR.fetch(urlCfg.login2, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_TOKEN,
                        payload: {
                            token: data.token
                        }
                    });
                })
        );
}

// 短信接口
export function getAuthCode(action$) {
    return action$.ofType(actionTypes.GET_AUTH_CODE)
        .switchMap(
            (action) => XHR.fetch(urlCfg.checkcode, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_AUTH_CODE,
                        payload: {
                            bool: true
                        }
                    });
                })
        );
}

// 获取姓名和二维码
export function getQrCode(action$) {
    console.log('获取姓名和二维码');
    return action$.ofType(actionTypes.GET_QRCODE)
        .switchMap(
            (action) => XHR.fetch(urlCfg.qrcode, {method: 'post', data: {token: action.payload.token}})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_QRCODE,
                        payload: {
                            userName: data.data.realname,
                            qrcode: data.data.source
                        }
                    });
                })
        );
}
