/*
* 页面跳转，滚动条返回顶部
* */
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

class ScrollToTop extends React.PureComponent {
    static defaultProps = {
        children: null,
        location: null
    };

    static propTypes = {
        children: PropTypes.object,
        location: PropTypes.object
    };

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
