
/**
 * 店铺模板5
 */
import PropTypes from 'prop-types';
import './ShopHomeIndexFive.less';
import {Carousel, WingBlank} from 'antd-mobile';


const {appHistory} = Utils;

class ShopHomeIndexFive extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr} = this.props;
        console.log(shopModelArr);
        return (
            <div data-component="ShopHomeIndexFive" data-role="page" className="ShopHomeIndexFive">
                <div className="template-top">
                    <div className="shopHomeFiveBanner" style={{background: shopModelArr.content.bg_color}}>
                        {
                            (shopModelArr.content && shopModelArr.content.banner && shopModelArr.content.banner.length > 0) ? (
                                <WingBlank>
                                    <Carousel
                                        autoplay
                                        infinite
                                        speed={2000}
                                    >
                                        {
                                            shopModelArr.content.banner.map(item => (
                                                <div style={{height: '386px'}} key={item.ix}>
                                                    <img src={item.url} title="693"/>
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </WingBlank>

                            ) : <img title="132"/>
                        }
                    </div>
                    <div className="boutique">
                        <div className="boutique-name">
                            <div className="boutique-name-top">- {shopModelArr.content.sort1_title1} -</div>
                            <div className="boutique-name-bottom">{shopModelArr.content.sort1_title2}</div>
                        </div>
                        <div className="thing">
                            <div className="sell-well">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[1]} alt="" className="thing-big"/>
                                <div className="thing-center">
                                    <p className="introduce-left">{shopModelArr.content.sort1_pr1_title1}</p>
                                    <div>
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort1_pr1_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort1_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sell-well">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[2]} alt="" className="thing-big"/>
                                <div className="thing-center">
                                    <p className="introduce-left">{shopModelArr.content.sort1_pr2_title1}</p>
                                    <div>
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort1_pr2_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort1_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sell-well">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[3]} alt="" className="thing-small"/>
                                <div className="thing-center">
                                    <p className="introduce-left">{shopModelArr.content.sort1_pr3_title1}</p>
                                    <div>
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort1_pr3_title1}</span>
                                        <span className="money-before">{shopModelArr.content.sort1_pr3_title2}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sell-well">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr4_id)} src={shopModelArr.picurl[4]} alt="" className="thing-small"/>
                                <div className="thing-center">
                                    <p className="introduce-left">{shopModelArr.content.sort1_pr4_title1}</p>
                                    <div>
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort1_pr1_title1}</span>
                                        <span className="money-before">{shopModelArr.content.sort1_pr1_title2}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-name">
                            <div className="popular-name-top">{shopModelArr.content.sort2_title1}</div>
                            <div className="popular-name-bottom">{shopModelArr.content.sort2_title2}</div>
                        </div>
                        <div className="popular-one">
                            <div className="popular-one-top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[5]} alt=""/>
                            </div>
                            <div className="popular-one-bottom">
                                <div className="introduce-left">{shopModelArr.content.sort2_pr1_title1}</div>
                                <div className="popular-one-bottom-price">
                                    <span className="money-ZH">￥</span>
                                    <span className="money-now">{shopModelArr.content.sort2_pr1_title2}</span>
                                    <span className="money-before">{shopModelArr.content.sort2_pr1_title3}</span>
                                </div>
                            </div>
                        </div>
                        <div className="popular-three">
                            <div style={{background: shopModelArr.content.bg_color}} className="popular-three-left"/>
                            <div className="popular-three-right">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[6]} alt=""/>
                                <div className="introduce">
                                    <div className="introduce-left">{shopModelArr.content.sort2_pr2_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr2_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-two-copy">
                            <div className="popular-two-left">
                                <div className="popular-two-left-top">
                                    <div>
                                        <div className="inner">
                                            <span>dsfdsdf</span>
                                            <span>fgdsfg</span>
                                        </div>
                                    </div>
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[7]} alt=""/>
                                </div>
                                <div className="popular-two-left-bot">
                                    <div className="introduce-left">{shopModelArr.content.sort2_pr3_title1}</div>
                                    <div className="popular-two-left-bot-price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr3_title1}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr3_title1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-four">
                            <div className="winter">
                                <div className="popular-four-right">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[8]} alt=""/>
                                </div>
                                <div className="introduce">
                                    <div className="introduce-left">{shopModelArr.content.sort2_pr4_title1}</div>
                                    <div className="introduce-right">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr4_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr4_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="empty-container-four"/>
                        </div>
                        {/* <div className="popular-five">
                            <div className="popular-box">
                                <div style={{background: shopModelArr.content.bg_color}} className="popular-five-bottom"/>
                                <div className="popular-five-top">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr6_id)} src={shopModelArr.picurl[11]} alt=""/>
                                </div>
                            </div>
                            <div className="overcoat">
                                <div className="introduce-left">{shopModelArr.content.sort2_pr6_title1}</div>
                                <div className="price">
                                    <span className="price-left">{shopModelArr.content.sort2_pr6_title2}</span>
                                    <span className="price-right">{shopModelArr.content.sort2_pr6_title3}<span>{shopModelArr.content.sort2_pr6_title4}</span></span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFive;
