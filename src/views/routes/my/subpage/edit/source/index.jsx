import AppNavBar from '../../../../../common/navbar/NavBar';
import './SourceIndex.less';

const {appHistory, native, setNavColor} = Utils;
const {navColorF} = Constants;
const hybird = process.env.NATIVE;
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

const hybrid = process.env.NATIVE;

export default class applyService extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08)
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

    //点击扫一扫
    sureSaoCode = () => {
        if (hybrid) {
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
                            <div className="service-left">
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
