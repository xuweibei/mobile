/**确认源头UID页面 */
import {connect} from 'react-redux';
import {List, InputItem, Button} from 'antd-mobile';
import {myActionCreator as actionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Source.less';

const {showInfo, validator, appHistory} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}} = Constants;

class Source extends BaseComponent {
    state = {
        showButton: false
    }

    //设置uid
    setUid = (value) => {
        this.setState({
            uid: value
        });
    }

    //设置电话
    setPhone = (value) => {
        this.setState({
            phone: value
        });
    }

    //验证信息
    verification = () => {
        const {uid, phone} = this.state;
        //uid判断
        if (!uid) {
            showInfo(Form.No_UID);
            return;
        }
        if (!validator.UID(uid)) {
            showInfo(Form.Error_UID);
            return;
        }
        if (!phone) {
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(validator.wipeOut(phone))) {
            showInfo(Form.Error_Phone);
            return;
        }
        //1表示验证
        this.submit(1);
    };

    //请求
    submit = (type) => {
        const {uid, phone} = this.state;
        this.fetch(urlCfg.confirmationReferees, {method: 'post', data: {no: uid, type, phone: validator.wipeOut(phone)}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        showButton: true
                    });
                    showInfo(Feedback.Ver_Success);
                    this.fetch(urlCfg.getDfinfor, {data: {no: uid}})
                        .subscribe(data => {
                            if (data.status === 0) {
                                appHistory.push(`/sourceBrowse?nickname=${data.data.nickname}&phone=${validator.wipeOut(phone)}&uid=${uid}&avatarUrl=${data.data.avatarUrl}`);
                            }
                        });
                }
            });
    };

    goBackModal =() => {
        if (appHistory.length() === 0) {
            appHistory.replace('/edit');
        } else {
            appHistory.goBack();
        }
    };

    render() {
        return (
            <div data-component="source" data-role="page" className="source">
                <AppNavBar title="确认源头UID" goBackModal={this.goBackModal}/>
                <div className="source-box">
                    <List>
                        <InputItem
                            clear
                            type="number"
                            placeholder="请输入推荐人UID"
                            onChange={this.setUid}
                        >推荐人UID
                        </InputItem>
                        <InputItem
                            clear
                            type="phone"
                            placeholder="请输入推荐人手机号"
                            onChange={this.setPhone}
                        >推荐人手机号
                        </InputItem>
                    </List>
                    <div className="cozy">
                        <p>温馨提示</p>
                        <p>输入的UID与手机号要是同一用户才可验证成哦</p>
                    </div>
                    <div className="next">
                        <Button className="normal-button" onClick={this.verification}>验证</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    delEdit: actionCreator.delEdit
};

export default connect(null, mapDispatchToProps)(Source);
