/*
* 页面跳转，滚动条返回顶部
* */
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

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

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    componentDidCatch(error, info) {
        this.setState(prevState => ({
            hasError: !prevState.hasError
            // error: error,
            // info: info
        }));
    }

    render() {
        if (this.state.hasError) {
            return <h1>虽然你遇到BUG的时候挺狼狈，但是你改BUG的样子真的很靓仔！</h1>;
        }
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
