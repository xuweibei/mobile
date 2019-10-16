import {Button, InputItem, NavBar, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import VerificationCode from '../../../../../../common/verification-code';
import {InputGrid} from '../../../../../../common/input-grid/InputGrid';
import './PasswordPayment.less';

const {appHistory, validator, showInfo, showSuccess, getUrlParam, setNavColor} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}, navColorF} = Constants;
const getPass = { //获取验证码按钮的样式
    float: 'right',
    marginRight: '18px',
    color: '#de1212',
    border: 'none',
    // marginTop: '18px',
    background: '@white',
    lineHeight: '44px'
};
const hybird = process.env.NATIVE;
class passwordPayment extends BaseComponent {
    state = {
        phoneNum: '', //电话号码初始值
        editModal: 'default', //当前状态
        sentPay: '', //是否已设置支付密码
        getOff: false //点击获取验证码是否可以获取，默认不可以，除非输入的电话号码符合要求
    };

    componentWillMount() {
        if (hybird) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    // verifyPayword = () => {//是否设置过支付密码
    //     this.fetch(urlCfg.memberStatus, {method: 'post', data: {types: 0}})
    //         .subscribe(res => {
    //             if (res.status === 0) {
    //                 if (res.data.status !== 0) {
    //                     this.setState({
    //                         statusPay: 1,
    //                         editModal: 'passEdit'
    //                     });
    //                 } else {
    //                     this.setState({
    //                         statusPay: 0,
    //                         editModal: 'default'
    //                     });
    //                 }
    //             }
    //         });
    // }

    //获取验证码
    getPhoneCode = () => {
        const {phoneNum} = this.state;
        if (!phoneNum) {
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(phoneNum.replace(/\s*/g, ''))) {
            showInfo(Form.Error_Phone);
            return;
        }
        this.fetch(urlCfg.getTheAuthenticationCode, {method: 'post', data: {phone: phoneNum.replace(/\s*/g, '')}})
            .subscribe(res => {
                if (res.status === 0) {
                    showSuccess(Feedback.Send_Success);
                }
            });
        // FIXME: 这个跟没有返回值是一样的
        //已优化
    }

    //验证手机号码
    checkPhone = (rule, value, callback) => {
        if (!value) {
            callback('\u0020');
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(value.replace(/\s*/g, ''))) {
            callback('\u0020');
            showInfo(Form.Error_Phone);
            return;
        }
        callback();
    };

    //检验验证码
    checkPhoneCode = (rule, value, callback) => {
        if (value.length === 0) {
            callback('\u0020');
            showInfo(Form.No_Captcha);
            return;
        }
        if (value.length < 4) {
            callback('\u0020');
            showInfo(Form.Error_Captcha);
            return;
        }
        callback();
    };

    //输入电话号码
    phoneChange = (data) => {
        this.setState({
            phoneNum: data
        });
        if (validator.checkPhone(data.replace(/\s*/g, ''))) {
            this.setState({//手机号码符合要求，就可以点击获取验证码
                getOff: true
            });
        } else {
            this.setState({//不符合则点击无效
                getOff: false
            });
        }
    }

    //输入验证码
    verificationCode = (data) => {
        this.setState({
            phoneCode: data
        });
    }

    //下一步
    nextPage = () => {
        const {form: {validateFields, getFieldValue}} = this.props;
        validateFields({first: true}, (error, value) => {
            const phoneCode = getFieldValue('authCode');
            const phoneNum = getFieldValue('phone');
            if (!error) {
                this.fetch(urlCfg.verificationVerificationCode, {method: 'post', data: {phone: phoneNum.replace(/\s*/g, ''), chk_pass: 0, vcode: phoneCode.replace(/\s*/g, '')}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            this.setState({
                                editModal: 'passEdit'
                            });
                        }
                    });
            } else {
                console.log('错误');
                console.log(error, value);
            }
        });
    }

    // 确认修改
    mustSure = () => {
        const pay = decodeURI(getUrlParam('pay', encodeURI(this.props.location.search)));//支付页面设置支付密码的时候使用
        const {num, againNum, statusPay, phoneNum} = this.state;
        const reg = /^[0-9]\d*$/;
        if (!phoneNum) {
            showInfo(Form.No_Phone);
            return;
        }
        if (reg.test(num) && reg.test(againNum)) {
            if (num === againNum) {
                this.fetch(urlCfg.updatePaymentPassword, {method: 'post', data: {pwd: num, phone: phoneNum.replace(/\s*/g, '')}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            if (statusPay !== 1) {
                                showSuccess(Feedback.Change_Password_Success);
                            } else {
                                showSuccess(Feedback.Set_Success);
                            }
                            if (pay && pay === '1') {
                                appHistory.go(-1);
                            } else {
                                appHistory.go(-2);
                            }
                        }
                    });
            } else {
                showInfo(Form.Error_Password_Same);
            }
        } else {
            showInfo(Form.Error_PayPassword);
        }
        // FIXME: 这个跟没有返回值是一样的
        //已优化
    }

    //第一个输入框
    inputGrid = (val) => {
        const {againNum} = this.state;
        this.setState({
            num: val
        }, () => {
            if (val && againNum) {
                this.mustSure();
            }
        });
    }

    //第二个输入框
    inputGridAgain = (val) => {
        const {num} = this.state;
        this.setState({
            againNum: val
        }, () => {
            if (val && num) {
                this.mustSure();
            }
        });
    }

    render() {
        const {editModal, getOff} = this.state;
        const {getFieldDecorator} = this.props.form;//getFieldDecorator用于和表单进行双向绑定
        return (
            <React.Fragment>
                {editModal === 'passEdit' && (
                    <div data-component="password-payment" data-role="page" className="password-payment">
                        <NavBar
                            className="nab"
                            icon={<Icon type="left" size="lg" onClick={() => { this.setState({editModal: 'default'}) }}/>}
                        >
                            {
                                '设置支付密码'
                            }
                        </NavBar>
                        <div className="password-box">
                            <div className="payment-code">请输入支付密码</div>
                            <div className="content">
                                <InputGrid onInputGrid={this.inputGrid}/>
                            </div>
                            <div className="payment-code">请再次输入支付密码</div>
                            <div className="content">
                                <InputGrid onInputGrid={this.inputGridAgain}/>
                            </div>
                            <div className="payment-box">
                                <div className="difference">不可与登入密码相同</div>
                            </div>
                        </div>
                    </div>
                )}
                {editModal === 'default' && (
                    <div data-component="password-detail" data-role="page" className="password-detail">
                        <div>
                            <NavBar
                                className="nab"
                                icon={<Icon type="left" size="lg" onClick={() => { appHistory.goBack() }}/>}
                            >
                            身份验证
                            </NavBar>
                            <div className="cipher-box">
                                {
                                    getFieldDecorator('phone', {
                                        initialValue: '',
                                        rules: [
                                            //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                            {validator: this.checkPhone}
                                        ],
                                        validateTrigger: 'onSubmit'//校验值的时机
                                    })(
                                        <InputItem
                                            type="phone"
                                            placeholder="请输手机号码"
                                            onChange={this.phoneChange}
                                            value={this.state.phoneNum}
                                            clear
                                        >输入手机号
                                        </InputItem>
                                    )
                                }
                                <div className="get-number">
                                    {
                                        getFieldDecorator('authCode', {
                                            initialValue: '',
                                            rules: [
                                                {validator: this.checkPhoneCode}
                                            ],
                                            validateTrigger: 'onSubmit'
                                        })(
                                            <InputItem
                                                type="number"
                                                placeholder=""
                                                className="sure-pass"
                                                ref={ref => { this.yzm = ref }}
                                                maxLength={6}
                                            >验证码
                                            </InputItem>
                                        )
                                    }
                                    <VerificationCode
                                        styleProps={getPass} //需要的样式
                                        getCode={this.getPhoneCode} //点击获取事件
                                        getOff={getOff} //判断获取验证码前，所需要的内容是否符合要求，如手机号是否正确
                                    />
                                </div>
                                <Button className="next-button" onClick={this.nextPage}>下一步</Button>
                            </div>
                        </div>
                    </div>
                )
                }
            </React.Fragment>
        );
    }
}

export default createForm()(passwordPayment);
