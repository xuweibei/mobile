import {List, Modal} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreementDetail.less';

const Item = List.Item;
const {native} = Utils;
const {urlCfg} = Configs;

class UserAgreementDetail extends BaseComponent {
    state = ({
        protocol: {}, //协议内容
        modal: false
    })

    //协议弹窗
    getProtocol = (num) => {
        this.fetch(urlCfg.protocolsCase, {method: 'post'})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data[num]) {
                        this.setState({
                            protocol: res.data[num]
                        }, () => {
                            this.showModal(true);
                        });
                    }
                }
            });
    }

    showModal = (modal) => {
        // e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            modal: modal
        });
    }

    render() {
        const {protocol} = this.state;
        console.log(protocol);
        return (
            <div data-component="UserAgreementDetail" data-role="page" className="UserAgreementDetail">
                <AppNavBar title="关于"/>
                <List>
                    <Item arrow="horizontal" onClick={() => {}}>给我评价</Item>
                </List>
                <List>
                    <div className="about-information">
                        <Item arrow="horizontal" onClick={() => {}}>版权信息</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(0)}>软件许可使用协议</Item>
                        <Item arrow="horizontal" onClick={() => {}}>特别说明</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(1)}>平台服务协议</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(2)}>隐私权政策</Item>
                        <Item arrow="horizontal" onClick={() => {}}>证照信息</Item>
                    </div>
                </List>
                <List>
                    <Item extra="有新版" arrow="horizontal" onClick={() => native('checkVersion')}>新版本检测</Item>
                </List>
                <span className="corporate">中战华安控股集团有限公司</span>
                <span className="edition">当前版本号：1.0.3</span>
                <div>
                    <Modal
                        visible={this.state.modal}
                        className="protocol-modal"
                        title={protocol.title}
                        footer={[{text: '确定', onPress: () => { this.showModal(false)() }}]}
                    >
                        <div style={{overflow: 'auto', height: '300px', width: '100%'}}>
                            <div dangerouslySetInnerHTML={{__html: protocol.content}}/>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default UserAgreementDetail;
