/**确认源头UID-扫码 页面 */
import {connect} from 'react-redux';
import {Button} from 'antd-mobile';
import {myActionCreator as actionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './SourceBrowse.less';

const {native, showInfo, getUrlParam, appHistory} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}} = Constants;

const hybrid = process.env.NATIVE;

class SourceBrowse extends BaseComponent {
    state={
        nickname: decodeURI(getUrlParam('nickname', encodeURI(this.props.location.search))),
        phone: decodeURI(getUrlParam('phone', encodeURI(this.props.location.search))),
        uid: decodeURI(getUrlParam('uid', encodeURI(this.props.location.search))),
        avatarUrl: decodeURI(getUrlParam('avatarUrl', encodeURI(this.props.location.search)))
    }

    componentWillReceiveProps(next) {
        const timerNext = decodeURI(getUrlParam('time', encodeURI(next.location.search)));
        const timer = decodeURI(getUrlParam('time', encodeURI(this.props.location.search)));
        if (hybrid && timer && timerNext !== timer) {
            this.setState({
                nickname: decodeURI(getUrlParam('nickname', encodeURI(next.location.search))),
                phone: decodeURI(getUrlParam('phone', encodeURI(next.location.search))),
                uid: decodeURI(getUrlParam('uid', encodeURI(next.location.search))),
                avatarUrl: decodeURI(getUrlParam('avatarUrl', encodeURI(next.location.search)))
            });
        }
    }

    //重新扫码
    sureSaoAgain = () => {
        if (hybrid) {
            const obj = {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            };
            native('qrCodeScanCallback', obj);
        }
    }

    //确认绑定
    sureBind = () => {
        const {uid, phone} = this.state;
        this.fetch(urlCfg.confirmationReferees, {method: 'post', data: {no: uid, type: 0, phone}})
            .subscribe(res => {
                if (res.status === 0) {
                    showInfo(Feedback.Bind_Success);
                    alert(appHistory.length());
                    if (hybrid && appHistory.length() === 0) {
                        native('native');
                    } else {
                        appHistory.go(-3);
                    }
                    this.props.getUserInfo();
                }
            });
    }

    //返回
    goBackModal = () => {
        if (hybrid && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {avatarUrl, nickname, uid, phone} = this.state;
        return (
            <div data-component="source-browse" data-role="page" className="source-browse">
                <AppNavBar goBackModal={this.goBackModal} title="确认源头UID"/>
                <div className="recommend-content">
                    <div className="picture">
                        <img src={avatarUrl || require('../../../../../../assets/images/avatar.png')} alt=""/>
                    </div>
                    <div className="information">
                        <p>{decodeURI(nickname)}</p>
                        <p>UID:{uid}</p>
                        <p>
                            <span>手机号：</span>
                            <span>{phone.slice(0, 4)}****{phone.slice(-4)}</span>
                        </p>
                    </div>
                    <div className="button">
                        {/* <Button className="normal-button general" onClick={this.sureSaoAgain}>重新扫码</Button> */}
                        <Button className="normal-button general" onClick={this.goBackModal}>取消</Button>
                        <Button className="normal-button important" onClick={this.sureBind}>确认绑定</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo
};

export default connect(null, mapDispatchToProps)(SourceBrowse);
