import {List} from 'antd-mobile';
import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreementDetail.less';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';

const Item = List.Item;
const {native} = Utils;
const {urlCfg} = Configs;

class UserAgreementDetail extends BaseComponent {
    //协议弹窗
    getProtocol = (num) => {
        const {showAlert} = this.props;
        this.fetch(urlCfg.allProtocolInfo, {method: 'post', data: {type: num}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    console.log(res.data.card_content, 'dfdff');
                    showAlert({
                        // callbacks: [null, () => {}]
                        title: res.data.card_content,
                        // message: res.data.card_content,
                        btnText: '好'
                    });
                }
            });
    }

    render() {
        return (
            <div data-component="UserAgreementDetail" data-role="page" className="UserAgreementDetail">
                <AppNavBar title="关于"/>
                <List>
                    <Item arrow="horizontal" onClick={() => {}}>给我评价</Item>
                </List>
                <List>
                    <div className="about-information">
                        <Item arrow="horizontal" onClick={() => {}}>版权信息</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(1)}>软件许可使用协议</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(2)}>特别说明</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(3)}>平台服务协议</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(4)}>隐私权政策</Item>
                        <Item arrow="horizontal" onClick={() => {}}>证照信息</Item>
                    </div>
                </List>
                <List>
                    <Item extra="有新版" arrow="horizontal" onClick={() => native('checkVersion')}>新版本检测</Item>
                </List>
                <span className="corporate">中战华安控股集团有限公司</span>
                <span className="edition">当前版本号：1.0.3</span>
            </div>
        );
    }
}

const mapToDispatchProps = {
    showAlert: actionCreator.showAlert
};

export default connect(null, mapToDispatchProps)(UserAgreementDetail);