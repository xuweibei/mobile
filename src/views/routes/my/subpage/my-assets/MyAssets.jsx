/**
 * 资产管理
 */

import {List} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './MyAssets.less';

const Item = List.Item;
const {urlCfg} = Configs;
const {appHistory, setNavColor} = Utils;
const {MESSAGE: {Form}, navColorF} = Constants;
const hybird = process.env.NATIVE;

class MyAssets extends BaseComponent {
    state = {
        editModal: '', //当前状态
        Detailed: [] //我的资产首页数据
    };

    componentDidMount() {
        this.getRecord();
        this.getUserNew();
    }

    componentWillMount() {
        if (hybird) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    //获取用户身份
    getUserNew = () => {
        const {userType} = this.state;
        this.fetch(urlCfg.personalCenter, {data: {iden_type: userType}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        userType: res.data.info.iden_type
                    }, () => {
                        //全局储存用户身份
                        this.props.setUseType(res.data.info.iden_type);
                    });
                }
            });
    }

    //获取数据
    getRecord = () => {
        this.fetch(urlCfg.myDetailed)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        Detailed: res.data
                    });
                }
            });
    }

    //子页面返回的回调
    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    };

    //跳转明细页面
    detailed = () => {
        appHistory.push('/myDetailed');
    }

    //点击我的收入的各种弹框提示
    goToMyIcome = () => {
        const {showConfirm, showAlert, userTypes} = this.props;
        let str = '';
        if (userTypes === '2') {
            appHistory.push('/icome?status=6');
        } else if (userTypes === '1') {
            str = Form.No_Merchant;
            showConfirm({
                title: str,
                callbacks: [null, () => {
                    appHistory.push('/openShopPage');//前往开店页面
                }]
            });
        } else if (userTypes === '3') {
            str = Form.You_Extension_Agent;
            showAlert({
                title: str
            });
        } else if (userTypes === '4') {
            str = Form.Switching_Businessmen;
            showAlert({
                title: str
            });
        }
    }

    //底部结构
    defaultModel = () => (
        <div data-component="cash" data-role="page" className="cash">
            <div className="cash-content">
                {
                    window.isWX ? (<AppNavBar title="资产管理"/>) : (
                        <div className="cash-content-navbar">
                            <AppNavBar
                                nativeGoBack
                                title="资产管理"
                            />
                            <div className="detailed" onClick={this.detailed}>明细</div>
                        </div>
                    )
                }
                <div className="money-show">
                    <div onClick={this.goToMyIcome}>
                        <span>{this.state.Detailed.all_taking || '暂无'}</span>
                        <p>业务收入</p>
                    </div>
                    <div onClick={() => appHistory.push('/preparatory-mounth')}>
                        <span><i>￥</i><span className="money">{this.state.Detailed.dividend || 0}</span></span>
                        <p>月结预算</p>
                    </div>
                </div>
                <List>
                    <Item extra={this.state.Detailed.capital || 0} onClick={() => appHistory.push('/projected-revenue')}>记账余额<span className="icon arrows-icon"/></Item>
                    <Item extra={this.state.Detailed.exp_point || 0} onClick={() => appHistory.push('/cam-balance')}>CAM余额<span className="icon arrows-icon"/></Item>
                    <Item extra="" onClick={() => appHistory.push('/preparatory-income')}>预备收益<span className="icon arrows-icon"/></Item>
                    <Item extra="" onClick={() => appHistory.push('/withdrawal')}>CAM提现<span className="icon arrows-icon"/></Item>
                </List>
            </div>
            <div className="cash-bg"/>
        </div>
    )

    render() {
        const {editModal} = this.state;
        return (
            <div className="my-ass">
                {!editModal && this.defaultModel()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const info = state.get('base');
    return {
        userTypes: info.get('userTypes')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    showAlert: actionCreator.showAlert,
    setUseType: actionCreator.setUseType
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);
