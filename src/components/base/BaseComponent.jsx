/**
 * 根组件  封装组件一些逻辑通用方法
 */
import PropTypes from 'prop-types';
import dsBridge from 'dsbridge';
import {is} from 'immutable';
import {store} from '../../redux/store';
import {baseActionCreator as actionCreator} from '../../redux/baseAction';

const {systemApi: {setValue}} = Utils;
class BaseComponent extends React.Component {
    static propTypes = {
        children: PropTypes.array
    };

    static contextTypes = {
        store: PropTypes.object
    };

    static defaultProps = {
        children: null
    };


    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        if (process.env.NATIVE) {
            dsBridge.call('wxLoginCallback', (data) => { //设置userToken
                const str = new RegExp('"', 'g');
                const userToken = data.replace(str, '').split(':')[1];
                window.localStorage.setItem('userToken', userToken);
                store.dispatch(actionCreator.setUserToken(data.usertoken));
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {},
            newProps = nextProps || {},
            newState = nextState || {};
        if (Object.keys(thisProps).length !== Object.keys(newProps).length
            || Object.keys(thisState).length !== Object.keys(newState).length) {
            return true;
        }
        for (const key in newProps) {
            if (newProps.hasOwnProperty(key) && !is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in newState) {
            if (newState.hasOwnProperty(key) && !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }

    // 元素销毁时，清掉未完成Ajax回调函数, 关闭alert、confirm弹窗
    componentWillUnmount() {
        console.log('BaseComponent componentWillUnmount', this.getComponnetName());
        const {store} = this.context,
            base = store.getState().get('base');
        base.get('alertShow') && store.dispatch(actionCreator.hideAlert());
        base.get('confirmShow') && store.dispatch(actionCreator.hideConfirm());
        // console.log(XHR.ajaxQueue);
        if (XHR.ajaxQueue.length > 0) {
            XHR.abort();
        }
        //不能在已经被销毁的组件中执行setState，防止出现内存泄漏的情况
        this.setState((prevState) => ({
            prevState
        }));
    }

    // 获取组件名称
    getComponnetName() {
        try {
            return this.__proto__.constructor.name;
        } catch (e) {
            return '';
        }
    }

    // 获取子元素, 返回正确的子元素
    getChildren() {
        const children = [];
        React.Children.forEach(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                children.push(child);
            }
        });
        return children;
    }

    /**
     * 发送http请求
     *
     * @param url
     * @param params
     * @returns {observable}
     */
    fetch(url, params, noShowLoading) {
        return XHR.fetch(url, params, noShowLoading);
    }

    // 终止http请求
    abort(url) {
        XHR.abort(url);
    }
}

export default BaseComponent;
