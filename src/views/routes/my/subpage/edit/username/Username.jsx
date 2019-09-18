import {connect} from 'react-redux';
import {Button, InputItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {myActionCreator as actionCreator} from '../../../actions/index';
import './Username.less';

const {appHistory, showInfo, showSuccess} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;

class ExtName extends BaseComponent {
    state = {
        nickname: ''
    };

    componentDidMount() {
        const {nickname, getNickName} = this.props;
        if (!nickname) {
            getNickName();
        }
    }

    //更改昵称
    lockingName = (rule, value, callback) => {
        const re = /^[\u4E00-\u9FA5A-Za-z]{2,20}$/;
        if (!value || !re.test(value)) {
            callback('\u0020');
            showInfo(Form.No_NickName);
            return;
        }
        callback();
    }

    //校验输入值
    modifyname = () => {
        const {form: {validateFields}, getUserInfo, getNickName, getMyInfo} = this.props;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.modifyNickname, {method: 'post', data: {nickname: val.nickname}})
                    .subscribe((res) => {
                        if (res.status === 0) {
                            showSuccess(Feedback.Edit_Success);
                            getNickName();//当前页面
                            getUserInfo();//设置页面
                            getMyInfo();//我的页面
                            appHistory.goBack();
                        }
                    });
                return;
            }
            console.log('错误', error, val);
        });
        return undefined;
    }

    render() {
        const {form: {getFieldDecorator}, nickname} = this.props;
        return (
            <div data-component="username" data-role="page" className="username">
                <AppNavBar title="修改昵称"/>
                <div className={`nickname ${window.isWX ? 'nickname-clear' : ''}`}>
                    {
                        getFieldDecorator('nickname', {
                            initialValue: nickname,
                            rules: [
                                {validator: this.lockingName}
                            ],
                            validateTrigger: 'onSubmit'//校验值的时机
                        })(
                            <InputItem
                                className="inpt"
                                style={{textAlign: 'left'}}
                            />
                        )
                    }
                    <Button onClick={this.modifyname}>确认修改</Button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        nickname: EditInfo.get('nickname')
    };
};
const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo,
    getNickName: actionCreator.getNickName,
    getMyInfo: actionCreator.getMyInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(ExtName));
