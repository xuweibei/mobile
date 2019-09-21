/*
* 首页tab栏列表
* */
import {ListView, Tabs} from 'antd-mobile';
import {scrollSpy} from 'react-scroll';
import './homeList.less';

const {appHistory, showInfo, systemApi: {getValue, setValue}} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;

export default class HomeList extends BaseComponent {
    constructor(props) {
        super(props);
        this.goodsData = []; //数据堆，暂存客户列表
        this.exemptionData = []; //包邮商品
        this.hotShopData = []; //星级商店数据
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.exemptionDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }); //包邮商品
        this.hotShopDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }); //星级商店
    }

    state = {
        hotGoods: [],
        latitude: '',
        longitude: '',
        recommendShop: [],
        exemption: [], //包邮商品
        hotShops: [], //星级商店
        goodsPage: 1, //热销page页
        exPage: 1, //包邮page页
        shopPage: 1, //热门店铺page页
        useBodyScroll: true,
        currentIndex: 0,
        tabStatus: false,
        tabTop: 0,
        goodsPageCount: -1,
        exPageCount: -1,
        shopPageCount: -1
    }

    componentDidMount() {
        const local = JSON.parse(getValue('local'));
        scrollSpy.mount(document);
        scrollSpy.addSpyHandler(this.handleScroll, document);
        scrollSpy.update();
        this.getGoodsList();
        if (!local) {
            this.getLocation();
        } else {
            this.setState({
                longitude: local.lon,
                latitude: local.lat
            });
        }
        this.getExGoodsList();
        // this.getHotShops();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        scrollSpy.unmount();
    }

    //网页滚动
    handleScroll=(e) => {
        const tabTop = this.tabsList.offsetTop;
        if (e > tabTop) {
            this.setState({
                tabStatus: true
            });
        } else {
            this.setState({
                tabStatus: false
            });
        }
    };

    //获取位置
    getLocation = () => {
        if (window.isWX) {
            console.log('微信环境');
            window.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: (res) => {
                    this.setState({
                        latitude: res.latitude,
                        longitude: res.longitude
                    });
                    setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                }
            });
        } else {
            const geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition((res) => {
                setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                this.setState({
                    latitude: res.latitude,
                    longitude: res.longitude
                }, () => {
                    const {latitude, longitude} = this.state;
                    if (latitude && longitude) {
                        this.getHotShops();
                    } else {
                        showInfo(Form.Feedback.Address_Err);
                    }
                });
            });
        }
    };

    //获取商品列表
    getGoodsList = (page) => {
        this.fetch(urlCfg.getGoods, {
            data: {
                type: 1,
                select: 0,
                page: page || 1,
                pagesize: 4
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (this.state.goodsPage >= res.page_count) {
                    showInfo(Form.Not_More_Goods, 1);
                } else {
                    this.goodsData = this.goodsData.concat(res.data);
                    this.setState(prevState => ({
                        hotGoods: this.goodsData,
                        goodsPage: prevState.goodsPage + 1,
                        goodsPageCount: res.page_count
                    }));
                }
            }
        });
    };

    //获取包郵商品列表
    getExGoodsList = (page) => {
        this.fetch(urlCfg.getGoods, {
            data: {
                type: 1,
                select: 1,
                page: page || 1,
                pagesize: 4
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (this.state.exPage >= res.page_count) {
                    showInfo(Form.Not_More_Goods, 1);
                } else {
                    this.exemptionData = this.exemptionData.concat(res.data);
                    this.setState(prevState => ({
                        exemption: this.exemptionData,
                        exPage: prevState.exPage + 1,
                        exPageCount: res.page_count
                    }));
                }
            }
        });
    };

    //获取首页商店
    getHotShops = (page) => {
        const {latitude, longitude} = this.state;
        this.fetch(urlCfg.getHomeShops, {
            data: {
                type: 2,
                page: page || 1,
                pagesize: 4,
                latitude: latitude,
                longitude: longitude
            }
        }).subscribe(res => {
            this.hotShopData = this.hotShopData.concat(res.data);
            if (res && res.status === 0) {
                if (this.state.shopPage >= res.page_count) {
                    showInfo(Form.Not_More_Shops, 1);
                } else {
                    this.setState(prevState => ({
                        hotShops: this.hotShopData,
                        shopPage: prevState.shopPage + 1,
                        shopPageCount: res.page_count
                    }));
                }
            }
        });
    };

    //tab选项卡点击切换
    tabClick = (tab, index) => {
        this[`listViewCon${index}`] && this[`listViewCon${index}`].scrollTo(0, this.tabsList.offsetTop); // 切换标签的时候滚动回滚到标签顶部
        this.setState({
            currentIndex: index
        });
        if (index === 1) {
            const {exPage, exPageCount} = this.state;
            if (exPage === exPageCount) {
                return;
            }
            this.getExGoodsList(exPage);
        } else if (index === 2) {
            const {shopPage, shopPageCount} = this.state;
            if (shopPage === shopPageCount) {
                return;
            }
            this.getHotShops(shopPage);
        } else {
            const {goodsPage, goodsPageCount} = this.state;
            console.log(goodsPage, goodsPageCount);
            if (goodsPage === goodsPageCount) {
                return;
            }
            this.getGoodsList(goodsPage);
        }
    };

     // FIXME: 上拉加载更多逻辑要优化 完成
     //热销商品上拉加载
     goodReached = () => {
         const {currentIndex} = this.state;
         if (currentIndex === 0) {
             this.setState(prevState => ({
                 goodsPage: prevState.goodsPage + 1
             }), () => {
                 const {goodsPage} = this.state;
                 this.getGoodsList(goodsPage);
             });
         }
     };

    //包邮商品上拉加载
    exReached = () => {
        const {currentIndex} = this.state;
        if (currentIndex === 1) {
            const {exPage} = this.state;
            this.getExGoodsList(exPage);
        }
    };

    //星店上拉加载
    hotShopReached = () => {
        const {currentIndex} = this.state;
        if (currentIndex === 2) {
            const {shopPage, latitude, longitude} = this.state;
            if (latitude && longitude) {
                this.getHotShops(shopPage);
            }
        }
    };

    //星星评价
    renderStar = (num) => {
        const slot = num.split('.')[1];
        const value = Number(num);
        const arr = [];
        for (let i = 0; i < Math.floor(value); i++) {
            const star = <div className="icon icon-star"/>;
            arr.push(star);
        }
        if (slot >= 5) {
            const stars = <div className="icon icon-ban"/>;
            arr.push(stars);
        }
        return arr;
    };

    goCate = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    goShopHome = (id, lat, lon) => {
        appHistory.push(`/shopHome?id=${id}&lat=${lat}&lon=${lon}`);
    };

    render() {
        const tabs = [
            {title: '热销'},
            {title: '包邮'},
            {title: '星店'}
        ];
        const hotGoodsRow = item => (
            <div className="hot" key={item.rs_id} onClick={(e) => this.goCate(item.rs_id)}>
                <img src={item.picpath} alt={item.title}/>
                <div className="hot-content">
                    <p>{item.title}</p>
                    <span className="tally">记账量：{item.deposit}</span>
                    <div className="original">￥{item.price_ori}</div>
                    <div className="current">
                        <span>￥<span>{item.price}</span></span>
                        <span>
                            <span>{item.num_sold}</span>
                            <span>人付款</span>
                        </span>
                    </div>
                </div>
            </div>
        );
        const ex = (item, index) => (
            <div className="hot" key={index.toString()} onClick={(e) => this.goCate(item.rs_id, item)}>
                <img src={item.picpath} alt=""/>
                <div className="hot-content">
                    <p>{item.title}</p>
                    <span className="tally">记账量：{item.deposit}</span>
                    <div className="original">￥{item.price_ori}</div>
                    <div className="current">
                        <span>￥<span>{item.price}</span></span>
                        <span>
                            <span>{item.num_sold}</span>
                            <span>人付款</span>
                        </span>
                    </div>
                </div>
            </div>
        );
        const shopData = item => (
            <div className="store-items" key={item.id} onClick={() => this.goShopHome(item.id, item.latitude, item.longitude)}>
                <div className="details">
                    <img src={item.picpath} alt=""/>
                    <div className="details-bottom">
                        <p>{item.shopName}</p >
                        <div className="star-consume">
                            <div key={item.shop_mark}>
                                {this.renderStar(item.shop_mark)}
                            </div>
                            <div key={item.consume_per}>人均￥{item.consume_per}</div>
                        </div>
                        <div className="time-distance ">
                            <span>营业时间{item.open_time}-{item.close_time}</span>
                        </div>
                        <div className="place">
                            <span>{item.address}</span>
                            <span>{item.distance}km</span>
                        </div>
                    </div>
                </div>
            </div>
        );
        const {hotGoods, exemption, hotShops, useBodyScroll, tabStatus} = this.state;
        return (
            <div ref={ref => { this.tabsList = ref }} className={`tabs-list ${tabStatus ? 'fiexd-tabs' : ''}`}>
                <Tabs
                    tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => this.tabClick(tab, index)}
                >
                    <ListView
                        ref={ref => { this[`listViewCon${0}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(hotGoods)}
                        initialListSize={4}
                        renderRow={hotGoodsRow}
                        useBodyScroll={useBodyScroll}
                        onEndReachedThreshold={50}
                        onEndReached={this.goodReached}
                    />
                    <ListView
                        ref={ref => { this[`listViewCon${1}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(exemption)}
                        initialListSize={4}
                        renderRow={ex}
                        useBodyScroll={useBodyScroll}
                        onEndReachedThreshold={50}
                        onEndReached={this.exReached}
                    />
                    <ListView
                        ref={ref => { this[`listViewCon${2}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(hotShops)}
                        initialListSize={4}
                        renderRow={shopData}
                        useBodyScroll={useBodyScroll}
                        onEndReachedThreshold={50}
                        onEndReached={this.hotShopReached}
                    />
                </Tabs>
            </div>
        );
    }
}
