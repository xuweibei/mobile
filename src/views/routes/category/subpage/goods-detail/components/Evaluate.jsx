import PropTypes from 'prop-types';
import './Evaluate.less';

export default class Evaluate extends React.PureComponent {
    static propTypes = {
        Element: PropTypes.func.isRequired,
        names: PropTypes.array,
        goodsDetail: PropTypes.object.isRequired,
        shop: PropTypes.object.isRequired,
        shopH: PropTypes.func.isRequired,
        openSku: PropTypes.func.isRequired,
        hasType: PropTypes.func.isRequired
    }

    static defaultProps = {
        names: []
    }

    render() {
        const {Element, names, goodsDetail, shop, shopH, openSku, hasType} = this.props;
        return (
            <Element name="evaluate" className="goods-shop">
                <div className="framing">
                    <div
                        className="goods-select"
                        onClick={openSku}
                    >
                        <div className="select-left">
                            <div className="chose">选择</div>
                            <div className="attrs">
                                <span>选择</span>
                                {
                                    names && names.map((item, index) => (<span key={index.toString() + item}>{item}</span>))
                                }
                            </div>
                        </div>
                        <div className="select-right">
                            <span className="icon right-icon"/>
                        </div>
                    </div>
                </div>
                {
                    goodsDetail.effective_type === '0' ? (
                        <div className="serve">
                            <div className="waiter">服务</div>
                            <div className="their">
                                {
                                    hasType && (<span>门店可自提</span>)
                                }
                                <span className="dolt"/>
                            </div>
                        </div>
                    ) : (
                        <div className="serve">
                            <div className="waiter">有效时间</div>
                            <div className="their">
                                <div className="nonsupport">
                                    {goodsDetail.effective_type}
                                </div>
                                <div className="validity">{goodsDetail.if_holiday === '0' ? '仅工作日有效' : '节假日通用(节假日包含周六、周日)'}</div>
                            </div>
                        </div>
                    )
                }
                <div className="shop-detali">
                    <div className="box1">
                        <div className="shop-logo">
                            <img
                                className="logo-img"
                                src={shop.picpath}
                                onError={(e) => { e.target.src = shop.df_logo }}
                                alt=""
                            />
                        </div>
                        <div className="shop-detail">
                            <div className="Star">
                                <span className="Shop-Nl">
                                    {shop.shopName}
                                </span>
                                <div className="shop-btn">
                                    <div
                                        className="auxiliary-button red"
                                        onClick={() => shopH(shop.id)
                                        }
                                    >
                                        进店逛逛
                                    </div>
                                </div>
                            </div>
                            <div className="Shop-N">
                                <span className="Shop-Nr">
                                        人均消费
                                </span>
                                <span className="Shop-Nr">
                                ￥{shop.average_consumption}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Element>
        );
    }
}