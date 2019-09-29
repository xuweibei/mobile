
import {connect} from 'react-redux';
import {Button} from 'antd-mobile/lib/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './selectType.less';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {myActionCreator} from '../../../actions/index';
import SelfType from './SelfType';
import {urlCfg} from '../../../../../../configs/urlCfg';


const {appHistory, getUrlParam, native, systemApi: {getValue}} = Utils;

const hybrid = process.env.NATIVE;
class ShopIndex extends BaseComponent {
    state={
        status: 'index',
        sure: '',
        intro: {}
    };

    componentDidMount() {
        const status = decodeURI(getUrlParam('status', encodeURI(this.props.location.search)));
        const cerType = decodeURI(getUrlParam('cerType', encodeURI(this.props.location.search)));
        const localStatus = JSON.parse(getValue('shopStatus'));
        this.setState({
            sure: status
        });
        let myStatus;
        if (localStatus) {
            myStatus = localStatus;
        } else {
            myStatus = status;
        }
        if (myStatus === '11') {
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
        } else if (myStatus === '4') {
            this.setState({
                auditStatus: 'filed',
                cerType: cerType
            });
        } else if (myStatus === '9') {
            this.setState({
                auditStatus: 'now'
            });
        }
        this.getShopIntro();
    }

    checkPath = (type) => {
        const {showConfirm} = this.props;
        const {intro} = this.state;
        if (type === 'has') {
            showConfirm({
                title: '您可以开个体工商店',
                message: `${intro.individual_business}`,
                btnTexts: ['取消', '去开店'],
                callbacks: [null, () => appHistory.push(`/openShopPage?shopType=${'other'}&shopStatus=${1}`)]
            });
        } else {
            showConfirm({
                title: '您可以开个人店或网店',
                message: `${intro.person} ${intro.net}`,
                btnTexts: ['取消', '去开店'],
                callbacks: [null, () => this.setState({status: 'selfType'})]
            });
        }
    };

    getShopIntro = () => {
        this.fetch(urlCfg.getShopIntro).subscribe(res => {
            if (res && res.status === 0) {
                console.log(res);
                this.setState({
                    intro: res.data
                });
            }
        });
    }

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
