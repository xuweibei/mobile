/*
* 页面跳转，滚动条返回顶部
* 错误边界
* */
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AppNavBar from '../navbar/NavBar';
import Nothing from '../nothing/Nothing';

const {appHistory, setNavColor, native} = Utils;
const {FIELD, navColorF} = Constants;
class ScrollToTop extends React.PureComponent {
    static propTypes = {
        children: PropTypes.object,
        location: PropTypes.object
    };

    static defaultProps = {
        children: null,
        location: null
    };

    state = {
        hasError: false
    }

    componentWillMount() {
        if (process.env.NATIVE) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (process.env.NATIVE) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    static getDerivedStateFromError(a, v) {
        console.log(a, 'sssssssssssssssssssssss');
        console.log(v, 'dddddddddddddddddddddddd');
        return {hasError: true};
    }

    render() {
        const {hasError} = this.state;
        if (hasError) {
            return (
                <React.Fragment>
                    <AppNavBar title="页面崩溃"/>
                    <Nothing
                        text={FIELD.Page_Crash}
                        title="返回"
                        onClick={() => ((process.env.NATIVE && appHistory.length() === 0) ? native('goBack') : appHistory.goBack())}
                    />
                </React.Fragment>
            );
        }
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
