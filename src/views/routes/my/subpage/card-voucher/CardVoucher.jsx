//卡券包页面  2020.3.11
import {Tabs, ListView} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import './CardVoucher.less';

const {navColorR} = Constants;
const tabsData = [
    {title: '待领取'},
    {title: '未使用'},
    {title: '已使用'},
    {title: '已过期'}
];


const mokeDate = [
    {money: '1', arrive: '3', time: '2019-12-03至2023-12-03', state: '新到'},
    {money: '234', arrive: '45634', time: '2010-12-03至2063-12-03', state: '将过期'},
    {money: '89', arrive: '5464', time: '2019-16-03至2023-92-03', state: '新到'}
];
export default class CardVoucher extends BaseComponent {
    state={
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }), //长列表容器
        tabsKey: 0,
        height: document.documentElement.clientHeight - (window.isWX ?  window.rem * 1.08 : window.rem * 1.78)
    }

    tabChange = (data, index) => {
        this.setState({
            tabsKey: index
        });
    }


    render() {
        const {tabsKey, dataSource, height} = this.state;
        const row = item => (
            <div className="card-view">
                <div className="card-money">
                    <div>
                        ￥5
                    </div>
                </div>
                <div className="card-main">
                    <p>全站满10使用</p>
                    <p>限实物商品</p>
                    <span>有效期至：</span>
                    <p>2016-2019</p>
                    <span className="card-use">使用</span>
                    <span className="card-status">新到</span>
                </div>
            </div>
        );
        const data = dataSource.cloneWithRows(mokeDate);
        return (
            <div className="card-wrap">
                <AppNavBar title="我的优惠券" backgroundColor={navColorR} redBackground rightShow show/>
                <div className="tabs-card">
                    <Tabs
                        tabs={tabsData}
                        page={tabsKey}
                        onChange={this.tabChange}
                        swipeable={false}
                    >
                        <div className="card-list">
                            <ListView
                                // initialListSize={3}
                                dataSource={data}
                                renderRow={row}
                                style={{
                                    height
                                }}
                            />
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    }
}