//选择售后类型
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
    },
    {
        text: '换货',
        title: '已收货，需要更换收到的商品',
        value: 3,
        isJingDong: true
    },
    {
        text: '维修',
        title: '已收货，需要维修收到的商品',
        value: 4,
        isJingDong: true
    }
];

export default class applyService extends BaseComponent {
    //获取参数
    getParameter = (value) => decodeURI(getUrlParam(value, encodeURI(this.props.location.search)))

    state = {
        onlyRefund: false, //是否是 仅退款
        Id: this.getParameter('orderId'), //退款所需参数 订单id
        returnType: this.getParameter('returnType'), //退款所需参数 单个商品进行退款还是整条订单进行退款
        prId: this.getParameter('prId'), //退款所需参数 商品id
        arrInfo: this.getParameter('arrInfo'), //退款所需参数 标签
        onlyReturnMoney: this.getParameter('onlyReturnMoney')//待发货过来的退款，不让他点击退货退款给提示
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
        const isJD = this.getParameter('isJD');
        return (
            <div data-component="apply-service" data-role="page" className="apply-service">
                <AppNavBar title="选择售后类型"/>
                <div className="services">
                    {
                        article.map((item, index) => {
                            if (isJD === 'null' ? !item.isJingDong : 1) {
                                return (
                                    <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item.value)}>
                                        <div className="service-left">
                                            <div className="service-text">{item.text}</div>
                                            <div className="service-title">{item.title}</div>
                                        </div>
                                        <div className="service-right"><span className="icon icon-right"/></div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    }
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
