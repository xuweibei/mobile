/*
* 首页
* */
import {connect} from 'react-redux';
import {Carousel, Grid, SearchBar, Toast, WhiteSpace} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import {systemApi} from '../../../utils/systemApi';
import {FooterBar} from '../../common/foot-bar/FooterBar';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {myActionCreator as ActionCreator} from '../my/actions/index';
import HomeList from './home-list/homeList';
import './Home.less';


const {TD_EVENT_ID} = Constants;
const {urlCfg, appCfg} = Configs;
const {appHistory, TD} = Utils;

class Home extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        showPopup: false,
        category: [],
        mallBanner: [],
        userToken: '',
        pages: [],
        show: false,
        show1: false,
        goodStuff: [],
        navPic: ''
    };

    componentWillMount() {
        dropByCacheKey('CategoryListPage');
    }

    componentDidMount() {
        const {showMenu, setOrder} = this.props;
        TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_HOME);
        setOrder(null);
        showMenu(false);
        if (window.isWX) {
            this.login();
        }
        this.getMall();
        this.mallBanner();
        this.goodStuff();
        this.setState({
            userToken: systemApi.getValue('userToken')
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {showMenu} = this.props;
        showMenu(true);
    }

    // componentWillReceiveProps() {
    //     if (hybird) {
    //         setNavColor('setNavColor', {color: navColorR});
    //     }
    // }

    // 判断是否是登录状态 如果不是前往登录
    goToLogin = () => {
        const {userToken} = this.state;
        if (userToken && userToken.length > 0) {
            return;
        }
        appHistory.push('/login');
    };

    //微信跳转 跳转登陆
    login() {
        return this.fetch(urlCfg.login, {
            data: {
                token: appCfg.wxToken,
                code: this.props.code,
                type: 0
            }
        })
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        const {setUserToken} = this.props;
                        setUserToken(res.LoginSessionKey);
                    }
                }
            }, err => {
                Toast.info(err.message);
            });
    }

    //跳转分类列表
    goToCategory = (el, index) => {
        TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_MAIN_CLASSIFY);
        // console.log(TD);
        if (index === 9) {
            appHistory.push({pathname: '/category'});
        } else {
            appHistory.push({pathname: `/categoryList?id=${el.id}&title=${el.text}&keywords=${''}&flag=${false}`});
        }
    };

    //获取商品分类
    getMall = () => {
        this.fetch(urlCfg.homeGetCategoryOne)
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            category: res.data
                        });
                    }
                }
            }, err => {
                Toast.info(err.message);
            });
    };

    //获取商品轮播图
    mallBanner = () => {
        this.fetch(urlCfg.homeBanner)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        mallBanner: res.data,
                        navPic: res.home_pic.pic1
                    });
                }
            });
    };

    //有好货
    goodStuff = () => {
        this.fetch(urlCfg.getHomeGoods)
            .subscribe((res) => {
                if (res) {
                    TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_AREA);
                    if (res.status === 0) {
                        this.setState({
                            goodStuff: res.data
                        });
                    }
                }
            });
    }

    //扫一扫
    lookLook = () => {
        const {userToken} = this.state;
        if (userToken && userToken.length > 0 && !window.isWX) {
            return;
        }
        if (!userToken) {
            appHistory.push('/login');
        }
    };

    //跳转到搜索页面
    gotoSearch = () => {
        appHistory.push({pathname: '/search'});
    };

    // 跳转商品详情
    switchTo = (item) => {
        appHistory.push(`/goodsDetail?id=${item.id1}`);
    };

    //有推荐跳转
    jumpOther = (id, index, shopId) => {
        if (index === 0) {
            appHistory.push(`/shopHome?id=${id}`);
        } else {
            appHistory.push(`/goodsDetail?id=${id}&shopId${shopId}`);
        }
    }

    render() {
        const {mallBanner, userToken, category, goodStuff, navPic} = this.state;
        return (
            <div className="home">
                <div className="home-main">
                    <div className="home-content">
                        <div className="home-searchBar">
                            <div>
                                {
                                    window.isWX || (userToken && userToken.length > 0) ? null : (
                                        <div className="icon-right icon" onClick={this.goToLogin}/>
                                    )
                                }
                            </div>
                            <div className={`home-searchBar-fence ${userToken && userToken.length > 0 ? 'search-login' : ''}`} style={{color: '@white'}}>
                                <SearchBar
                                    placeholder="输入您要搜索的商品"
                                    showCancelButton
                                    cancelText=" "
                                    onFocus={this.gotoSearch}
                                />
                            </div>
                            {
                                userToken && userToken.length > 0 ? (
                                    <div className="home-searchBar-icon" onClick={this.lookLook}>
                                        <div className="icon unInformation"/>
                                    </div>
                                ) : (
                                    <div className="home-searchBar-icon" onClick={this.lookLook}>
                                        <div className="icon information"/>
                                    </div>
                                )
                            }
                        </div>
                        <WhiteSpace/>

                        <div className="home-banner">
                            <Carousel
                                infinite
                            >
                                {mallBanner.map((item, index) => (
                                    <div key={item}>
                                        <img
                                            src={item}
                                            className="banner-img"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <WhiteSpace size="xl"/>
                        <div className="home-nav">
                            <Grid
                                data={category && category.map((item, index) => ({icon: item.img_url, text: item.cate_name, id: item.id1}))}
                                activeStyle
                                columnNum={5}
                                square
                                hasLine={false}
                                onClick={(el, idx) => this.goToCategory(el, idx)}
                            />
                        </div>
                        <WhiteSpace/>
                        <div className="home-logo">
                            <img src={navPic} alt=""/>
                        </div>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <div className="recommend">
                            <div className="edge-style"/>
                            <ul>
                                {
                                    goodStuff && goodStuff.map((item, index) => (
                                        <li key={index.toString()}>
                                            <p className="list-title">{item.title}</p>
                                            <p className="list-desc">
                                                <span>{item.intro.split(' ')[0]}</span>
                                                <span>{item.intro.split(' ')[1]}</span>
                                            </p>
                                            <div className="img-box">
                                                {
                                                    item.data.map((value, i) => (
                                                        <div className="show-img" key={i.toString()} onClick={() => this.jumpOther(value.rs_id, index, value.rs_id)}>
                                                            <img src={value.picpath} alt=""/>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <HomeList/>
                </div>
                <FooterBar active="home"/>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        code: base.get('code')
    };
};

const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken,
    showMenu: actionCreator.showMenu,
    setOrder: ActionCreator.setOrderInformation
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
