import {List, Modal} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreementDetail.less';

const Item = List.Item;
const {native, getUrlParam} = Utils;
const {urlCfg} = Configs;
const itemLists = [
    {title: '版本信息', params: null},
    {title: '软件许可使用协议', params: 1},
    {title: '特别说明', params: 3},
    {title: '平台服务协议', params: 2},
    {title: '版本信息隐私权政策', params: 4},
    {title: '证照信息', params: null}
];

class UserAgreementDetail extends BaseComponent {
    componentWillMount() {
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        if (type !== 'null') {
            this.getProtocol(type);
        }
    }

    state = ({
        protocol: {}, //协议内容
        protocolTitle: '', //协议标题
        modal: false
    })

    //协议弹窗
    getProtocol = (num) => {
        let protocol = '';
        let protocolTitle = '';
        this.fetch(urlCfg.getAgreement, {method: 'post', data: {type: num}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data) {
                        if (num === 1) {
                            protocol = res.data.pr_content;
                            protocolTitle = '软件许可使用协议';
                        } else if (num === 2) {
                            protocol = res.data.card_content;
                            protocolTitle = '平台服务协议';
                        } else if (num === 3) {
                            protocol = res.data.secret_content;
                            protocolTitle = '特别说明';
                        } else if (num === 4) {
                            protocol = res.data.member_content;
                            protocolTitle = '版本信息隐私权政策';
                        } else {
                            protocol = '';
                        }
                        this.setState({
                            protocol,
                            protocolTitle
                        }, () => this.showModal(true));
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
        const {protocol, modal, protocolTitle} = this.state;
        return (
            <div data-component="UserAgreementDetail" data-role="page" className="UserAgreementDetail">
                <AppNavBar title="关于"/>
                <List>
                    <Item arrow="horizontal" onClick={() => { native('evalMe') }}>给我评价</Item>
                </List>
                <List>
                    <div className="about-information">
                        {
                            itemLists.map(item => (
                                <Item arrow="horizontal" key={item.title} onClick={() => this.getProtocol(item.params)}>{item.title}</Item>
                            ))
                        }
                    </div>
                </List>
                <List>
                    <Item extra="有新版" arrow="horizontal" onClick={() => native('checkVersion')}>新版本检测</Item>
                </List>
                <span className="corporate">中战华安控股集团有限公司</span>
                <span className="edition">当前版本号：1.0.3</span>
                <div>
                    <Modal
                        visible={modal}
                        className="protocol-modal"
                        title={protocolTitle}
                        footer={[{text: '确定',
                            onPress: () => {
                                const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
                                if (type !== 'null') {
                                    native('loginout');
                                }
                                this.showModal(false);
                            }}]}
                    >
                        <div className="protocol-content">
                            {protocol}
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default UserAgreementDetail;
