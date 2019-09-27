/**邀请码页面 */

import {Button, ActionSheet} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './Invitation.less';
import {showInfo} from '../../../../../utils/mixin';

const {urlCfg} = Configs;
const {native, getUrlParam, TD} = Utils;
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
    state = {
        imgId: 0, //储存生成分享码的图片
        maskStatus: false //底部分享按钮显示
    };

    componentDidMount() {
        this.getGeneratingICode();
        const share = decodeURI(getUrlParam('share', encodeURI(this.props.location.search)));
        if (share !== '1') { //用来判断是否是点击分享按钮过来的，如果是，则就需要直接打开弹窗
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
                if (res.status === 0) {
                    // if (!res.data.child) {  //如果是一个没有绑定下级的消费者，进行二维码分享，则跳出弹窗提示：如果您分享并成功绑定新用户，您将失去开店资格。-取消分享 -确认分享
                    //     showConfirm({
                    //         title: '如果您分享并成功绑定新用户，您将失去开店资格',
                    //         btnTexts: ['取消', '确定'],
                    //         callbacks: [null, () => {
                    //             this.showShareActionSheet();//没有下级的消费者，不能开店，确认分享
                    //         }]
                    //     });
                    // } else { //有下级则直接弹出分享按钮
                    //     this.showShareActionSheet();
                    // }
                    this.setState({
                        shareArr: res.data.url
                    });
                }
            });
    }

    //弹出分享框
    showShareActionSheet = () => {
        const {maskStatus} = this.state;
        this.setState({
            maskStatus: !maskStatus
        });
        if (!window.isWX) {
            ActionSheet.showShareActionSheetWithOptions({
                options: dataList,
                message: '分享'
            },
            this.shareTrue);
        }
    };

    //确认分享方式
    shareTrue = (value) => {
        const {shareArr, maskStatus} = this.state;
        TD.log(TD_EVENT_ID.MY.ID, TD_EVENT_ID.MY.LABEL.SHARE);
        this.setState({
            maskStatus: !maskStatus
        });
        if (hybird) {
            const obj = {
                type: value + 1,
                title: '',
                content: '',
                url: '',
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
            <div data-component="invitation" data-role="page" className={`invitation ${window.isWX ? 'WX' : ''}`}>
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
                        <img src={shareArr} alt=""/>
                    </div>
                </div>
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
