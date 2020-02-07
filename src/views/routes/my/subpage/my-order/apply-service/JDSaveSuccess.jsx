/*
* 京东售后提交成功页面
* */
import {Button} from 'antd-mobile';
import PropTypes from 'prop-types';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './JDSaveSuccess.less';

const {appHistory, getUrlParam} = Utils;
export default class JDSaveSuccess extends React.PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired
    }

    //查看记录
    seeHistory = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.replace(`refundDetails?id=${id}`);
    }

    //回到订单
    goBackOrder = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.replace(`listDetails?id=${id}`);
    }

    renderEle = () => (
        <div data-component="save-success" data-role="page" className="save-success">
            <AppNavBar title="填写物流"/>
            <div className="bg" >
                <div className="server-error"/>
            </div>
            <p className="text" >申请已提交，等待商家处理</p>
            <div className="btns">
                <Button onClick={this.seeHistory} className="see-history">查看记录</Button>
                <Button onClick={this.goBackOrder} className="goback-order">回到订单</Button>
            </div>
            <p className="toast">
                <span>温馨提示：</span>
                {/* <p>提示内容</p> */}
            </p>
        </div>
    )

    render() {
        return (
            this.renderEle()
        );
    }
}