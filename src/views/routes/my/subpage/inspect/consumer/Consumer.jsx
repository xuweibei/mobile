/* 消费者核销页面*/

import {connect} from 'react-redux';
import {myActionCreator} from '../../../actions/index';
import './Consumer.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {appHistory, getUrlParam, native, setNavColor} = Utils;
const {navColorF} = Constants;
const hybrid = process.env.NATIVE;
class Consumer extends BaseComponent {
    state = {
        list: {},
        order: [],
        val: ''
    }

    componentWillMount() {
        const val = decodeURI(getUrlParam('val', encodeURI(this.props.location.search)));
        this.setState({
            val
        });
        if (hybrid) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybrid) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentDidMount() {
        this.orderInfo();
    }

    //获取订单信息
    orderInfo = () => {
        const {val} = this.state;
        this.fetch(urlCfg.whiteShop, {data: {
            white_off: val
        }}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    list: res.data,
                    order: res.data.pr_list
                });
            }
        });
    }

    //确认核销订单
    sure = () => {
        const {val, list} = this.state;
        this.fetch(urlCfg.sureWhiteShop, {data: {
            order_id: list.id,
            type: 2,
            white_off: val
        }}).subscribe(res => {
            if (res && res.status === 0) {
                const {setOrder} = this.props;
                setOrder(res.data);
                appHistory.replace('/success-file');
            }
        });
    }

    goBackModal = () => {
        if (hybrid && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {list, order} = this.state;
        return (
            <div className="consumer">
                <AppNavBar title="确认核销" goBackModal={this.goBackModal}/>
                <div className="picture">
                    <img src={list.avatarUrl} alt=""/>
                    <span>{list.nickname}</span>
                </div>
                <div className="indent-box">
                    <div className="indent">
                        <div>
                            <div className="serial">
                                <span>订单编号：{list.order_no}</span>
                            </div>
                            {list.affective_type === '1' ? (
                                <div className="serial">使用时间：长期有效</div>
                            ) : (
                                <div className="serial">使用时间：{list.white_start_time + ' - ' + list.white_end_time}</div>
                            )}
                            {
                                order.map(item => (
                                    <div className="content" key={item.pr_id}>
                                        <img src={item.pr_picpath} alt=""/>
                                        <div className="content-right">
                                            <div className="value">
                                                <span>{item.pr_title}</span>
                                                <span>￥{item.price}</span>
                                            </div>
                                            <div className="specification">
                                                <span>{item.property_content[0]}</span>
                                                <span>{item.property_content[1]}</span>
                                                <span>规格</span>
                                            </div>
                                            <div className="accounts">
                                                <span>记账量：{item.deposit}</span>
                                                <span>x{item.num}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className="altogether">总记账量：<span>{list.all_deposit}</span></p>
                        <p className="total">
                            <span>共{list.pr_count}件商品</span>
                            <span>合计：<span>￥{list.all_price}</span></span>
                        </p>
                    </div>
                </div>
                <div className="pushbutton">
                    <div onClick={this.sure}>确认核销</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const my = state.get('my');

    return {
        verification: my.get('verification')
    };
};

const mapDispatchToProps = {
    setOrder: myActionCreator.setOrdersInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Consumer);
