import {List, Modal} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreementDetail.less';

const Item = List.Item;
const {native, setNavColor} = Utils;
const {navColorF} = Constants;
const {urlCfg} = Configs;
const hybird = process.env.NATIVE;

class UserAgreementDetail extends BaseComponent {
    state = ({
        protocol: {}, //协议内容
        modal: false
    })

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

    //协议弹窗
    getProtocol = (num) => {
        this.fetch(urlCfg.getAgreement, {method: 'post', data: {type: num}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data) {
                        if (num === 1) {
                            this.setState({
                                protocol: res.data.pr_content
                            }, () => {
                                this.showModal(true);
                            });
                        } else if (num === 2) {
                            this.setState({
                                protocol: res.data.card_content
                            }, () => {
                                this.showModal(true);
                            });
                        } else if (num === 3) {
                            this.setState({
                                protocol: res.data.secret_content
                            }, () => {
                                this.showModal(true);
                            });
                        } else {
                            this.setState({
                                protocol: res.data.member_content
                            }, () => {
                                this.showModal(true);
                            });
                        }
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
                        <Item arrow="horizontal" onClick={() => this.getProtocol(3)}>特别说明</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(2)}>平台服务协议</Item>
                        <Item arrow="horizontal" onClick={() => this.getProtocol(4)}>隐私权政策</Item>
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
                        footer={[{text: '确定', onPress: () => { this.showModal(false) }}]}
                    >
                        <div style={{overflow: 'auto', height: '100%', width: '100%'}}>
                            {/* <div dangerouslySetInnerHTML={{__html: protocol.content}}/> */}
                            <div>
                                {protocol}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default UserAgreementDetail;
