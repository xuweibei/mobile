import AppNavBar from '../../../../../common/navbar/NavBar';
import './SourceIndex.less';

const {appHistory, native} = Utils;
const article = [
    {
        text: '扫码确认',
        value: 0
    },
    {
        text: '手动输入确认',
        value: 2
    }
];
const {urlCfg} = Configs;

export default class applyService extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08)
    }

    //点击扫一扫
    sureSaoCode = () => {
        if (process.env.NATIVE) {
            const obj = {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            };
            native('qrCodeScanCallback', obj);
        }
    }

    //售后申请类型
    serviceList = (value) => {
        if (value === 2) {
            appHistory.push('/sourcehand');
        } else if (window.isWX) {
            window.wx.ready(() => {
                window.wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        console.log(res); // 当needResult 为 1 时，扫码返回的结果
                    }
                });
            });
        } else {
            this.sureSaoCode();
        }
    }

    goBackModal = () => {
        if (appHistory.length() === 0) {
            appHistory.push('/edit');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {height} = this.state;
        return (
            <div data-component="apply-service" data-role="page" className="source-index">
                <AppNavBar goBackModal={this.goBackModal} title="确认源头UID"/>
                <div style={{height: height}} className="services">
                    {article.map((item, index) => (
                        <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item.value)}>
                            <div className="service-left" onClick={() => this.looklook(index)}>
                                <div className="service-text">{item.text}</div>
                            </div>
                            <div className="service-right"><span className="icon icon-right"/></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
