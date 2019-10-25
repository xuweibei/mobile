import {List, Modal} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreementDetail.less';

const Item = List.Item;
const {native, getUrlParam} = Utils;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;
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
            this.getProtocol(Number(type));
        }
    }

    state = ({
        protocol: {}, //协议内容
        protocolTitle: '', //协议标题
        modal: false
    })

    //协议弹窗
    getProtocol = (num) => {
        if (num > 0) {
            this.fetch(urlCfg.getAgreement, {data: {type: num}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        if (res.data) {
                            const proArr = new Map([
                                [1, res.data.pr_content],
                                [2, res.data.card_content],
                                [3, res.data.secret_content],
                                [4, res.data.member_content]
                            ]);
                            const proArrTitle = new Map([
                                [1, '软件许可使用协议'],
                                [2, '平台服务协议'],
                                [3, '特别说明'],
                                [4, '版本信息隐私权政策']
                            ]);
                            this.setState({
                                protocol: proArr.get(num) || '',
                                protocolTitle: proArrTitle.get(num) || ''
                            }, () => {
                                this.showModal(true);
                            });
                        }
                    }
                });
        } else {
            this.setState({
                protocol: (
                    <div className="version-info">
                        <p>中华人民共和国<br/>增值电信业务经营许可证
                        </p>
                        <p className="allow-number">经营许可证编号：鲁B2-20190240</p>
                    </div>
                ),
                protocolTitle: '版本信息'
            }, () => {
                this.showModal(true);
            });
        }
    }

    showModal = (modal) => {
        // e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            modal
        });
    }

    render() {
        const {protocol, modal, protocolTitle} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        return (
            <div data-component="UserAgreementDetail" data-role="page" className="UserAgreementDetail">
                {
                    type === 'null' && (
                        <React.Fragment>
                            <AppNavBar title="关于"/>
                            <List>
                                {(/iphone|ipad/gi).test(navigator.platform) && <Item arrow="horizontal" onClick={() => { hybrid && native('evalMe') }}>给我评价</Item>}
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
                                <Item extra="有新版" arrow="horizontal" onClick={() => hybrid && native('checkVersion', {'': ''})}>新版本检测</Item>
                            </List>
                            <span className="corporate">中战华安控股集团有限公司</span>
                            <span className="edition">当前版本号：1.0.3</span>
                        </React.Fragment>
                    )
                }
                <div>
                    <Modal
                        visible={modal}
                        className="protocol-modal"
                        title={protocolTitle}
                        footer={[{text: '确定',
                            onPress: () => {
                                if (hybrid && type !== 'null') {
                                    native('goBack');
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
