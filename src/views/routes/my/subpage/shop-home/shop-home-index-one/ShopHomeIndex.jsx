/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import './ShopHomeIndex.less';
import {Carousel} from 'antd-mobile';

const {appHistory} = Utils;

class ShopHomeIndex extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr} = this.props;
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeContent">
                    <div style={{background: shopModelArr.content.bg_color}} className="shopHomeBanner">
                        {
                            (shopModelArr.content && shopModelArr.content.banner && shopModelArr.content.banner.length > 0) ? (
                                <Carousel
                                    className="my-carousel"
                                    vertical
                                    dots={false}
                                    dragging={false}
                                    swiping={false}
                                    autoplay
                                    infinite
                                    speed={2000}
                                    autoplayInterval={3000}
                                    resetAutoplay={false}
                                >
                                    {
                                        shopModelArr.content.banner.map(item => <img key={item.ix} src={item.url} title="693"/>)
                                    }
                                </Carousel>
                            ) : <img title="132"/>
                        }
                    </div>
                    <div className="items">
                        <div className="title">
                            <p className="marginTop">{shopModelArr.content.sort1_title1}</p>
                            <h2>{shopModelArr.content.sort1_title2}</h2>
                            <h3>{shopModelArr.content.sort1_title3}</h3>
                        </div>
                        <div className="hotImgShow">
                            <div className="top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[1]} alt=""/>
                                <div className="priceInfo">
                                    <div className="infoLeft">
                                        <p className="shopTitleSmall">{shopModelArr.content.sort1_pr1_title1}</p>
                                        <div className="shopPeiceSmall">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{shopModelArr.content.sort1_pr1_title2}</span>
                                            <span className="money-before">{shopModelArr.content.sort1_pr1_title3}</span>
                                        </div>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[2]} alt=""/>
                                <div className="priceInfo">
                                    <div className="infoLeft">
                                        <p className="shopTitleSmall">{shopModelArr.content.sort1_pr2_title1}</p>
                                        <div className="shopPeiceSmall">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{shopModelArr.content.sort1_pr2_title2}</span>
                                            <span className="money-before">{shopModelArr.content.sort1_pr2_title3}</span>
                                        </div>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="items">
                        <div className="title">
                            <h2>{shopModelArr.content.sort2_title1}</h2>
                            <h3>{shopModelArr.content.sort2_title2}</h3>
                        </div>
                        <div className="hotImgBottom">
                            <div className="bottomImg">
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[3]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">{shopModelArr.content.sort2_pr1_title1}</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">{shopModelArr.content.sort2_pr1_title2}</span>
                                                <span className="money-before">{shopModelArr.content.sort2_pr1_title3}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">{shopModelArr.content.sort2_pr2_title1}</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">{shopModelArr.content.sort2_pr2_title1}</span>
                                                <span className="money-before">{shopModelArr.content.sort2_pr2_title1}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[5]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">{shopModelArr.content.sort2_pr3_title1}</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">{shopModelArr.content.sort2_pr3_title2}</span>
                                                <span className="money-before">{shopModelArr.content.sort2_pr3_title3}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[6]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">{shopModelArr.content.sort2_pr4_title1}</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">{shopModelArr.content.sort2_pr4_title2}</span>
                                                <span className="money-before">{shopModelArr.content.sort2_pr4_title3}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="newImgShow">
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr5_id)} src={shopModelArr.picurl[7]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr5_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr5_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr5_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr6_id)} src={shopModelArr.picurl[8]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr6_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr6_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr6_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr7_id)} src={shopModelArr.picurl[9]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr7_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr7_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr7_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr8_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr8_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr8_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr8_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
