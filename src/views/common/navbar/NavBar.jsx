import React from 'react';
import PropTypes from 'prop-types';
import './NavBar.less';

const {appHistory, native, showInfo} = Utils;
const {navColorF} = Constants;
// const hashs = window.location.hash;
// const str = hashs.substring(hashs.length - 8);
// const hash = str;
// FIXME: 从新优化
//已优化
class NavBar extends React.PureComponent {
    static propTypes = {
        goBackModal: PropTypes.func,
        nativeGoBack: PropTypes.bool,
        title: PropTypes.string,
        rightShow: PropTypes.bool,
        redBackground: PropTypes.bool,
        rightSearch: PropTypes.bool,
        rightExplain: PropTypes.bool,
        rightEdit: PropTypes.bool,
        search: PropTypes.bool,
        isEdit: PropTypes.bool,
        changeNavRight: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),
        goToSearch: PropTypes.func,
        style: PropTypes.object,
        backgroundColor: PropTypes.string,
        rightExplainClick: PropTypes.func,
        show: PropTypes.bool,
        color: PropTypes.string,
        status: PropTypes.string
    }

    static defaultProps = {
        goBackModal: null,
        nativeGoBack: false,
        title: '',
        rightShow: false,
        redBackground: false,
        rightSearch: false,
        rightExplain: false,
        rightEdit: false,
        search: false,
        isEdit: false,
        changeNavRight: false,
        goToSearch: null,
        style: {},
        show: true,
        backgroundColor: '',
        rightExplainClick: () => {},
        color: '',
        status: '1'
    };

    componentWillMount() {
        if (process.env.NATIVE) { //设置tab颜色
            const {color} = this.props;
            console.log(color, '第考虑到法国次的颜色');
            native('setNavColor', {color: color || navColorF});
        }
    }

    componentWillReceiveProps() {
        if (process.env.NATIVE) {
            const {color} = this.props;
            console.log(color, '感觉');
            native('setNavColor', {color: color || navColorF});
        }
    }

    //左边按钮图标点击样式
    backAway = () => {
        const {nativeGoBack, goBackModal} = this.props;
        if (process.env.NATIVE) { //app状态下
            if (goBackModal) { //如果是有返回处理函数，则执行这个函数
                goBackModal();
            } else if (nativeGoBack || appHistory.length() === 0) { //如果没又返回处理函数，而是有 nativeGoBack 这个原生直接下级页面的标识，则返回时走原生方法
                native('goBack');
            } else { //其他情况则走返回
                appHistory.goBack();
            }
        } else if (goBackModal) { //非原生情况，有返回执行函数就执行该函数
            goBackModal();
        } else { //否则就执行返回
            appHistory.goBack();
        }
    };

    //浏览历史点击右上角回调
    changeButtonTitle = () => {
        const {isEdit} = this.props;
        this.props.changeNavRight(!isEdit);
    }

    //点击搜索图标
    goToSearch = () => {
        this.props.goToSearch();
    }

    goToIm = () => {
        if (process.env.NATIVE) {
            native('goToIm',  {'': ''});
        } else {
            showInfo('im');
        }
    }

    rightExplainClick = () => {
        const {rightExplainClick} = this.props;
        rightExplainClick();
    }

    render() {
        const {title, rightShow, redBackground, rightSearch, show, rightExplain, rightEdit, search, isEdit, backgroundColor, status} = this.props;
        if (window.isWX) {
            if (title) {
                document.title = title;
            }
            // return null;
        }

        return (
            (window.isWX && status === '1') ? null : (
                <div className="wrapTabNav">
                    <div className="navbar" style={{backgroundColor: backgroundColor || '@white'}}>
                        { redBackground //红底
                            ? (
                                <div>
                                    {
                                        show && (
                                            <div className="nav-left" onClick={this.backAway}>
                                                <div className="icon-left icon"/>
                                            </div>
                                        )
                                    }
                                    <span className="nav-title">{title}</span>
                                    {
                                        rightShow && ( //是否展示 im图标
                                            <div className="nav-right">
                                                <div className="icon-right icon" onClick={this.goToIm}/>
                                            </div>
                                        )
                                    }
                                    {
                                        search && ( //是否展示 搜索图标
                                            <div className="nav-search" onClick={this.goToSearch}>
                                                <div className="icon-search icon"/>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                            : (
                                <div>
                                    {
                                        show && (
                                            <div className="blackNav-left" onClick={this.backAway} style={this.props.style}>
                                                <div className="icon-left icon"/>
                                            </div>
                                        )
                                    }
                                    <span className="blackNav-title">{title}</span>
                                    {
                                        rightShow && ( //是否展示 im图标
                                            <div className="blackNav-right">
                                                <div className="icon-right icon" onClick={this.goToIm}/>
                                            </div>
                                        )
                                    }
                                    {
                                        rightSearch && ( //是否展示 搜索图标
                                            <div className="rightSearch">
                                                <div className="icon-rightSearch icon"/>
                                            </div>
                                        )
                                    }
                                    {
                                        rightExplain && (
                                            <div className="rightExplain" onClick={this.rightExplainClick}>相关说明</div>
                                        )
                                    }
                                    {/* 浏览历史导航右侧编辑功能 */}
                                    {
                                        rightEdit && (
                                            <div
                                                className="right-edit"
                                                onClick={this.changeButtonTitle}
                                            >
                                                {isEdit ? '完成' : '编辑'}
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            )
        );
    }
}


export default NavBar;
