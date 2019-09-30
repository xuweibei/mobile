import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {IconFont} from '../../../../../common/icon-font/IconFont';
import './RefundDetails.less';

const {getUrlParam, appHistory, showInfo, native} = Utils;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;

const {MESSAGE: {Form, Feedback}} = Constants;
class refundDetails extends BaseComponent {
    state = {
        refundArr: []
    };

    componentDidMount() {
        this.getInfo();
    }

    getInfo = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.refundDetail, {
            method: 'post',
            data: {id}
        }).subscribe(res => {
            if (res.status === 0) {
                this.setState({
                    refundArr: res.data
                });
            }
        });
    };

    //退货状态
    refundState = num => {
        let str = '';
        switch (num) {
        case '0':
            str = '未审核';
            break;
        case '1':
            str = '未审核';
            break;
        case '2':
            str = '未审核';
            break;
        case '3':
            str = '未审核';
            break;
        default:
            str = '';
            break;
        }
        return str;
    };

    //售后状态
    afterSalesType = num => {
        let str = '';
        switch (num) {
        case '0':
            str = '仅退款（退运费）';
            break;
        case '1':
            str = '退货';
            break;
        case '2':
            str = '退款退货';
            break;
        case '3':
            str = '换货';
            break;
        case '4':
            str = '维修';
            break;
        default:
            str = '';
            break;
        }
        return str;
    };

    //点击撤销订单
    revoke = () => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Revocation_Apply,
            btnTexts: ['我再想想', '确认撤销'],
            callbacks: [null, () => {
                const {refundArr} = this.state;
                this.fetch(urlCfg.revokeOrder, {method: 'post', data: {id: refundArr.id}})
                    .subscribe(res => {
                        this.setState({
                            showModal: false,
                            modalTitle: ''
                        });
                        if (res.status === 0) {
                            showInfo(Feedback.Rovke_Success);
                            this.setState({
                                revoke: false
                            });
                            if (res.data.if_express === '1') {
                                appHistory.replace('/myOrder/sh');
                            } else {
                                appHistory.replace('/selfMention');
                            }
                        }
                    });
            }]
        });
    }

    //拨打电话
    shopPhone = () => {
        const {showConfirm} = this.props;
        showConfirm({
            title: '是否拨打电话',
            callbacks: [null, () => {
                const hybird = process.env.NATIVE;
                const {refundArr} = this.state;
                this.fetch(urlCfg.getShopMain, {method: 'post', data: {shop_mid: refundArr.shop_mid}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            if (hybird) {
                                native('callTel', {phoneNum: res.data.phone});
                            }
                        }
                    });
            }]
        });
    }

    //修改申请
    application = () => {
        const {refundArr} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        const refurn = decodeURI(getUrlParam('refurn', encodeURI(this.props.location.search)));//为1表示仅退款
        //type等于 2 时为线下订单修改申请
        appHistory.push(`/applyDrawback?id=${refundArr.id}&type=${type}&refurn=${refurn}`);
    }

    //投诉
    complaint = () => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        appHistory.push(`/myComplain?orderId=${id}`);
    }

    //填写物流
    fillInLogistics = () => {
        const {refundArr} = this.state;
        appHistory.push(`/returnGoods?id=${refundArr.id}&shopId=${refundArr.shop_mid}`);
    }

    //查看物流
    seeLogistics = (id) => {
        appHistory.push(`/logistics?lgId=${id}&isReturn=1`);
    }

    //底部按钮
    allButton = (item) => {
        let blockModal = <div/>;
        const {refundArr} = this.state;
        switch (item.status) {
        case '1'://退款申请中
            blockModal = (
                <div className="buttons">
                    <div onClick={() => this.revoke()} className="look-button">撤销申请</div>
                    <div onClick={() => this.application()} className="evaluate-button">修改申请</div>
                </div>
            );
            break;
        case '2'://退款退货才有这个状态   退货中
            blockModal = (
                <div className="buttons">
                    <div className="look-button" onClick={() => this.revoke()}>撤销申请</div>
                    {
                        refundArr.types !== '0' && !refundArr.express_no && <div className="evaluate-button" onClick={this.fillInLogistics}>填写物流</div>
                    }
                    {
                        refundArr.types !== '0' && refundArr.express_no && <div className="evaluate-button" onClick={() => this.seeLogistics(refundArr.id)}>查看物流</div>
                    }
                </div>
            );
            break;
        case '3'://退款成功
        case '4'://商家拒绝 售后关闭
        case '5'://自己撤销 售后关闭
            blockModal = (
                <div className="buttons">
                    <div className="look-button" onClick={this.complaint}>投诉</div>
                </div>
            );
            break;
        default:
            blockModal = (<div/>);
        }
        return blockModal;
    }

    //前往协商历史
    goToConsultHistory = () => {
        appHistory.push('/consultHistory');
    }

    //联系商家
    goToShoper = () => {
        const {refundArr} = this.state;
        if (hybrid) {
            native('goToShoper', {shopNo: refundArr.no, id: refundArr.order_id, type: '1', shopNickName: refundArr.nickname, imType: '2', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    }

    render() {
        const {refundArr} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        return (
            <div
                data-component="after-service"
                data-role="page"
                className="after-service"
            >
                {/*标题头部*/}
                <div className="refund-top">
                    <AppNavBar title="退款详情"/>
                    <div className="refund-bottom">
                        <div className="refund-success">
                            {refundArr.status_name}
                        </div>
                        {/* <div className="refund-success">{refundArr.msg}</div> */}
                        <div className="refund-time">
                            <span className="time-l">{refundArr.msg}</span>
                            {/*<span>00:00:00</span>*/}
                        </div>
                    </div>
                </div>
                {/*商品*/}
                {/* <div className="consult-his" onClick={this.goToConsultHistory}><span>协商历史</span><span className="icon history"/></div> */}
                <div className="refund-content">
                    <div className="refund-box">
                        {
                            refundArr.pr && refundArr.pr.map(value => (
                                <div>
                                    <div className="details">
                                        <div className="details-l">
                                            <img src={value.picpath} alt=""/>
                                        </div>
                                        <div className="details-r">
                                            <div className="introduce">
                                                <span className="introduce-l">
                                                    {value.pr_title}
                                                </span>
                                                <span className="introduce-r">
                                                    ￥{value.price}
                                                </span>
                                            </div>
                                            <div className="label">
                                                {value.values_name}
                                                <span className="label-r">
                                                x{value.pr_num }
                                                </span>
                                            </div>
                                            {refundArr.is_shoper === 0 && type !== '2' && this.allButton(refundArr)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/*退货问题*/}
                <div className="refund-details">
                    <div className="detail-list">
                        <span className="list-left">退款金额：</span>
                        <span>{refundArr.return_price}</span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">退款原因：</span>
                        <span>{refundArr.reason ? refundArr.reason.split(',').join('|') : '' }</span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请数量：</span>
                        <span>{refundArr.num}件</span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请时间：</span>
                        <span>
                            {refundArr.crtdate}
                        </span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">退款编号：</span>
                        <span>
                            {refundArr.return_no}
                        </span>
                    </div>
                    {
                        refundArr.express_no && (
                            <div className="detail-list">
                                <span className="list-left">物流订单号</span>
                                <span>
                                    {refundArr.express_no}
                                </span>
                            </div>
                        )
                    }
                    <div className="business-box">
                        <div className="business">
                            <div className="business-left icon" onClick={this.goToShoper}><span>联系商家</span></div>
                            <span className="business-right icon" onClick={() => this.shopPhone()}>商家电话</span>
                        </div>
                    </div>
                    {/* <div className="detail-list">
                        <span className="list-left">物流订单号：</span>
                        <span>12313131321313</span>
                    </div> */}
                    {
                        refundArr.status === '3' && (
                            <div className="refund-sucess">
                                <div className="detail-list">
                                    <span className="list-left">售后类型：</span>
                                    <span>{this.afterSalesType(refundArr.types)}</span>
                                </div>
                                <div calassName="refund-details">
                                    <div className="detail-list">
                                        <span className="list-left">退款金额：</span>
                                        <span>{refundArr.price}</span>
                                    </div>
                                </div>
                                <div calassName="refund-details">
                                    <div className="detail-list">
                                        <span className="list-left">问题描述</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div/>
                {
                    type === '2' && (
                        <div className="cancel-order-box">
                            {refundArr && refundArr.status === '1' && <div onClick={this.revoke} className="immediate-evaluation-c">撤销申请</div>}
                            {refundArr && refundArr.status === '1' && <div onClick={this.application} className="immediate-evaluation">修改申请</div>}
                            {refundArr && refundArr.status === '2' && <div onClick={this.revoke} className="immediate-evaluation-c">撤销申请</div>}
                            {refundArr && refundArr.status === '2' && <div onClick={this.complaint} className="immediate-evaluation">投诉</div>}
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm
};

export default connect(
    null,
    mapDidpatchToProps
)(refundDetails);
