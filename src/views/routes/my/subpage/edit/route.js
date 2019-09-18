import React from 'react';
import {Route} from 'react-router-dom';
import Edit from './edit';
import EName from './username/Username';
import PasswordPage from './password/Password';
import PasswordDetailPage from './password/password-detail/PasswordDetail';
import PasswordPayment from './password/password-detail-payment/PasswordPayment';
import UserId from './userId/UserId';
import Addr from './address/Address';
import EditAddress from './edit-address';
import bankCardPage from './bank-card/BankCard';
import bankCardDetailPage from './bank-card/BankCardDetail';
import Area from './location-area';//所在区域管理
import InformationPage from './information/Information';
import FeedbackRouters from './user-agreement/Feedback';
import UserAgreementRouters from './user-agreement/UserAgreement';//关于中品优购-安卓
import UserAgreementDetailRouters from './user-agreement/UserAgreementDetail';//关于中品优购-苹果
import Account from './account/Account';//切换账号
import AddAccount from './account/AddAccount';//添加账号
import Source from './source';/*确认源头*/
import SourceHand from './source/Source';/*确认源头手动输入*/
import SourceBrowse from './source-browse/SourceBrowse';/*确认源头*/

const EditModal = () => (
    <React.Fragment>
        <Route path="/edit" component={Edit}/>
        <Route path="/extname" component={EName}/>
        <Route path="/password" component={PasswordPage}/> {/* 密码管理*/}
        <Route path="/passwordDetail" component={PasswordDetailPage}/> {/* 密码管理 手机验证*/}
        <Route path="/passwordPayment" component={PasswordPayment}/> {/*  密码管理  支付密码更改*/}
        <Route path="/enid" component={UserId}/> {/*查看原始id*/}
        <Route path="/address" component={Addr}/> {/*地址管理*/}
        <Route path="/editAddress" component={EditAddress}/> {/*地址管理-编辑或新建*/}
        <Route path="/bankCard" component={bankCardPage}/> {/*我的银行卡*/}
        <Route path="/bankCardDetail" component={bankCardDetailPage}/> {/*我的银行卡-填写列表*/}
        <Route path="/locationarea" component={Area}/>
        <Route path="/information" component={InformationPage}/> {/*消息通知*/}
        <Route path="/feedback" component={FeedbackRouters}/> {/* 问题反馈*/}
        <Route path="/userAgreement" component={UserAgreementRouters}/> {/* 关于中品优购-安卓*/}
        <Route path="/userAgreementDetail" component={UserAgreementDetailRouters}/> {/* 关于中品优购-苹果*/}
        <Route path="/account" component={Account}/> {/* 切换账户*/}
        <Route path="/addAccount" component={AddAccount}/> {/* 添加账户*/}
        <Route path="/source" component={Source}/> {/*确认源头*/}
        <Route path="/sourcehand" component={SourceHand}/> {/*确认源头手动输入*/}
        <Route path="/sourceBrowse" component={SourceBrowse}/> {/*确认源头-扫码*/}
    </React.Fragment>
);

export default EditModal;
