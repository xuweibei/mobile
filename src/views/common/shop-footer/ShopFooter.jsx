/*
* 店铺底部TAB栏
* */
import PropTypes from 'prop-types';
import {TabBar} from 'antd-mobile';
import './ShopFooter.less';

const hybrid = process.env.NATIVE;


class ShopFooter extends React.PureComponent {
    static propTypes = {
        active: PropTypes.string.isRequired,
        onTabChange: PropTypes.func.isRequired,
        haveModalAll: PropTypes.bool.isRequired
    };

    state = {
        selectedTab: this.props.active,
        haveModalAll: this.props.haveModalAll //判断该店铺是否有模板，没有的话，就不显示店铺模板信息
    };

    componentWillReceiveProps(nextProps) {
        if (hybrid) {
            const haveNext = nextProps.haveModalAll;
            const have = this.props.haveModalAll;
            if (haveNext !== have) {
                this.setState({
                    haveModalAll: haveNext
                });
            }
        }
    }

    gotoPage = (path) => {
        this.props.onTabChange(path);
        // this.context.store.dispatch(replace(`/${path}`));
        this.setState({
            selectedTab: path
        });
    }

    //底部tab按钮
    dataList = () => {
        const {haveModalAll, selectedTab} = this.state;
        const arr = [
            {
                title: '店铺首页',
                key: 'home',
                icon: <span className="icon bar-icon home-icon"/>,
                selectedIcon: <span className="icon bar-icon home-icon-active"/>,
                selected: selectedTab === 'shopHome',
                onPress: this.gotoPage.bind(this, 'shopHome')
            },
            {
                title: '全部商品',
                key: 'category',
                icon: <span className="icon bar-icon share-icon"/>,
                selectedIcon: <span className="icon bar-icon share-icon-active"/>,
                selected: selectedTab === 'category',
                onPress: this.gotoPage.bind(this, 'category')
            },
            {
                title: '商家信息',
                key: 'find',
                icon: <span className="icon bar-icon find-icon"/>,
                selectedIcon: <span className="icon bar-icon find-icon-active"/>,
                selected: selectedTab === 'find',
                onPress: this.gotoPage.bind(this, 'find')
            },
            {
                title: '联系商家',
                key: 'im',
                icon: <span className="icon bar-icon im-icon"/>,
                selectedIcon: <span className="icon bar-icon im-icon-active"/>,
                selected: selectedTab === 'im',
                onPress: this.gotoPage.bind(this, 'im')
            }
        ];
        if (!haveModalAll) { //false表示没有模板
            arr.splice(0, 1);
        }
        return arr;
    }

    render() {
        return (
            <div className="footer-bar">
                <TabBar
                    unselectedTintColor="#595959"
                    tintColor="@darker-black"
                    barTintColor="white"
                    hidden={false}
                    tabBarPosition="bottom"
                >
                    {
                        this.dataList().map(item => (
                            <TabBar.Item
                                title={item.title}
                                key={item.key}
                                icon={item.icon}
                                selectedIcon={item.selectedIcon}
                                selected={item.selected}
                                onPress={item.onPress}
                            />
                        ))
                    }
                </TabBar>
            </div>
        );
    }
}

export {ShopFooter};
