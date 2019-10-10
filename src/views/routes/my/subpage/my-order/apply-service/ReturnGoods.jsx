import {dropByCacheKey} from 'react-router-cache-route';
import {connect} from 'react-redux';
import {Picker, InputItem, Button} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ApplyService.less';


const {showInfo, appHistory, getUrlParam, setNavColor} = Utils;
const {navColorF} = Constants;
const {urlCfg} = Configs;
const hybird = process.env.NATIVE;
class ApplyServiceDetail extends BaseComponent {
    state = {
        applyTitle: '请选择',
        shopInfo: {}, //商家信息集合
        logistArr: [] //物流集合
    };

    componentDidMount() {
        this.getList();
        this.getLogisticsList();
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

    //获取商家信息
    getList = () => {
        const id = decodeURI(getUrlParam('shopId', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.getShopInfo, {method: 'post', data: {id}})
            .subscribe(res => {
                if (res.status === 0) {
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
                if (res.status === 0) {
                    showInfo(res.message);
                    //将我的订单的tab状态设置为售后
                    this.props.setOrderStatus(4);
                    //清除我的订单的缓存
                    dropByCacheKey('OrderPage');
                    appHistory.replace(`/refundDetails?id=${id}`);
                }
            });
        return undefined;
    }

    render() {
        const {applyTitle, shopInfo, logistArr} = this.state;
        return (
            <div data-component="ApplyServiceDetail" data-role="page" className="ApplyServiceDetail">
                <AppNavBar title="退货退款"/>
                <div className="address-box">
                    <div className="address">
                        <div className="shop-name-box">
                            <span className="shop-name">店家姓名</span>
                            <span>{shopInfo.shopName}</span>
                        </div>
                        <div className="position-box">
                            <span className="position">收货地址</span>
                            <span>{shopInfo.takeAddress}</span>
                        </div>
                    </div>
                </div>
                <div className="Apply-botton">
                    <div className="Apply-list">
                        <div className="Apply-list-text">物流选择</div>
                        <div className="Apply-list-select">
                            <div className="Apply-picker">
                                <Picker
                                    onChange={this.provinceChange}
                                    cascade={false}
                                    data={logistArr}
                                    cols={1}
                                >
                                    <div>
                                        <span className="Apply-texts">{applyTitle}</span>
                                        <span className="icon icon-Apply-tight"/>
                                    </div>
                                </Picker>
                            </div>
                        </div>
                    </div>
                    <div className="Apply-list">
                        <div className="Apply-list-text"><span>*</span>物流单号</div>
                        <div className="Apply-list-select">
                            <InputItem
                                clear
                                type="number"
                                onChange={this.inputChange}
                            />
                        </div>
                    </div>
                    <div className="button">
                        <Button onClick={this.submit} className="large-button disable-button">提交</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplyServiceDetail);
