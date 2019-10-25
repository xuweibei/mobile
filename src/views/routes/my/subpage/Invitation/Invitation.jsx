/**邀请码页面 */

import {Button, ActionSheet} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './Invitation.less';

const {urlCfg} = Configs;
const {native, getUrlParam, TD, showInfo} = Utils;
const {TD_EVENT_ID} = Constants;
const hybird = process.env.NATIVE;

//分享列表
const dataList = [
    {
        name: 'QQ',
        title: 'QQ'
    },
    {
        name: 'VX',
        title: '微信'
    },
    {
        name: 'PYQ',
        title: '朋友圈'
    },
    {
        name: 'WB',
        title: '微博'
    }
].map(obj => ({
    icon: <div className={obj.name}/>,
    title: obj.title
}));

class Invitation extends BaseComponent {
    state={
        shareArr: {} //分享内容
    }

    componentDidMount() {
        this.getGeneratingICode();
        const share = decodeURI(getUrlParam('share', encodeURI(this.props.location.search)));
        if (share === '1') { //用来判断是否是点击分享按钮过来的，如果是，则就需要直接打开弹窗
            this.showShareActionSheet();
        }
    }

    //保存图片
    saveImg = () => {
        const {shareArr} = this.state;
        if (hybird) {
            if (shareArr) {
                native('savePicCallback', {type: 2, imgUrl: shareArr});
            } else {
                showInfo('暂无图片可以保存');
            }
        }
    }

    //生成海报点击
    getGeneratingICode = () => {
        // const {showConfirm} = this.props;
        this.fetch(urlCfg.GeneratingInvitationCode, {method: 'post', data: {id: 1}})
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        shareArr: res.data.url
                    });
                }
            });
    }

    componentWillReceiveProps() {
        ActionSheet.close();//关闭分享
    }

    //弹出分享框maskImg
    showShareActionSheet = () => {
        if (!window.isWX) {
            ActionSheet.showShareActionSheetWithOptions({
                options: dataList,
                message: '分享'
            }, this.shareTrue);
        }
    };

    //确认分享方式
    shareTrue = (value) => {
        const {shareArr} = this.state;
        TD.log(TD_EVENT_ID.MY.ID, TD_EVENT_ID.MY.LABEL.SHARE);
        if (hybird) {
            const obj = {
                type: value + 1,
                title: '分享',
                content: '个人二维码',
                url: shareArr,
                imgUrl: shareArr
            };
            if (shareArr) {
                native('showShare', obj).then(res => {
                    native('goH5', {'': ''});
                }).catch(err => {
                    native('goH5', {'': ''});
                });
            } else {
                showInfo('暂无图片可以分享');
            }
        }
    }

    render() {
        const {shareArr} = this.state;
        return (
            <div data-component="invitation" data-role="page" className={`invitation ${window.isWX ? 'wx-share-content' : ''}`}>
                {
                    window.isWX ? (
                        <AppNavBar nativeGoBack title="邀请码"/>
                    ) : (
                        <AppNavBar
                            nativeGoBack
                            title="邀请码"
                            rightShow
                        />
                    )
                }
                <div className="mask">
                    <div className="mask-img">
                        <img src={shareArr} alt="" ref={(img) => { this.maskImg = img }}/>
                    </div>
                </div>
                {
                    window.isWX ? (<div className="wx-share">长按图片分享</div>) : (
                        <React.Fragment>
                            <Button
                                type="warning"
                                onClick={this.showShareActionSheet}
                            >分享
                            </Button>
                            <Button
                                className="button"
                                onClick={this.saveImg}
                            >保存图片
                            </Button>
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}


const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm
};

export default connect(
    null,
    mapDispatchToProps
)(Invitation);
