/*
* 物流页面
* */
import React from 'react';
import {Accordion, List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Logistics.less';

const {getUrlParam, native, appHistory, setNavColor} = Utils;
const {navColorF} = Constants;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;
export default class MyOrder extends BaseComponent {
    state = {
        orderInfo: [],
        ordertatus: '', //订单状态
        expressNo: '', //物流单号
        text: '',
        pic: '',
        area: '',
        phone: 0
    }

    componentDidMount() {
        const id = decodeURI(getUrlParam('lgId', encodeURI(this.props.location.search)));
        this.getLog(id);
        this.initMap();
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

    initMap = () => {
        const map = new window.BMap.Map('home');
        // FIXME: 经纬度不能写死
        //产品需求，固定地图
        const point = new window.BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
    };

    header = () => {
        const {area} = this.state;
        return (
            <div className="header-wrapper">
                <div className="header-left"/>
                <div className="circular"/>
                <div className="header-right">
                [收货地址]{area}
                </div>
            </div>
        );
    }

    getLog = (id) => {
        const isReturn = decodeURI(getUrlParam('isReturn', encodeURI(this.props.location.search)));
        if (id) {
            this.fetch(isReturn === '1' ? urlCfg.returnLogisticsTrack : urlCfg.logisticsTrack, {data: {
                order_id: Number(id)
            }}).subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data) {
                        this.setState({
                            orderInfo: JSON.parse(res.data.express_content).data,
                            ordertatus: res.data.status,
                            expressNo: res.data.express_no,
                            pic: res.data.picpath,
                            area: res.data.area,
                            phone: res.data.phone
                        }, () => {
                            this.setOrderStatus(this.state.ordertatus);
                            console.log(this.state.orderInfo);
                        });
                    }
                }
            });
        }
    }

    //处理订单状态
    setOrderStatus = (status) => {
        switch (status) {
        case '3':
            this.setState({
                text: '在途'
            });
            break;
        case '4':
            this.setState({
                text: '揽件'
            });
            break;
        case '5':
            this.setState({
                text: '疑难'
            });
            break;
        case '6':
            this.setState({
                text: '签收'
            });
            break;
        case '7':
            this.setState({
                text: '退签'
            });
            break;
        case '8':
            this.setState({
                text: '派件'
            });
            break;
        case '9':
            this.setState({
                text: '退回'
            });
            break;
        default:
            this.setState({
                text: '物流单号暂无结果'
            });
            break;
        }
    }

    //拨打电话
    callPhone = () => {
        if (hybrid) {
            native('callTel', {phoneNum: this.state.phone});
        }
    }

    goBackModal = () => {
        if (hybrid) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {text, expressNo, orderInfo, pic} = this.state;
        return (
            <div data-component="logistics" data-role="page" className="logistics">
                <AppNavBar title="物流跟踪" clannName="navbar" goBackModal={this.goBackModal}/>
                <div className="container">
                    <div id="home" style={{height: '93vh'}}/>
                    <div className="status">
                        <div className="avatar"><img src={pic} alt=""/></div>
                        <div className="info">
                            <div className="info-status">订单状态: {text}</div>
                            <div className="info-num">订单号：{expressNo}</div>
                        </div>
                        <div className="phone">
                            <div className="icon icon-phone"/>
                            <div className="phone-num" onClick={this.callPhone}>联系物流</div>
                        </div>
                    </div>
                    <Accordion className="address">
                        <Accordion.Panel header={this.header()}>
                            {
                                orderInfo.map(item => (
                                    <List>
                                        <div className="logistics-box">
                                            <div className="logistics-left">
                                                <div className="time">{item.time.substr(5, 5)}</div>
                                                <div className="date">{item.time.substr(11, 5)}</div>
                                            </div>
                                            <div className="dot"/>
                                            <div className="logistics-right">
                                                <div className="collect">已签收</div>
                                                <div className="news">{item.context}</div>
                                            </div>
                                        </div>
                                    </List>
                                ))
                            }
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        );
    }
}
