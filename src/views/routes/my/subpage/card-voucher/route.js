//卡券包页面  2020.3.11

import {Route} from 'react-router-dom';


const CardVoucherModal = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './CardVoucher'),
    loading: () => null
});


const MyCardVoucherModal = () => (
    <React.Fragment>
        <Route path="/cardVoucher" component={CardVoucherModal}/>
    </React.Fragment>
);

export default MyCardVoucherModal;