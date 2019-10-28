/**
 * homeAction 模块
 */

const homeActionTypes = Utils.keyMirror({
    GET_BANNER: '',
    SET_BANNER: '',
    GET_NAV: '',
    SET_NAV: ''
});


function _getBanner() {
    return {
        type: homeActionTypes.GET_BANNER
    };
}

function _setBanner(banner, logo) {
    return {
        type: homeActionTypes.GET_BANNER,
        payload: {
            banner,
            logo
        }
    };
}

function _getNav() {
    return {
        type: homeActionTypes.GET_NAV
    };
}

function _setNav(nav) {
    return {
        type: homeActionTypes.SET_NAV,
        payload: {
            nav
        }
    };
}

const homeActionCreator = {
    getBanner: _getBanner,
    setBanner: _setBanner,
    setNav: _setNav,
    getNav: _getNav
};


export {homeActionTypes, homeActionCreator};
