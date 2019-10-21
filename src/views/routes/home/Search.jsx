/**
 * @desc 搜索页面
 */
import {InputItem, Button, Icon} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import './Search.less';
import {getUrlParam} from '../../../utils/mixin';

const {urlCfg} = Configs;
const {appHistory, native, TD} = Utils;
const {TD_EVENT_ID} = Constants;
const hybird = process.env.NATIVE;

class Search extends BaseComponent {
    state = {
        hot: null,
        history: null,
        textStatus: false,
        keywords: '' //搜索框搜索内容
    }

    componentDidMount() {
        const shopSearch = decodeURI(getUrlParam('shopSearch', encodeURI(this.props.location.search)));
        if (shopSearch === 'null') { //如果是非店铺跳过来，则将店铺id清除
            this.props.setshoppingId('');
        }
        this.searchList();
    }

    componentWillMount() {
        dropByCacheKey('CategoryListPage');
    }

    componentWillReceiveProps() {
        const shopSearch = decodeURI(getUrlParam('shopSearch', encodeURI(this.props.location.search)));
        if (shopSearch === 'null') { //如果是非店铺跳过来，则将店铺id清除
            this.props.setshoppingId('');
        }
    }

    //搜索框类型跳转 false返回上级 true 进行搜索跳转
    searchType = () => {
        const {textStatus, keywords} = this.state;
        TD.log(TD_EVENT_ID.SEEK.ID, TD_EVENT_ID.SEEK.LABEL.SEEK_STUFF);
        if (textStatus) {
            if (keywords.length === 0) {
                this.setState({
                    textStatus: false
                });
            } else {
                appHistory.push(`/categoryList?flag=${true}&keywords=${encodeURI(keywords)}&id=${''}`);
            }
        } else if (hybird && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    };

    //获取热门搜索,历史搜索
    searchList = () => {
        this.fetch(urlCfg.homeSearch)
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            hot: res.hot,
                            history: res.history
                        });
                    }
                }
            });
    };

    //热门搜索和历史搜索跳转
    switchTo = (val) => {
        appHistory.push(`/categoryList?flag=${true}&keywords=${encodeURI(val)}&id=${''}`);
    };

    //获取输入框文字
    getKeyWords = (val) => {
        if (val.length !== 0) {
            this.setState({
                keywords: val,
                textStatus: true
            });
        } else {
            this.setState({
                textStatus: false
            });
        }
    };

    render() {
        const {hot, history, textStatus} = this.state;
        return (
            <div data-component="search" data-role="page" className="search">
                <div className="search-box">
                    <InputItem
                        type="search"
                        placeholder="请输入商品名称"
                        clear
                        onKeyPress={this.searchType}
                        onChange={(val) => this.getKeyWords(val)}
                    >
                        <Icon type="search"/>
                    </InputItem>
                    <div
                        className="search-cancel"
                        onClick={this.searchType}
                    >{textStatus ? '搜索' : '取消'}
                    </div>
                </div>
                <div className="search-popular aroundBlank">
                    <div className="search-title">热门搜索</div>
                    <div className="search-popular-content">
                        {
                            hot && hot.map((item, index) => (
                                <Button
                                    className="auxiliary-button red"
                                    activeStyle={false}
                                    onClick={() => this.switchTo(item.keyword)}
                                    key={index.toString()}
                                >{item.keyword}
                                </Button>
                            ))
                        }
                    </div>
                </div>
                <div className="search-popular aroundBlank">
                    <div className="search-title">历史搜索</div>
                    <div className="search-popular-content">
                        {
                            history && history.map((item, index) => (
                                <Button
                                    className="auxiliary-button gray"
                                    activeStyle={false}
                                    key={index.toString()}
                                    onClick={() => this.switchTo(item.keyword)}
                                >{item.keyword}
                                </Button>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        shoppingId: base.get('shoppingId')
    };
};

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
