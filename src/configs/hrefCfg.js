const {systemApi} = Utils;
const hrefCfg = {
    dev: {
        apiPath: 'https://yapi.zzha.vip/mall',
        apiShopPath: 'https://csapi.zzha.vip/rui',
        scan: 'https://csapp.zzha.vip/mall.html#'
    },
    production: {
        apiPath: ''
    },
    mock: {
        rootPath: 'https://csapi.zzha.vip/mall/'
    }
};
const currentHref = (function () {
    if (systemApi.isProdEnv()) {
        return hrefCfg.production;
    }
    return hrefCfg.dev;
}());

export {currentHref, hrefCfg};
