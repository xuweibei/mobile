/*
* 底部Tab栏
* */
import {TabBar} from 'antd-mobile';
import PropTypes from 'prop-types';
import {IconFont} from '../icon-font/IconFont';
import './FooterBar.less';

const hybird = process.env.NATIVE;
const {appHistory} = Utils;

class FooterBar extends React.PureComponent {
    static propTypes = {
        active: PropTypes.string.isRequired
    };

    state = {
        selectedTab: this.props.active
    };

    gotoPage = (path) => {
        appHistory.replace(`/${path}`);
    };

    render() {
        return (
            <React.Fragment>
                {
                    hybird
                        ? null
                        : (
                            <div className="footer-bar">
                                <TabBar
                                    unselectedTintColor="#595959"
                                    tintColor="@darker-black"
                                    barTintColor="white"
                                    hidden={false}
                                    tabBarPosition="bottom"
                                >
                                    <TabBar.Item
                                        title="首页"
                                        key="home"
                                        icon={<IconFont iconText="iconbiaoqianlanshouye-"/>}
                                        selectedIcon={<IconFont iconText="iconbiaoqianlanshouye"/>}
                                        selected={this.state.selectedTab === 'home'}
                                        onPress={() => this.gotoPage('home')}
                                    />
                                    <TabBar.Item
                                        title="分类"
                                        key="category"
                                        icon={<IconFont iconText="iconbiaoqianlanfenlei-"/>}
                                        selectedIcon={<IconFont iconText="iconbiaoqianlanfenlei"/>}
                                        selected={this.state.selectedTab === 'category'}
                                        onPress={() => this.gotoPage('category')}
                                    />
                                    <TabBar.Item
                                        title="发现"
                                        key="find"
                                        icon={<IconFont iconText="iconbiaoqianlanfaxian-"/>}
                                        selectedIcon={<IconFont iconText="iconbiaoqianlanfaxian"/>}
                                        selected={this.state.selectedTab === 'find'}
                                        onPress={() => this.gotoPage('find')}
                                    />
                                    <TabBar.Item
                                        title="购物车"
                                        key="shopCart"
                                        icon={<IconFont iconText="iconbiaoqianlangouwuche-"/>}
                                        selectedIcon={<IconFont iconText="iconbiaoqianlangouwuche"/>}
                                        selected={this.state.selectedTab === 'shopCart'}
                                        onPress={() => this.gotoPage('shopCart')}
                                    />
                                    <TabBar.Item
                                        title="我的"
                                        key="my"
                                        icon={<IconFont iconText="iconbiaoqianlanwode-"/>}
                                        selectedIcon={<IconFont iconText="iconbiaoqianlanwode"/>}
                                        selected={this.state.selectedTab === 'my'}
                                        onPress={() => this.gotoPage('my')}
                                    />
                                </TabBar>
                            </div>
                        )
                }
            </React.Fragment>
        );
    }
}

export {FooterBar};
