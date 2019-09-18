import AppNavBar from '../../../../../common/navbar/NavBar';
import './Source.less';

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

const hybrid = process.env.NATIVE;

export default class applyService extends BaseComponent {
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

    render() {
        return (
            <div data-component="apply-service" data-role="page" className="source-index">
                <AppNavBar title="确认源头UID"/>
                <div className="services">
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
