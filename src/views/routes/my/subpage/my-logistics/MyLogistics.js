/**我的页面物流信息 */
import {Drawer, List, Carousel} from 'antd-mobile';

const {showInfo, native, appHistory} = Utils;
const {MESSAGE: {Form}} = Constants;

export default class MyLogistics extends BaseComponent {
    state = {
        open: false,
        selectIndex: 0,
        phoneArr: []
    };

    componentWillMount() {
        const {logInfo} = this.props;
        const arr = [];
        const slArr = logInfo;
        slArr.forEach(item => {
            arr.push(item.express_content.phone);
        });
        this.setState({
            phoneArr: arr
        });
    }

    //物流状态
    logisticsStatus = (num) => {
        let str = '';
        switch (num) {
        case '0':
            str = '物流单号暂无结果';
            break;
        case '3':
            str = '在途';
            break;
        case '4':
            str = '揽件';
            break;
        case '5':
            str = '疑难';
            break;
        case '6':
            str = '签收';
            break;
        case '7':
            str = '退签';
            break;
        case '8':
            str = '派件';
            break;
        case '9':
            str = '退回';
            break;
        default:
            str = '物流单号暂无结果';
        }
        return str;
    }

    //拨打电话
    callPhone = (tel) => {
        const hybrid = process.env.NATIVE;
        if (hybrid) {
            native('callTel', {phoneNum: tel});
        }
        this.setState({
            open: false
        });
    }

    goToLogist = (id) => {
        appHistory.push(`/logistics?lgId=${id}`);
        this.props.closeLogitasce();
    }

    //底部结构
    bottomModal = (logInfo, index, open) =>  (
        <React.Fragment>
            <div className="transport">
                <div>
                    <span className="railing-state">{this.logisticsStatus(logInfo.status)}</span>
                </div>
                <div className="detailed">
                    <span className="detailed-left">
                        <img src={logInfo.picpath} alt=""/>
                    </span>
                    <span className="detailed-center">
                        <div className="commodity-name">{logInfo.pr_title}</div>
                        <div className="odd-numbers">
                            <span className="odd-numbers-left">{logInfo.express_cate2}</span>
                            <span>{logInfo.express_no}</span>
                        </div>
                        {/* <div className="estimate">预计明天送达</div> */}
                    </span>
                    <span className="icon detailed-right" onClick={() => this.goToLogist(logInfo.id)}/>
                </div>
            </div>
            <div className="details">
                <div className="transport-details">
                    <div className="datetime">
                        {/* <div className="date">03-03</div>
                                <div className="time">15:27</div> */}
                    </div>
                    <div className="information-box">
                        <div className="lastInfo">
                            {/* <div className="information-top">订单创建成功</div> */}
                            <div className="information-bottom">
                                {logInfo.address}
                            </div>
                        </div>
                    </div>
                    <div className="status-icon-box"><div className="status-icon"/></div>
                </div>
                {
                    logInfo.express_content.data.map((item, num) => (
                        <div key={item.time} className={`${num === 0 ? 'logistics-vehicle' : ''}${num === logInfo.express_content.data.length - 1 ? 'framing' : ''} ${num === 0 ? 'transport-details logisticsActive' : 'transport-details'}`}>
                            <div className="datetime">
                                <div className="date">{item.time.split(' ')[0].slice(5)}</div>
                                <div className="time">{item.time.split(' ')[1].slice(0, 5)}</div>
                            </div>
                            <div className="information-box">
                                <div className={num === 0 ? 'logisticsActive information' : 'information'}>
                                    {/* <div className="information-top">订单创建成功</div> */}
                                    <div className="information-bottom">
                                        {item.context}
                                    </div>
                                </div>
                            </div>
                            <div className="status-icon-box"><div className="icon status-icon"/></div>
                        </div>
                    ))
                }
                <div className="contact-box">
                    <span className="icon contact" onClick={() => this.openPhone(open, index)}>联系物流</span>
                </div>
            </div>
        </React.Fragment>
    )

    //打开电话拨打电话列表
    openPhone = (open, index) => {
        const {phoneArr} = this.state;
        this.setState({open: !open, selectIndex: index});
        if (phoneArr[index].length === 0) {
            showInfo(Form.No_lgPhone);
        }
    }

    //前往我的订单，待收货
    goToMoOrder = () => {
        appHistory.push('/myOrder/sh');
        this.props.closeLogitasce();
    }

    render() {
        const {logInfo} = this.props;
        const {open, selectIndex, phoneArr} = this.state;
        const sidebar = (
            <List>
                {phoneArr[selectIndex].map((item) => (<List.Item onClick={() => this.callPhone(item)}>{item}</List.Item>))}
                <List.Item onClick={() => this.setState({open: false})}>取消</List.Item>
            </List>
        );
        return (
            <div className="transport-window">
                <div className="transport-box">
                    <Carousel
                        dots={false}
                        infinite={false}
                    >
                        {
                            logInfo.length > 0 && logInfo.map((item, index) => this.bottomModal(item, index, open))
                        }
                    </Carousel>
                </div>
                <div className="fork-wrap"><span className="icon fork" onClick={this.props.closeLogitasce}/></div>
                <div className="complete" onClick={this.goToMoOrder}>查看全部</div>
                {phoneArr[selectIndex].length > 0 && <Drawer open={open} className={open ? 'am-drawer-fixed' : ''} position="bottom" sidebar={sidebar}/>}

            </div>
        );
    }
}
