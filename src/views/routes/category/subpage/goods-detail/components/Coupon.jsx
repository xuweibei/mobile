import {Modal, List, Icon, Button} from 'antd-mobile';
import PropTyps from 'prop-types';
import './Coupon.less';

export default class Coupon extends React.PureComponent {
    static propTypes = {
        couponStatus: PropTyps.bool.isRequired,
        useCouponStatus: PropTyps.bool,
        closeCoupon: PropTyps.func.isRequired,
        checkCouponStatus: PropTyps.array,
        title: PropTyps.string.isRequired,
        isDetail: PropTyps.string.isRequired,
        checkCoupon: PropTyps.func,
        notUseCoupon: PropTyps.func,
        useCoupon: PropTyps.func,
        couponList: PropTyps.array.isRequired,
        // couponList: PropTyps.oneOfType([PropTyps.array, PropTyps.object]).isRequired,
        getCoupon: PropTyps.array
    }

    static defaultProps = {
        checkCoupon: () => {},
        useCoupon: () => null,
        getCoupon: [],
        useCouponStatus: false,
        checkCouponStatus: [],
        notUseCoupon: () => {}
    }

    render() {
        const {couponStatus, closeCoupon, title, useCouponStatus, couponList, notUseCoupon, checkCouponStatus, getCoupon, useCoupon, isDetail, checkCoupon} = this.props;
        return (
            <Modal
                className="coupon-modal"
                popup
                visible={couponStatus}
                animationType="slide-up"
            >
                <List renderHeader={() => <div className="get-money"><span>{title}</span> <Icon type="cross" onClick={closeCoupon}/></div>} className="popup-list">
                    {
                        !isDetail && (
                            <List.Item className="notCoupon" onClick={notUseCoupon}>
                                <span>不使用优惠券</span>
                                <span className={`icon ${useCouponStatus ? 'icon-check-active' : 'icon-check'}`}/>
                            </List.Item>
                        )
                    }
                    {
                        couponList && couponList.length > 0 && couponList.map((item, index) => (
                            <List.Item key={`${item.card_no + index}`}>
                                <div className="coupon-container">
                                    <div className="coupon-left">
                                        <div className="left-top">￥<span>{item.price}</span></div>
                                        <div className="left-bottom">{item.price_limit}</div>
                                    </div>
                                    <div className="coupon-right">
                                        <div className="right-left">
                                            <div>
                                                <div className="right-left-title">{item.limit_tip}</div>
                                                <div className="right-left-center">{item.card_title}</div>
                                                <div className="right-left-date">{item.term_validity}</div>
                                            </div>
                                        </div>
                                        <div className="right">
                                            {
                                                isDetail ? (
                                                    <Button
                                                        className={getCoupon[index] ? '' : 'am-button-active'}
                                                        onClick={() => useCoupon(index, item.card_no)}
                                                    >{getCoupon[index] ? '去使用' : '立即领取'}
                                                    </Button>
                                                ) : (<div className={`icon ${checkCouponStatus[index] ? 'icon-check-active' : 'icon-check'}`} onClick={() => checkCoupon(index, item.price)}/>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        ))
                    }
                </List>
            </Modal>
        );
    }
}