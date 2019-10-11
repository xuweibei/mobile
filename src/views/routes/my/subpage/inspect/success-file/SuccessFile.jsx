import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './SuccessFile.less';
import {native} from '../../../../../../utils/native';

const {appHistory, setNavColor} = Utils;
const {navColorF} = Constants;
const timer = null;

const hybrid = process.env.NATIVE;
class SuccessFile extends BaseComponent {
    state = {
        info: {},
        time: 10
    }

    componentDidMount() {
        const {orderInfo} = this.props;
        this.setState({
            info: orderInfo
        });
        let num = 10;

        setInterval(() => {
            num -= 1;
            this.setState({
                time: num
            }, () => {
                if (this.state.time === 0) {
                    clearInterval(timer);
                    if (hybrid) {
                        native('goHome');
                    } else {
                        appHistory.replace('/home');
                    }
                }
            });
        }, 1000);
    }

    componentWillMount() {
        if (hybrid) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybrid) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    goHome = () => {
        if (hybrid) {
            native('goHome');
        } else {
            appHistory.replace('/home');
        }
    }

    orderDetail = () => {
        appHistory.replace(`listDetails?id=${this.state.info.id}`);
    }

    render() {
        const {info, time} = this.state;
        return (
            <div className="success-files">
                <AppNavBar title="核销成功"/>
                <p className="success-title">页面将在{time}秒后自动跳转</p>
                <div className="info-img"/>
                <p className="success-title">核销成功啦！</p>
                <ul className="success-info">
                    <li>
                        <span>订单编号</span>
                        <span>{info.order_no}</span>
                    </li>
                    <li>
                        <span>订单金额</span>
                        <span>{info.price}</span>
                    </li>
                    <li>
                        <span>订单记账量</span>
                        <span>{info.deposit}</span>
                    </li>
                    <li>
                        <span>核销时间</span>
                        <span>{info.recive_date}</span>
                    </li>
                </ul>
                <div className="btn-box">
                    <div onClick={this.orderDetail}>查看订单</div>
                    <div onClick={this.goHome}>返回首页</div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const my = state.get('my');

    return {
        orderInfo: my.get('orderInfo')
    };
};
export default connect(mapStateToProps, null)(SuccessFile);
