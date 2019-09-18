import AppNavBar from '../../../../../common/navbar/NavBar';
import './ApplyService.less';

const {getUrlParam, appHistory, showInfo} = Utils;
const article = [
    {
        text: '仅退款',
        title: '未收到货（包含未签收），或已与卖家协商',
        value: 0
    },
    {
        text: '退货退款',
        title: '已收货，需要退还商品',
        value: 2
    }
];

export default class applyService extends BaseComponent {
    state = {
        onlyRefund: false, //是否是 仅退款
        Id: decodeURI(getUrlParam('orderId', encodeURI(this.props.location.search))), //退款所需参数 订单id
        returnType: decodeURI(getUrlParam('returnType', encodeURI(this.props.location.search))), //退款所需参数 单个商品进行退款还是整条订单进行退款
        prId: decodeURI(getUrlParam('prId', encodeURI(this.props.location.search))), //退款所需参数 商品id
        arrInfo: decodeURI(getUrlParam('arrInfo', encodeURI(this.props.location.search))), //退款所需参数 标签
        onlyReturnMoney: decodeURI(getUrlParam('onlyReturnMoney', encodeURI(this.props.location.search)))//待发货过来的退款，不让他点击退货退款给提示
    }

    //售后申请类型
    serviceList = (value) => {
        const {Id, returnType, prId, arrInfo, onlyReturnMoney} = this.state;
        if (onlyReturnMoney === '1' && value === 2) {
            showInfo('商家还未发货，请选择“仅退款”');
        } else {
            let onOff = false;
            if (!value) { //判断是否仅退款，true是
                onOff = true;
            }
            appHistory.push(`/onlyRefund?orderId=${Id}&prId=${prId}&returnType=${returnType}&arrInfo=${arrInfo}&onlyRefund=${onOff}`);
        }
    }

    render() {
        return (
            <div data-component="apply-service" data-role="page" className="apply-service">
                <AppNavBar title="选择售后类型"/>
                <div className="services">
                    {article.map((item, index) => (
                        <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item.value)}>
                            <div className="service-left">
                                <div className="service-text">{item.text}</div>
                                <div className="service-title">{item.title}</div>
                            </div>
                            <div className="service-right"><span className="icon icon-right"/></div>
                        </div>
                    ))}
                    {/*温馨提示信息*/}
                    <div className="prompt">
                        <div className="prompt-text">温馨提示</div>
                        <div className="prompt-title">
                            <div>售后均需要提前与卖家协商</div>
                            <div>自行寄回无效</div>
                            {/* <div>平台不介入售后服务</div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
