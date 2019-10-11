import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {List} from 'antd-mobile';
import {myActionCreator as actionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './UserId.less';

const Item = List.Item;
const hybird = process.env.NATIVE;
const {setNavColor} = Utils;
const {navColorF} = Constants;
class UserId extends React.PureComponent {
    static defaultProps = {
        uidInfo: '',
        getUid: ''
    };

    static propTypes = {
        uidInfo: PropTypes.object,
        getUid: PropTypes.func
    }


    componentWillMount() {
        if (hybird) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentDidMount() {
        const {uidInfo, getUid} = this.props;
        if (!uidInfo) {
            getUid();
        }
    }


    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    render() {
        const {uidInfo} = this.props;
        return (
            <div data-component="userId" data-role="page" className="user-id">
                <AppNavBar title="源头UID"/>
                <div className="banner">
                    <img src={uidInfo && uidInfo.avatarUrl} alt=""/>
                </div>
                <List className={`my-list ${window.isWX ? 'my-list-clear' : ''}`}>
                    <Item
                        extra={uidInfo && uidInfo.nickname}
                    >昵称
                    </Item>
                    <Item
                        extra={(uidInfo && uidInfo.no) || '无'}
                    >UID
                    </Item>
                </List>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        uidInfo: EditInfo.get('uidInfo')
    };
};

const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo,
    getUid: actionCreator.getUid
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserId);
