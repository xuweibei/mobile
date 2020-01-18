// 京东售后 退货退款维修换货
import {dropByCacheKey} from 'react-router-cache-route';
import {connect} from 'react-redux';
import {Picker, Radio, Button} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './JDService.less';


const {showInfo, appHistory, getUrlParam} = Utils;
const {urlCfg} = Configs;
const RadioItem = Radio.RadioItem;
class JDService extends BaseComponent {
    state = {
        applyTitle: '请选择',
        shopInfo: {}, //商家信息集合
        logistArr: [] //物流集合
    };

    componentDidMount() {
    }

    //获取商家信息
    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.getShopInfo, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        shopInfo: res.data
                    });
                }
            });
    }

    //获取物流列表
    getLogisticsList = () => {
        this.fetch(urlCfg.getLogisticsList)
            .subscribe(res => {
                if (res.status === 0) {
                    res.data.forEach(item => {
                        item.label = item.cate2;
                        item.value = item.id;
                    });
                    this.setState({
                        logistArr: [res.data]
                    });
                }
            });
    }

    //物流切换
    provinceChange = (value) => {
        let str = '';
        this.state.logistArr[0].forEach(item => {
            if (item.id === value[0]) {
                str = item.label;
            }
        });
        this.setState({
            applyTitle: str,
            applyId: value[0]
        });
    }

    //物流单号填写
    inputChange = (value) => {
        this.setState({
            logistMain: value
        });
    }

    //提交申请
    submit = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const {applyId, logistMain} = this.state;
        if (!applyId) return showInfo('请选择物流');
        if (!logistMain) return showInfo('请填写物流单号');
        if (logistMain.length < 8) return showInfo('请输入正确的物流单号');
        this.fetch(urlCfg.setLogisticsList, {method: 'post', data: {id: id, exp_id: applyId, exp_no: logistMain, type: 2}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showInfo(res.message);
                    //将我的订单的tab状态设置为售后
                    this.props.setOrderStatus(4);
                    //清除我的订单的缓存
                    dropByCacheKey('OrderPage');
                    dropByCacheKey('selfMentionOrderPage');//清除线下订单
                    appHistory.replace(`/refundDetails?id=${id}`);
                }
            });
        return undefined;
    }

    render() {
        // const {applyTitle, shopInfo, logistArr} = this.state;
        return (
            <div data-component="JDSerivce" data-role="page" className="JDSerivce">
                <AppNavBar title="申请退货/退款"/>
                <div className="main-top">
                    <div className="shop-info">
                        <img src="../../../../../../assets/images/Lazy-loading.png"/>
                        <p>就地方克里斯个就考虑对方估计快了叫你看了估计快了纳斯达克分类江南时代咖啡机克里斯丁减肥</p>
                    </div>
                    <div className="apply-info">
                        <div className="apply">
                            <p><span>*</span>申请原因</p>
                            <input placeholder="请选择申请原因" disabled/>
                            <div className="icon inp"/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>商品数量</p>
                            <input placeholder="请输入商品数量" disabled/>
                            <div className="icon inp"/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>问题描述</p>
                            <input placeholder="请填写您要描述的内容" disabled/>
                        </div>
                        <div className="apply-img">
                            <div><span>+</span></div>
                            <p>请添加图片</p>
                        </div>
                        <div className="apply-money">
                            <span className="info-left">退款金额：</span>
                            <span className="info-right">￥324354</span>
                        </div>
                    </div>
                </div>
                <div className="main-center">
                    <div className="center-info">
                        <p><span>*</span>是否有包装</p>
                        <div className="choise">
                            <i className="icon hook active"/>
                            <span>是</span>
                        </div>
                        <div className="choise">
                            <i/>
                            <span>否</span>
                        </div>
                    </div>
                    <div className="center-info">
                        <p><span>*</span>包装描述</p>
                        <div className="choise">
                            <i className="icon hook active"/>
                            <span>无包装</span>
                        </div>
                        <div className="choise">
                            <i/>
                            <span>包装完整</span>
                        </div>
                        <div className="choise">
                            <i/>
                            <span>包装破损</span>
                        </div>
                    </div>
                    <div className="center-info">
                        <p><span>*</span>取件方式</p>
                        <div className="choise">
                            <i className="icon hook active"/>
                            <span>上门取件</span>
                        </div>
                        <div className="choise">
                            <i/>
                            <span>客户发货</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        orderStatus: base.get('orderStatus')
    };
};

const mapDispatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(JDService);
