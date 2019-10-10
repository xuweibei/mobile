//设置原始定量
import {Button, List, InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './index.less';

const {urlCfg} = Configs;
const {showInfo, showSuccess, setNavColor} = Utils;
const {MESSAGE: {Feedback}, navColorF} = Constants;
const hybird = process.env.NATIVE;

export default class MyAssets extends BaseComponent {
    state = {
        infoArr: []
    };

    componentDidMount() {
        this.getOriginalList();
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

    getOriginalList = (num) => {
        this.fetch(urlCfg.originalQuantification, {method: 'post', data: {}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        infoArr: res.data
                    });
                }
            });
    }

    //确定按钮
    originalTrue = () => {
        if (this.state.originNum) {
            this.fetch(urlCfg.originalQuantification, {method: 'post', data: {invori: this.state.originNum}})
                .subscribe(res => {
                    if (res.status === 0) {
                        showSuccess(Feedback.Set_Success);
                        this.props.getBackChange();
                    }
                });
        } else {
            showInfo(Feedback.Input);
        }
    }

    render() {
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content-navbar">
                    <AppNavBar goBackModal={() => this.props.getBackChange()} title="原始定量"/>
                </div>
                <div className="ration-content">
                    <p className="tips">根据自己的消费水平，在600-5000之间，以100为单位自由确定（只能确定一次），确定后会获得10倍预备收益</p>
                    <List renderHeader={() => `可用记账：${this.state.infoArr.length > 0 ? this.state.infoArr[0].capital : ''}`} >
                        <InputItem
                            moneyKeyboardAlign="left"
                            placeholder="请输入100的整倍数"
                            type="money"
                            clear
                            style={{borderRadius: '100px'}}
                            onChange={(value) => this.setState({originNum: value})}
                        />
                    </List>
                    <div className="ration-button">
                        <Button onClick={this.originalTrue} className="large-button important">确定</Button>
                    </div>
                </div>
            </div>
        );
    }
}
