//**收入详情 */


import {InputItem} from 'antd-mobile';
import './index.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {setNavColor} = Utils;
const {navColorF} = Constants;
const hybird = process.env.NATIVE;
export default class Detailpage extends BaseComponent {
    state = {
        detailArr: []
    };

    componentDidMount() {
        this.getAmount(this.props.currentData.id);
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

    getAmount = (num) => {
        this.fetch(urlCfg.detailsOfAmount, {method: 'post', data: {id: num}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        detailArr: res.data
                    });
                }
            });
    }

    //金额前的符号
    payYuan = (detailArr) => {
        if (detailArr) {
            if (detailArr.types === '1') {
                return '+';
            } if (detailArr.types === '0') {
                return '-';
            }
            return '';
        }
        return '';
    }

    //收入与否
    payMoney = (detailArr) => {
        if (detailArr.types === '1') {
            return '收入';
        } if (detailArr.types === '0') {
            return '支出';
        }

        return '';
    }

    //支付状态
    payState = (detailArr) => {
        if (detailArr && detailArr.pay_status === '1') {
            return '已支付';
        } if (detailArr && detailArr.pay_status === '0') {
            return '未支付';
        }
        return '';
    }

    //支付方式
    payFs = (detailArr) => {
        if (detailArr && detailArr.pay_status === '1') {
            return '第三方支付';
        } if (detailArr && detailArr.pay_status === '0') {
            return '余额支付';
        }
        return '';
    }

    render() {
        const {detailArr} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    <div className="cash-content-navbar">
                        <AppNavBar
                            goBackModal={() => this.props.getBackChange('detail')}
                            title="收入详情"
                            rightShow
                        />
                    </div>

                    <div className="amount">
                        <p>{this.payYuan(detailArr)}{detailArr ? detailArr.scalar : ''}元</p>
                        <span>{this.payMoney(detailArr)}金额</span>
                    </div>
                    <div className="other">
                        <InputItem
                            editable={false}
                            value={this.payState(detailArr)}
                        >交易状态：
                        </InputItem>
                        <InputItem
                            value={detailArr ? detailArr.pay_date : ''}
                            editable={false}
                        >交易时间：
                        </InputItem>
                        <InputItem
                            value={this.payFs(detailArr)}
                            editable={false}
                        >支付方式:
                        </InputItem>
                        <InputItem
                            editable={false}
                            value={detailArr ? detailArr.order_no : ''}
                        >交易单号:
                        </InputItem>
                        <InputItem
                            editable={false}
                            value={detailArr ? detailArr.UID : ''}
                        >U I D:
                        </InputItem>
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }
}
