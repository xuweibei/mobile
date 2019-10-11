
import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {InputGrid} from '../../../../../common/input-grid/InputGrid';
import {myActionCreator} from '../../../actions/index';
import './BankCard.less';

const {appHistory, showSuccess, setNavColor} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}, navColorF} = Constants;
const hybird = process.env.NATIVE;
class BankCard extends BaseComponent {
    state = {
        userBankArr: [], //用户信息
        shopBankArr: [], //消費者銀行卡
        bankImg: {
            18: [0, 0],
            19: [-75, 0],
            20: [-150, 0],
            21: [-225, 0],
            22: [-300, 0],
            23: [-375, 0],
            24: [-450, 0],
            25: [-750, 0],
            26: [-600, 0],
            27: [-825, 0],
            28: [-900, 0],
            29: [-225, -75],
            30: [-675, 0],
            31: [-525, 0],
            32: [0, -75],
            33: [-75, -75],
            34: [-150, -75]
        }, //银行图标雪碧图位置
        userTypes: this.props.userTypes
    };

    componentDidMount() {
        const {bankInfo, getBankCardList} = this.props;
        if (!bankInfo) {
            getBankCardList();
        }
    }

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

    //获取列表数据
    getList = () => {
        this.fetch(urlCfg.getTheBankCardList, {method: 'post', data: {}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        userBankArr: res.data.user,
                        shopBankArr: res.data.shoper
                    });
                }
            });
    }

    //添加或者编辑银行卡
    editBankCode = (data) => {
        if (data.realname) {
            appHistory.push(`/bankCardDetail?realname=${data.realname}&idcard=${data.idcard}&bankId=${data.bankId}&bankNo=${data.bankNo}&phone=${data.phone}`);
        } else {
            appHistory.push('/bankCardDetail');
        }
    }

    //银行卡背景 蓝底
    backgroundImng = (num) => {
        num = Number(num);
        if (num === 19 || num === 21 || num === 23 || num === 24 || num === 25 || num === 26 || num === 27 || num === 28) {
            return true;
        }
        return false;
    }

    //点击解除绑定，弹出弹框
    untyingCode = (id) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Feedback.Relieve_Binding,
            btnTexts: ['取消', '解除绑定'],
            callbacks: [null, () => {
                this.setState({
                    pwsPopup: true
                });
            }]
        });
        this.setState({
            untId: id
        });
    }

    //关闭密码输入弹窗
    closePopupUp = () => {
        this.setState({
            pwsPopup: false
        });
    }

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push('/password');
    }

    //密码输入 支付完成 （CAM消费）
    inputGrid = (pwd) => {
        const {untId} = this.state;
        const {getBankCardList} = this.props;
        this.fetch(urlCfg.verifyPaymentPassword, {data: {pay_pwd: pwd}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        pwsPopup: false //关闭密码输入框
                    });
                    //解绑银行卡
                    this.fetch(urlCfg.delBankInfo, {data: {id: untId}})
                        .subscribe(data => {
                            if (data && data.status === 0) {
                                showSuccess(Feedback.Unbind_Success);
                                getBankCardList();
                            }
                        });
                }
            });
    }

    render() {
        const {bankImg, userTypes, pwsPopup} = this.state;
        const {bankInfo} = this.props;
        return (
            <div data-component="bankCard" data-role="page" className="bank-card">
                <AppNavBar title="我的银行卡"/>
                <div className={`increase-box ${window.isWX ? 'WX' : ''}`}>
                    {
                        (bankInfo && bankInfo.user.length > 0) ? bankInfo.user.map(item => (
                            <div className="card-box" key={item.id}>
                                <p className="explain">CAM余额提现卡</p>
                                <div className={this.backgroundImng(item.bankId) ? 'background-blue' : 'background-red'}>
                                    <div className="background-t">
                                        <div className="logo" style={{backgroundPosition: bankImg[item.bankId] ? `${bankImg[item.bankId][0] / 50}rem ${bankImg[item.bankId][1] / 50}rem` : '1000px 1000px'}}/>
                                        <div className="background-tl">{item.bankArea}</div>
                                    </div>
                                    <div className="card">
                                        {/*FIXME: 用正则来简化*/}
                                        {/* {//我是需要截取，正则可以吗？} */}
                                        <span>{item.bankNo.slice(0, 4)}</span>
                                        <span>****</span>
                                        <span>****</span>
                                        <span>****</span>
                                        <span>{item.bankNo.slice(-3)}</span>
                                    </div>
                                </div>
                                <span className="untying" onClick={() => this.untyingCode(item.id)}>解绑</span>
                            </div>
                        )) : (
                            <div>
                                <p className="explain">CAM余额提现卡</p>
                                <div className="no-card" onClick={this.editBankCode}>
                                    <div className="icon noCard-t"/>
                                    <span className="noCard-b">添加银行卡</span>
                                </div>
                            </div>
                        )
                    }
                    {
                        userTypes === '2' && bankInfo && (bankInfo.shoper.length > 0
                            ? (
                                <div className="card-box">
                                    <p className="explain">营业提现卡</p>
                                    {bankInfo.shoper.map(item => (
                                        <div key={item.id} className={this.backgroundImng(item.bankId) ? 'background-blue' : 'background-red'}>
                                            <div className="background-t">
                                                <div className="logo" style={{backgroundPosition: bankImg[item.bankId] ? `${bankImg[21][0]}px ${bankImg[item.bankId][1]}px` : '1000px 1000px'}}/>
                                                <div className="background-tl">{item.bankArea}</div>
                                            </div>
                                            <div className="card">
                                                <span>{item.bankNo.slice(0, 4)}</span>
                                                <span>****</span>
                                                <span>****</span>
                                                <span>****</span>
                                                <span>{item.bankNo.substring(item.bankNo.length - 3)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <p className="explain">营业提现卡</p>
                                    <div className="no-card" onClick={this.editBankCode}>
                                        <div className="icon noCard-t"/>
                                        <span className="noCard-b">添加银行卡</span>
                                    </div>
                                </div>
                            ))
                    }
                </div>
                {pwsPopup && (
                    <div className="enter-password-box">
                        <div className="enter-password">
                            <div className="command">
                                <span className="icon command-left" onClick={this.closePopupUp}/>
                                <span className="icon command-center">请输入密码</span>
                                <span className="icon command-right" onClick={this.closePopupUp}/>
                            </div>
                            <InputGrid onInputGrid={this.inputGrid}/>
                            <p onClick={this.forgetPws}>忘记密码</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    const edit = state.get('my');
    return {
        userTypes: base.get('userTypes'),
        bankInfo: edit.get('bankInfo')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    getBankCardList: myActionCreator.getBankCardList
};
export default connect(mapStateToProps, mapDispatchToProps)(BankCard);
