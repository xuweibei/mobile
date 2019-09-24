/**
 * 分类页面---商品列表，商品搜索列表页
 */
import {InputItem} from 'antd-mobile';
import classNames from 'classnames';
import {connect} from 'react-redux';
import AppNavBar from '../../../../common/navbar/NavBar';
import CategoryListView from './CategoryListView';
import './CategoryList.less';


const {appHistory, getUrlParam, native, TD} = Utils;
const {TD_EVENT_ID} = Constants;

class CategoryList extends BaseComponent {
    state = {
        Header: false,
        showPopup: false,
        text: 'text',
        flag: false,
        page: 1, //当前页数
        currentIndex: null,
        changeNav: 'false', //顶部当行状态
        keywords: '', //搜索关键字
        pageCount: 0, //总共页数
        pulldownMsg: '',
        keywords1: '',
        textStatus: false,
        shopId: parseInt(getUrlParam('id', this.props.location.search), 10) || ''
    };

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps, value) { //路由跳转时的判断，id有变化就请求
        if (this.state.shopId !== decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)))) {
            this.setState({
<<<<<<< HEAD
                shopId: decodeURI(getUrlParam('id', encodeURI(nextProps.location.search))) || ''
=======
                shopId: decodeURI(getUrlParam('id', encodeURI(nextProps.location.search))) === 'null' ? '' : decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)))
>>>>>>> ee796d265e4d87399ff1a300a01aacf21f4ca536
            }, () => {
                this.init();
            });
        }
    }

    init = () => {
        const title = decodeURI(getUrlParam('title', encodeURI(this.props.location.search)));
        const flag = decodeURI(getUrlParam('flag', encodeURI(this.props.location.search)));
        const keywords = decodeURI(getUrlParam('keywords', encodeURI(this.props.location.search)));
        TD.log(TD_EVENT_ID.GOODS_CLASSIFY.ID, TD_EVENT_ID.GOODS_CLASSIFY.LABEL.LOOK_GOODS_DETAILS);
        this.setState({
            keywords: decodeURI(keywords),
            changeNav: flag,
            text: decodeURI(title)
        });
    }

    //当前页面关键字搜索
    searchGoods = () => {
        const {keywords, keywords1} = this.state;
        if (keywords !== keywords1) {
            return;
        }
        this.child.getCategoryList();
    };

    //获取当前页面搜索框的keywords
    getThisKeyWords = (val) => {
        if (val && val.length > 0) {
            this.setState({
                textStatus: true
            });
        }
        if (val.length === 0) {
            this.setState({
                textStatus: false
            });
        }
        this.setState({
            keywords: val,
            keywords1: val
        });
    };

    //返回上一級
    routeTo = () => {
        appHistory.goBack();
    };

    //父组件传子组件方法
    onRef = (ref) => {
        this.child = ref;
    };

    //右侧搜索文字点击
    textClick = () => {
        const {textStatus} = this.state;
        TD.log(TD_EVENT_ID.SEEK.ID, TD_EVENT_ID.SEEK.LABEL.SEEK_STUFF);
        if (textStatus) {
            this.searchGoods();
        } else {
            this.routeTo();
        }
    };

    /*goToShop = () => {
        appHistory.push({pathname: '/shopHomeIndexOne'});
    };*/

    goBackModal = () => {
        const hybird = process.env.NATIVE;
        if (hybird && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    };

    render() {
        const {text, changeNav, textStatus, shopId} = this.state;
        return (
            <div
                data-component="classify-list"
                data-role="page"
                className={classNames('classify-list',
                    {WX: window.isWX})}
            >
                {
                    changeNav === 'true' ? (
                        <div className="seek">
                            <div className="seek-left">
                                <InputItem
                                    type="text"
                                    clear
                                    maxLength={20}
                                    placeholder="搜索商品"
                                    onChange={(val) => this.getThisKeyWords(val)}
                                >
                                    <div className="icon icon-lookup"/>
                                </InputItem>
                            </div>
                            <div className="seek-right" onClick={this.textClick}>{textStatus ? '搜索' : '取消'}</div>
                        </div>
                    ) : (
                        <AppNavBar
                            title={text}
                            goBackModal={this.goBackModal}
                            // onClick={() => this.routeTo()}
                            status="123"
                        />
                    )
                }
                <CategoryListView
                    id={shopId}
                    that={this}
                    onRef={this.onRef}
                    keywords={this.state.keywords}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const routing = state.get('routing');
    const base = state.get('base');
    return {
        locationState: routing.get('locationState'),
        shoppingId: base.get('shoppingId')
    };
};


export default connect(mapStateToProps, null)(CategoryList);
