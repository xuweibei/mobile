/**
 * 埋点数据
 */
import {systemApi} from './systemApi';

const hybrid = process.env.NATIVE;
const basekv = {
    xuid: systemApi.getValue('xuid') || '',
    tel: systemApi.getValue('activiedMobile') || '',
    acc: systemApi.getValue('loginAcc') || ''
};

export const TD = {
    log: (eventId, label = '', kv = {}) => {
        if (hybrid || window.isWX) {
            console.log(eventId);
        } else {
            const newKv = Object.assign({}, basekv, kv);
            window.TDAPP.onEvent(eventId, label, newKv);
        }
    }
};
