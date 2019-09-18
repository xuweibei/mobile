/**
 * 全局 alter 弹窗
 */

import {Modal} from 'antd-mobile';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';


let n = 0;

class Alert extends BaseComponent {
    static defaultProps = {
        visible: false,
        title: '',
        btnText: '确定',
        callback: null,
        alertName: ''
    };

    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.string,
        btnText: PropTypes.string,
        callback: PropTypes.func,
        hideAlert: PropTypes.func,
        alertName: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);
    }

    componentWillReceiveProps(nextProps) {
        console.log(n++);
    }

    hideAlert() {
        this.props.hideAlert();
    }

    render() {
        console.log('alter render');
        const {
            visible, title, callback, btnText, alertName
        } = this.props;
        console.log(this.props);
        return (
            <Modal
                title={title}
                transparent
                maskClosable={false}
                visible={visible}
                platform="ios"
                className={alertName}
                footer={[{
                    text: btnText,
                    onPress: () => {
                        this.hideAlert();
                        callback && callback();
                    }
                }]}
            >
                {this.props.children}
            </Modal>
        );
    }
}

const mapDispatchToProps = {
    hideAlert: actionCreator.hideAlert
};
export default connect(null, mapDispatchToProps)(Alert);
