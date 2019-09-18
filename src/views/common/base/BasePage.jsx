
/**
 * 基础组件，加载全局控制的组件，Loading、alert、confirm
 */

import {connect} from 'react-redux';
import {Alert, Confirm} from '../../../components/modal/index';
import {Loading} from '../../../components/toast/index';
// import {baseActionCreator} from '../../../redux/baseAction';
import Menu from '../menu/Menu';
import Top from '../top/Top';

// const {systemApi} = Utils;

class BasePage extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    renderLoading = () => {
        const {loadingShow} = this.props;
        return (
            <Loading
                visible={loadingShow}
                type="spinningBubbles"
                color="red"
                width="100"
                height="100"
            />
        );
    };

    renderAlert = () => {
        const {
            alertShow, alertTitle, alertMsg, alertCallback,
            alertBtnText
        } = this.props;
        return (
            <Alert
                visible={alertShow}
                title={alertTitle}
                message={alertMsg}
                btnText={alertBtnText}
                callback={alertCallback}
            />
        );
    };

    renderConfirm = () => {
        const {
            confirmShow, cfmTitle, cfmMsg, cfmBtnTexts,
            cfmCallbacks
        } = this.props;
        return (
            <Confirm
                visible={confirmShow}
                title={cfmTitle}
                message={cfmMsg}
                btnTexts={cfmBtnTexts}
                callbacks={cfmCallbacks}
            />
        );
    };

    //导航菜单

    render() {
        const {showMenu} = this.props;
        return (
            <div data-component="base" data-role="page">
                {this.renderLoading()}
                {this.renderAlert()}
                {this.renderConfirm()}
                {
                    showMenu ? <Menu/> : null
                }
                <Top/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const base = state.get('base');
    return {
        loadingShow: base.get('loadingShow'),
        alertShow: base.get('alertShow'),
        alertTitle: base.get('alertTitle'),
        alertMsg: base.get('alertMsg'),
        alertSubMsg: base.get('alertSubMsg'),
        alertCallback: base.get('alertCallback'),
        alertBtnText: base.get('alertBtnText'),
        confirmShow: base.get('confirmShow'),
        cfmTitle: base.get('cfmTitle'),
        cfmMsg: base.get('cfmMsg'),
        cfmBtnTexts: base.get('cfmBtnTexts'),
        cfmCallbacks: base.get('cfmCallbacks'),
        showMenu: base.get('showMenu')
    };
};


export default connect(mapStateToProps, null)(BasePage);
