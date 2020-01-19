// 京东售后 退货退款维修换货
import {dropByCacheKey} from 'react-router-cache-route';
import {connect} from 'react-redux';
import {Button, ImagePicker} from 'antd-mobile';
import Region from '../../../../../common/region/Region';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import './JDService.less';


const {showInfo, appHistory, getUrlParam} = Utils;
const {urlCfg} = Configs;
const resultInfoArr = [
    {label: '质量问题', value: 1},
    {label: '商品与描述不符', value: 2},
    {label: '误购（不喜欢/大小不合适）', value: 3},
    {label: '卖家发错货', value: 4},
    {label: '其他', value: 5}
];
class JDService extends BaseComponent {
    state = {
        applyTitle: '请选择',
        addressArr: {}, //地址信息
        logistArr: [], //物流集合
        bowOnfo: false, //原因选择弹框
        imgFiles: [], //图片集合
        resultValue: {}, //退款原因
        applyNum: 0, //申请数量
        qusetDecrie: '', //问题描述
        packArr: [
            {
                title: '是',
                click: true
            }, {
                title: '否',
                click: false
            }
        ], // 是否包装数据
        describeArr: [
            {
                title: '无包装',
                click: false
            },
            {
                title: '包装完整',
                click: false
            },
            {
                title: '包装破损',
                click: false
            }
        ], //包装描述
        pickArr: [
            {
                title: '上门取件',
                click: false
            }, {
                title: '客户发货',
                click: false
            }
        ] //取件信息
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


    //  省市县的赋值
    setProvince = str => {
        const {addressArr} = this.state;
        addressArr.province_id = str;
        addressArr.city_id = '';
        addressArr.county_id = '';
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  市辖区赋值
    setCity = str => {
        const {addressArr} = this.state;
        addressArr.city_id = str;
        addressArr.county_id = '';
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  城市赋值
    setCounty = str => {
        const {addressArr} = this.state;
        addressArr.county_id = str;
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  街道赋值
    setStreet = str => {
        const {addressArr} = this.state;
        addressArr.town_id = str;
        this.setState({
            addressArr
        });
    };

    //单选事件
    changeRaio = (id, num, arr) => {
        arr.forEach(item => { item.click = false });
        const arrNew = arr.map((item, index) => {
            if (index === num) {
                item.click = true;
            }
            return item;
        });
        let obj = {};
        if (id === 1) {
            obj = {
                packArr: arrNew
            };
        } else if (id === 2) {
            obj = {
                describeArr: arrNew
            };
        } else {
            obj = {
                pickArr: arrNew
            };
        }
        this.setState(obj);
    }

    //控制退款原因弹框
    canStateChange = (data, value) => {
        this.setState({
            bowOnfo: false,
            resultValue: value
        });
    }

    //图片选择
    onImgChange = (file) => {
        this.setState({
            imgFiles: file
        });
    }

    render() {
        const {packArr, describeArr, pickArr, bowOnfo, resultValue, imgFiles, applyNum, qusetDecrie} = this.state;
        console.log(resultValue, '扣篮大赛');
        return (
            <div data-component="JDSerivce" data-role="page" className="JDSerivce">
                <AppNavBar title="申请退货/退款"/>
                <div className="main-top">
                    <div className="shop-info">
                        <img src="../../../../../../assets/images/Lazy-loading.png"/>
                        <p>就地方克里斯个就考虑对方估计快了叫你看了估计快了纳斯达克分类江南时代咖啡机克里斯丁减肥</p>
                    </div>
                    <div className="apply-info">
                        <div className="apply" onClick={() => { this.setState({bowOnfo: true}) }}>
                            <p><span>*</span>申请原因</p>
                            <input placeholder="请选择申请原因" disabled value={resultValue.label}/>
                            <div className="icon inp"/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>商品数量</p>
                            <input placeholder="请输入商品数量" type="number" value={applyNum} onChange={(data) => { this.setState({applyNum: data.target.value}) }}/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>问题描述</p>
                            <input placeholder="请填写您要描述的内容" value={qusetDecrie} onChange={(data) => { this.setState({qusetDecrie: data.target.value}) }}/>
                        </div>
                        {
                            process.env.NATIVE ? (
                                <div className="apply-img">
                                    <div><span>+</span></div>
                                    <p>请添加图片</p>
                                </div>
                            ) : (
                                <ImagePicker
                                    files={imgFiles}
                                    onChange={this.onImgChange}
                                    selectable={imgFiles.length < 9}
                                    multiple
                                    onAddImageClick={(data, value) => true}
                                />
                            )
                        }

                        <div className="apply-money">
                            <span className="info-left">退款金额：</span>
                            <span className="info-right">￥324354</span>
                        </div>
                    </div>
                </div>
                <div className="main-center">
                    <div className="center-info">
                        <p><span>*</span>是否有包装</p>
                        {
                            packArr.map((item, index) => (
                                <div key={item.title} className="choise" onClick={() => this.changeRaio(1, index, packArr)}>
                                    <i className={'icon hook' + (item.click ? ' active' : '')}/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="center-info">
                        <p><span>*</span>包装描述</p>
                        {
                            describeArr.map((item, index) => (
                                <div key={item.title} className="choise" onClick={() => this.changeRaio(2, index, describeArr)}>
                                    <i className={'icon hook' + (item.click ? ' active' : '')}/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="center-info">
                        <p><span>*</span>取件方式</p>
                        {
                            pickArr.map((item, index) => (
                                <div key={item.title} className="choise" onClick={() => this.changeRaio(3, index, pickArr)}>
                                    <i className={'icon hook' + (item.click ? ' active' : '')}/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="pick-info">
                        <p><span>*</span>取件信息</p>
                        <input placeholder="请输入联系人姓名"/>
                        <input placeholder="请输入联系人电话"/>
                        <div className="region-style">
                            <Region
                                onSetProvince={this.setProvince}
                                onSetCity={this.setCity}
                                onSetCounty={this.setCounty}
                                onSetStreet={this.setStreet}
                                add
                                typeFour
                                textAlign="left"
                            />
                            <div className="icon inp"/>
                        </div>
                        <input placeholder="请输入详细地址"/>
                    </div>
                    {
                        bowOnfo && <CancelOrder propsData={resultInfoArr} canStateChange={this.canStateChange}/>
                    }
                </div>
                <Button className="sub-btn">提交</Button>
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
