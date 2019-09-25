
import {connect} from 'react-redux';
import {Button} from 'antd-mobile/lib/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './selectType.less';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {myActionCreator} from '../../../actions/index';
import SelfType from './SelfType';


const {appHistory, getUrlParam, native} = Utils;

const hybrid = process.env.NATIVE;
class ShopIndex extends BaseComponent {
    state={
        status: 'index',
        sure: ''
    };

    componentDidMount() {
        const status = decodeURI(getUrlParam('status', encodeURI(this.props.location.search)));
        const cerType = decodeURI(getUrlParam('cerType', encodeURI(this.props.location.search)));

        this.setState({
            sure: status
        });
        if (status === '11') {
            const {showConfirm} = this.props;
            showConfirm({
                title: '提示',
                message: '您还没有开店资格，暂不能开店。快去确认推荐人吧',
                btnTexts: ['取消', '确定'],
                callbacks: [
                    () => {
                        if (hybrid) {
                            native('goBack');
                        } else {
                            appHistory.push('/my');
                        }
                    },
                    () => {
                        appHistory.push('/recommender');
                    }
                ]
            });
        } else if (status === '4') {
            this.setState({
                auditStatus: 'filed',
                cerType: cerType
            });
        } else if (status === '9') {
            // const {setStatus} = this.state;
            // setStatus('now')
            this.setState({
                auditStatus: 'now'
            });
        }
    }

    checkPath = (type) => {
        const {showConfirm} = this.props;
        if (type === 'has') {
            showConfirm({
                title: '您可以开个体工商店',
                message: '个体工商店需上传营业执照，没有当天交易额的限制。适用于拥有实体店的个体商家。',
                btnTexts: ['取消', '去开店'],
                callbacks: [null, () => appHistory.push(`/openShopPage?shopType=${'other'}&shopStatus=${1}`)]
            });
        } else {
            showConfirm({
                title: '您可以开个人店或网店',
                message: '个人店为小微商店，营业总额为1000元/天。超过之后不能收款成功，发现模块不推荐，无法发现线上商品，适用于小吃店开店。网店将不能在发现模块找到，止咳发布线上商品，适用于网店。',
                btnTexts: ['取消', '去开店'],
                callbacks: [null, () => this.setState({status: 'selfType'})]
            });
        }
    };

    render() {
        const {status} = this.state;
        return (
            <div className="select-type">
                {
                    status === 'index' && (
                        <React.Fragment>
                            <AppNavBar
                                title="我要开店"
                            />
                            <div className="license"/>
                            <h2 className="select-title">您是否有营业执照?</h2>
                            <div className="button-box">
                                <Button type="primary" onClick={() => this.checkPath('has')}>我有营业执照</Button>
                                <Button className="none" onClick={() => this.checkPath('none')}>我没有营业执照</Button>
                            </div>
                        </React.Fragment>
                    )
                }
                {
                    status === 'selfType' && (
                        <SelfType/>
                    )
                }
            </div>
        );
    }
}
const mapToDispatchProps = {
    showConfirm: actionCreator.showConfirm,
    setStatus: myActionCreator.setPageStatus
};
export default connect(null, mapToDispatchProps)(ShopIndex);
