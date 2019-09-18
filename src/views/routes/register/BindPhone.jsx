
import {InputItem, Button, Modal} from 'antd-mobile';
import './BindPhone.less';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';

const {appHistory, validator, showInfo} = Utils;
const {urlCfg, appCfg} = Configs;
const {MESSAGE: {Form, LOGIN}, COUNTERNUM} = Constants;

class BindPhone extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        code: '',
        phone: '',
        resetTime: COUNTERNUM,
        text: LOGIN.GET_CODE
    }

    //获取输入的电话号码和密码
    onInputChange = (val, type) => {
        if (type === 'phone') {
            this.setState({
                phone: val
            });
        } else {
            this.setState({
                code: val
            });
        }
    }

    //获取验证码
    getCode = () => {
        const {resetTime} = this.state;
        const phone = this.state.phone.replace(/\s+/g, '');
        const myPhone = parseInt(phone, 10);
        if (phone.length === 0) {
            showInfo('请输入您的手机号');
            return;
        }
        if (!validator.checkPhone(myPhone)) {
            showInfo(Form.Phone_Input_Err, 1);
            return;
        }
        this.fetch(urlCfg.getCode, {data: {phone: myPhone}})
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setTime(resetTime);
                }
            });
    }

    login = () => {
        const phone = this.state.phone.replace(/\s+/g, '');
        const code = this.state.code;
        if (!phone && !code) {
            showInfo('请输入手机号和验证码');
            return;
        }
        this.fetch(urlCfg.login, {
            data: {
                token: appCfg.token,
                code: `${phone}UUUUUUUUUU${code}`,
                type: 3
            }
        }).subscribe(res => {
            showInfo('绑定手机号成功');
            const {setUserToken} = this.props;
            setUserToken(res.LoginSessionKey);
            appHistory.goBack();
        });
    }

    setTime = (countdown) => {
        if (countdown === 0) {
            this.setState({
                text: LOGIN.SEND_AGAIN,
                disabled: false
            });
            countdown = COUNTERNUM;
            return;
        }
        this.setState({
            text: `${LOGIN.SEND_AGAIN}${countdown}`,
            disabled: true
        });
        countdown--;

        setTimeout(() => {
            this.setTime(countdown);
        }, 1000);
    };

    //关闭页面退出设置
    closeTo = () => {
        // FIXME: 弹窗
        Modal.alert('关闭', '关闭后将退出登录，是否取消设置？', [
            {text: '否', style: 'default'},
            {
                text: '是',
                onPress: () => {
                    appHistory.goBack();
                }
            }
        ]);
    }

    render() {
        const {phone, code, disabled, text} = this.state;
        return (
            <div className="bind-phone">
                <div className="close" onClick={this.closeTo}>
                    <div className="icon close-icon"/>
                </div>
                <div className="title-box">
                    <p>绑定手机号</p>
                    <p>为保证您的账号安全，请绑定手机号。</p>
                </div>
                <div className="input-info">
                    <div className="pwd-input">
                        <div className="icon inp-icon-t"/>
                        <InputItem
                            type="phone"
                            placeholder="请输入手机号"
                            // onErrorClick={this.onPhoneNumError}
                            onChange={(val) => this.onInputChange(val, 'phone')}
                            value={phone}
                        />
                    </div>
                    <div className="inp-item">
                        <div className="icon inp-icon-b"/>
                        <InputItem
                            type="number"
                            placeholder="请输入验证码"
                            // onErrorClick={this.onPhoneNumError}
                            onChange={(val) => this.onInputChange(val, 'code')}
                            value={code}
                            maxLength="4"
                        />
                        <Button size="small" onClick={this.getCode} disabled={disabled}>{text}</Button>
                    </div>
                </div>
                <Button className="large-button important" type="primary" onClick={this.login}>确定</Button>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken
};
export default connect(null, mapDispatchToProps)(BindPhone);
