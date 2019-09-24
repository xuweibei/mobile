

/**月结预算*/

import {Button, ListView} from 'antd-mobile';
import Income from '../single-page/income';
import Myincome from '../single-page/myincone';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Detailpage from '../single-page/detailpage';
import {ListFooter} from '../../../../../common/list-footer';
import './ProjectedMounth.less';


const {urlCfg} = Configs;
const {getUrlParam} = Utils;

const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 5
};

export default class MyAssets extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.state = {
            dataSource,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 6.18 : window.rem * 6.3),
            statusNum: decodeURI(getUrlParam('status', encodeURI(this.props.location.search))),
            editModal: '', //当前状态
            todayArr: [], //我的收入的数据
            userInfo: {},
            page: 1,
            pageCount: -1,
            hasMore: false //底部加载状态
        };
    }

    componentDidMount() {
        this.getDaril();
        this.getEveryData();
    }

    //当天收入
    getDaril = () => {
        temp.isLoading = true;
        const {page} = this.state;
        this.fetch(urlCfg.dailyIncome, {
            method: 'post',
            data: {
                page: page,
                page_count: 100000,
                types: 1
            }})
            .subscribe(res => {
                temp.isLoading = false;
                if (res.status === 0) {
                    this.setState({
                        userInfo: res.data,
                        todayArr: res.data.today_data
                    });
                }
            });
    }

    //每一天的收入
    getEveryData = () => {
        temp.isLoading = true;
        const {page, date} = this.state;
        this.setState({
            hasMore: true
        }, () => {
            this.fetch(urlCfg.dailyIncomeAll, {
                method: 'post',
                data: {
                    page: page,
                    pagesize: temp.pagesize,
                    page_count: 5,
                    types: 1,
                    date: date
                }})
                .subscribe(res => {
                    temp.isLoading = false;
                    this.setState({
                        hasMore: false
                    });
                    if (res.status === 0) {
                        if (res.data) {
                            if (page === 1) {
                                temp.stackData = res.data.other_list;
                            } else {
                                temp.stackData = temp.stackData.concat(res.data.other_list);
                            }
                            if (page >= res.data.page_count) {
                                this.setState({
                                    hasMore: false
                                });
                            }
                            this.setState((prevState) => ({
                                dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                                pageCount: res.data.page_count,
                                date: res.data.date
                            }));
                        }
                    }
                });
        });
    }

    //上拉加载
    onEndReached = () => {
        const {page, pageCount} = this.state;
        if (temp.isLoading) return;
        if (page >= pageCount) {
            //加载完成
            this.setState({hasMore: false});
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getEveryData();
            });
        }
    };

    //子页面返回的回调
    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    };

    //单笔收入详情回调
    detailedPage = (data) => {
        this.setState({
            editModal: 'detail',
            currentData: data
        });
    };

    //每日收入页面回调
    myincomeJump = (data) => {
        this.setState({
            editModal: 'myIncome',
            currentData: data
        });
    };

    //金额前的正负号
    paySymbol = (value) => {
        if (value === '1') {
            return '+';
        } if (value === '0') {
            return '-';
        }
        return '';
    };

    //底部结构
    defaultModel = (row) => {
        const {todayArr, exceed, dataSource, height, userInfo, hasMore} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash-mounth">
                <div className="cash-content">
                    {
                        window.isWX ? (
                            <AppNavBar
                                title="月结预算"
                            />
                        ) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    goBackModal={this.props.getBackChange}
                                    title="月结预算"
                                    rightShow
                                />
                            </div>
                        )
                    }
                    <div className="cash-content-tabs">
                        <img src={require('../../../../../../assets/images/banner.png')}/>
                    </div>
                    <div className="altogether">
                        <div className="altogether-name a-equally">
                            <span>{userInfo.realname}</span>
                            {/* <span>今日订单 共{userInfo.num}笔</span> */}
                        </div>
                        <div className="altogether-UID a-equally">
                            <span>UID:{userInfo.no}</span>
                            <div><span className="price">{userInfo.total_price}</span><span>元</span></div>
                        </div>
                    </div>
                    <div className="asset-info-wrap">
                        {((todayArr.length > 0 && !exceed) ?  (
                            <div>
                                {todayArr.map(item =>  (
                                    <div>
                                        <div className="asset-info unde-line">
                                            <p><span>{item.desc}</span><span>{this.paySymbol(item.types) }{item.scalar}</span></p>
                                            <p><span>{item.crtdate}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : '')}
                        {((todayArr.length > 0 && todayArr.length > 6 && exceed) ?  (
                            <div>
                                {todayArr.map((item, index) => {
                                    if (index < 6) {
                                        return  (
                                            // <div onClick={() => this.detailedPage(item)}>
                                            <div>
                                                <div className="asset-info unde-line">
                                                    <p><span>{item.desc}</span><span>{this.paySymbol(item.types) }{item.scalar}</span></p>
                                                    <p><span>{item.crtdate}</span></p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return '';
                                })}
                                <Button className="see-more" onClick={() => this.setState({exceed: true})}>查看更多</Button>
                                <p className="explain">预估收入将于每月25号起结算至CAM，以结算金额为准。您可以前往CAM余额进行提现</p>

                            </div>
                        ) : '')}
                        {/* <div className="other-day"> */}
                        {/* </div> */}
                        {
                            dataSource.getRowCount() > 0 ? (
                                <ListView
                                    dataSource={dataSource}
                                    initialListSize={temp.pagesize}
                                    // renderBodyComponent={() => <ListBody/>}
                                    renderRow={row}
                                    style={{
                                        height: height
                                    }}
                                    pageSize={temp.pagesize}
                                    onEndReachedThreshold={10}
                                    onEndReached={this.onEndReached}
                                    renderFooter={() => ListFooter(hasMore)}
                                />
                            ) : ''
                        }
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }

    render() {
        const {editModal} = this.state;
        const row = item => (
            <div onClick={() => this.myincomeJump(item)}>
                <div className="asset-info unde-line">
                    <p><span>{item.crtdate}</span><p className="total-money icon"><i className="small">￥</i><span className="total-num">{item.total_price}</span></p></p>
                </div>
            </div>
        );
        return (
            <React.Fragment>
                {editModal === 'myIncome' && <Myincome getBackChange={this.getBackChange} {...this.state} noClick/>}
                {editModal === 'detail' && <Detailpage getBackChange={this.getBackChange} {...this.state}/>}
                {editModal === 'income' && <Income getBackChange={this.getBackChange}/>}
                {!editModal && this.defaultModel(row)}
            </React.Fragment>
        );
    }
}
