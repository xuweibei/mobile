
import {List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './UserAgreement.less';

const Item = List.Item;


export default class UserAgreement extends BaseComponent {
    render() {
        return (
            <div data-component="UserAgreement" data-role="page" className="UserAgreement">
                <AppNavBar title="关于"/>
                <List>
                    <Item arrow="horizontal" onClick={() => {}}>给我评价</Item>
                </List>
                <List>
                    <div className="about-information">
                        <Item arrow="horizontal" onClick={() => {}}>版权信息</Item>
                        <Item arrow="horizontal" onClick={() => {}}>软件许可使用协议</Item>
                        <Item arrow="horizontal" onClick={() => {}}>特别说明</Item>
                        <Item arrow="horizontal" onClick={() => {}}>平台服务协议</Item>
                        <Item arrow="horizontal" onClick={() => {}}>隐私权政策</Item>
                        <Item arrow="horizontal" onClick={() => {}}>证照信息</Item>
                    </div>
                </List>
                <List>
                    <Item extra="有新版" arrow="horizontal" onClick={() => {}}>新版本检测</Item>
                </List>
                <span className="edition">当前版本号：1.1.10</span>
            </div>
        );
    }
}
