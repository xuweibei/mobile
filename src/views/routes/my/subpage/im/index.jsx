import {Button} from 'antd-mobile';
import React from 'react';
import './index.less';
import {connect} from 'react-redux';
import AppNavBar from '../../../../common/navbar/NavBar';
// import Infonew from './info';
import {urlCfg} from '../../../../../configs/urlCfg';
import {systemApi} from '../../../../../utils/systemApi';

const {TD} = Utils;
const {TD_EVENT_ID} = Constants;
class Im extends BaseComponent {
    constructor() {
        super();
        this.state = {
            rightName: '管理',
            noticeArr: [],
            chooseArr: [],
            platformArr: [],
            tabNum: 0,
            checkedAll: false,
            editModal: ''
        };
    }

    componentDidMount() {
        TD.log(TD_EVENT_ID.IM.ID, TD_EVENT_ID.IM.LABEL.APPLY_REFUND);
        this.signIn();
    }

    //登录操作
    signIn = () => {
        const id = systemApi.getValue('usertoken');
        this.fetch(urlCfg.getTXImInfo, {method: 'post', data: {userToken: id}})
            .subscribe(res => {
                // console.log(res);
                const loginInfo = {
                    sdkAppID: 1400243962,
                    appIDAt3rd: 1400243962,
                    identifier: res.data.identifier,
                    userSig: res.data.UserSig
                };
                const listeners = {
                    onConnNotify: this.onConnNotify, //监听连接状态回调变化事件，选填
                    jsonpCallback: this.jsonpCallback, //IE9（含）以下浏览器用到的 jsonp 回调函数
                    onMsgNotify: this.onMsgNotify, //监听新消息（私聊，普通群（非直播聊天室）消息，全员推送消息）事件，必填
                    onBigGroupMsgNotify: this.onBigGroupMsgNotify, //监听新消息（直播聊天室）事件，直播场景下必填
                    onGroupSystemNotifys: this.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
                    onGroupInfoChangeNotify: this.onGroupInfoChangeNotify, //监听群资料变化事件，选填
                    onFriendSystemNotifys: this.onFriendSystemNotifys, //监听好友系统通知事件，选填
                    onProfileSystemNotifys: this.onProfileSystemNotifys, //监听资料系统（自己或好友）通知事件，选填
                    onKickedEventCall: this.onKickedEventCall, //被其他登录实例踢下线
                    onC2cEventNotifys: this.onC2cEventNotifys//监听 C2C 系统消息通道
                };
                const options = {
                    isAccessFormalEnv: true,
                    isLogOn: false
                };
                window.webim.login(loginInfo, listeners, options, this.successFun, this.fail);
            });
    }

    //登录成功
    successFun = (res) => {
        console.log(res, '都是符合健康和是否健康环境开放');
        this.setState({
            niName: res.identifierNick
        });
    }

    //登录失败
    fail = (res) => {
        console.log(res);
    }

    //监听连接状态回调变化事件，选填
    onConnNotify = (resp) => {
        let info;
        switch (resp.ErrorCode) {
        case window.webim.CONNECTION_STATUS.ON:
            window.webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
        case window.webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
            // console.log(info);
            window.webim.Log.warn(info);
            break;
        case window.webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            // console.log(info);
            window.webim.Log.warn(info);
            break;
        default:
            window.webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
        }
    }

    //获取好友列表
    getMyFriend = () => {
        // console.log(window);
        const options = {
            TimeStamp: 0,
            StartIndex: 0,
            GetCount: 100,
            LastStandardSequence: 0,
            TagList:
                    [
                        'Tag_Profile_IM_Nick',
                        'Tag_SNS_IM_Remark'
                    ]
        };
        window.webim.getAllFriend(
            options, (res) => console.log(res), res => console.log(res)
        );
    }


    //设置用户名
    setName = () => {
        const val = document.getElementsByClassName('setInfo')[0];
        console.log(val, '圣诞节覅看来');
        const profileItem = [
            {
                Tag: 'Tag_Profile_IM_Nick',
                Value: val.value
            }
        ];
        const options = {
            ProfileItem: profileItem
        };
        window.webim.setProfilePortrait(options, this.setSuccess, this.setfail);
    }

    setSuccess = (res) => {
        // console.log(res, '水电费和军事基地分开了');
        window.location.reload();
    }

    setfail = (res) => {
        // console.log(res, '的法国红酒的风格开了就开了');
    }

    //添加好友
    addFriend = () => {
        const addFriendItem = [
            {
                To_Account: '9927',
                AddSource: 'AddSource_Type_Unknow',
                AddWording: '就你了' //加好友附言，可为空
            }
        ];
        const options = {
            AddFriendItem: addFriendItem
        };
        window.webim.applyAddFriend(
            options,
            this.addFriendSuccess,
            this.addFriendFail
        );
    }

    addFriendSuccess = (res) => {
        console.log(res);
    }

    addFriendFail = (res) => {
        console.log(res);
    }

    //拉取好友
    pullFriend = () => {
        const options = {
            PendencyType: 'Pendency_Type_ComeIn',
            StartTime: 0,
            MaxLimited: 1000,
            LastSequence: 0
        };
        window.webim.getPendency(
            options,
            this.pullFriendSuccess,
            this.pullFriendfail
        );
    }

    allowFriend = () => {
        const options = {
            ResponseFriendItem: [
                {
                    To_Account: $('#rf_to_account').val(),
                    ResponseAction: $('input[name="rf_action_radio"]:checked').val()
                    //类型：Response_Action_Agree 或者 Response_Action_AgreeAndAdd
                }
            ]
        };
        window.webim.responseFriend(options, (res) => console.logg(res), (res) => console.log(res));
    }

    pullFriendSuccess = (res) => {
        console.log(res);
    }

    pullFriendfail = (res) => {
        console.log(res);
    }

    getFriendNew = () => {
        window.webim.syncMsgs(this.getNewOk, this.getNewErr);
    }

    getNewOk = (res) => {
        console.log(res, '看来商店内放接口');
    }

    getNewErr = (res) => {
        console.log(res, '看来商店内放接口');
    }

    render() {
        let BlockModal = <div/>;
        const {niName} = this.state;
        switch (this.state.editModal) {
        case 'info':
            // BlockModal = <Infonew goBackModal={this.goBackModal} {...this.state}/>;
            break;
        default:
            BlockModal = (
                <div data-component="notice" data-role="page" className="wrap">
                    <AppNavBar title="腾讯IM"/>
                    <div className="wrapInfo">
                        <p className="netName">{niName}</p>
                        <input className="setInfo" type="text"/>
                        <Button className="send">发送</Button>
                    </div>
                    <Button onClick={this.getMyFriend}>获取我的好友列表</Button>
                    <Button onClick={this.setName}>设置名称</Button>
                    <Button onClick={this.addFriend}>添加好友</Button>
                    <Button onClick={this.pullFriend}>拉取好友申请</Button>
                    <Button onClick={this.getFriendNew}>获取好友消息</Button>
                    <Button onClick={this.allowFriend}>响应好友申请</Button>
                </div>
            );
        }
        return BlockModal;
    }
}

const mapDispatchToProps = {
};


export default connect(null, mapDispatchToProps)(Im);
