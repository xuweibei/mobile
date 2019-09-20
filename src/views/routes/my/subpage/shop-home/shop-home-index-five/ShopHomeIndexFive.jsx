
/**
 * 店铺模板5
 */
import PropTypes from 'prop-types';
import './ShopHomeIndexFive.less';
import {Carousel} from 'antd-mobile';


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
        console.log(shopModelArr, ' 李狂欢节是的覅看来好');
        return (
            <div data-component="ShopHomeIndexFive" data-role="page" className="ShopHomeIndexFive">
                <div className="Template-top">
                    <div className="template-top" style={{background: shopModelArr.content.bg_color}}>
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
                                    speed={200}
                                    autoplayInterval={300}
                                    resetAutoplay={false}
                                >
                                    {
                                        shopModelArr.content.banner.map(item => <img key={item.ix} src={item.url} title="693"/>)
                                    }
                                </Carousel>
                            ) : <img title="132"/>
                        }
                    </div>
                    <div className="boutique">
                        <div className="boutique-name">
                            <div className="boutique-name-top">{shopModelArr.content.sort1_title1}</div>
                            <div className="boutique-name-bottom">{shopModelArr.content.sort1_title2}</div>
                        </div>

                        <div className="thing">
                            <ul className="thing-top">
                                <li>
                                    <div className="sell-well">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr1_ix]} alt="" className="thing-big"/>
                                        <p className="thing-center"><i>{shopModelArr.content.sort1_pr1_title1}</i><span>￥{shopModelArr.content.sort1_pr1_title2}</span></p>
                                    </div>
                                </li>
                                <li>
                                    <div className="sell-well">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr2_ix]} alt="" className="thing-big"/>
                                        <p className="thing-center"><i>{shopModelArr.content.sort1_pr2_title1}</i><span>{shopModelArr.content.sort1_pr2_title2}</span></p>
                                    </div>
                                </li>
                            </ul>
                            <ul className="thing-bottom">
                                <li>
                                    <div className="sell-well">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr3_ix]} alt="" className="thing-small"/>
                                        <p className="thing-center"><i>{shopModelArr.content.sort1_pr3_title1}</i><span>{shopModelArr.content.sort1_pr3_title2}</span></p>
                                    </div>
                                </li>
                                <li>
                                    <div className="sell-well">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr4_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr4_ix]} alt="" className="thing-small"/>
                                        <p className="thing-center"><i>{shopModelArr.content.sort1_pr4_title1}</i><span>{shopModelArr.content.sort1_pr4_title2}</span></p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="popular-name">
                            <div className="popular-name-top">{shopModelArr.content.sort2_title1}</div>
                            <div className="popular-name-bottom">{shopModelArr.content.sort2_title2}</div>
                        </div>

                        <div className="popular-one">
                            <div className="popular-one-top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[shopModelArr.content.sort2_pr1_ix]} alt=""/>
                            </div>
                            <div style={{background: shopModelArr.content.bg_color}} className="popular-one-bottom">
                                <div className="popular-item">
                                    {/* <div className="popular-item-top">
                                        <p>{shopModelArr.content.sort2_pr1_title1}</p>
                                        {shopModelArr.content.sort2_pr1_title2}
                                    </div>
                                    <div className="popular-item-bottom">{shopModelArr.content.sort2_pr1_title3}</div> */}
                                </div>
                            </div>
                            <div className="price">
                                <span className="price-left">{shopModelArr.content.sort2_pr1_title1}</span>
                                <span className="price-center"/>
                                <span className="price-right">{shopModelArr.content.sort2_pr1_title2}<span>{shopModelArr.content.sort2_pr1_title3}</span></span>
                            </div>
                        </div>

                        {/* <div className="popular-two">
                            <div className="popular-two-left">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[7]} alt=""/>
                                <div className="price">
                                    <span className="price-left">{shopModelArr.content.sort2_pr2_title1}</span>
                                    <span className="price-center"/>
                                    <span className="price-right">{shopModelArr.content.sort2_pr2_title2}<span>{shopModelArr.content.sort2_pr2_title3}</span></span>
                                </div>
                            </div>
                            <div className="popular-two-right">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[8]} alt=""/>
                                <div className="price">
                                    <span className="price-left">{shopModelArr.content.sort2_pr3_title1}</span>
                                    <span className="price-center"/>
                                    <span className="price-right">{shopModelArr.content.sort2_pr3_title2}<span>{shopModelArr.content.sort2_pr3_title3}</span></span>
                                </div>
                            </div>
                        </div> */}

                        <div className="popular-three">
                            <div style={{background: shopModelArr.content.bg_color}} className="popular-three-left"/>
                            <div className="popular-three-right">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[9]} alt=""/>
                                <div className="introduce">
                                    <div className="introduce-left">{shopModelArr.content.sort2_pr2_title1}</div>
                                    <div className="price">
                                        <span className="price-left">{shopModelArr.content.sort2_pr2_title2}</span>
                                        <span className="price-center"/>
                                        <span className="price-right">{shopModelArr.content.sort2_pr2_title3}<span>{shopModelArr.content.sort2_pr4_title4}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="popular-four">
                            <div className="winter">
                                <div style={{background: shopModelArr.content.bg_color}} className="popular-four-left">
                                    {/* <div className="winter-top">{shopModelArr.content.sort2_pr5_title1}</div>
                                    <div className="winter-bottom">{shopModelArr.content.sort2_pr5_title2}</div> */}
                                </div>
                                <div className="popular-four-right">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[shopModelArr.content.sort2_pr3_ix]} alt=""/>
                                </div>
                            </div>
                            <div className="introduce-left">{shopModelArr.content.sort2_pr5_title3}</div>
                            <div className="price">
                                <span className="price-left">{shopModelArr.content.sort2_pr3_title1}</span>
                                <span className="price-center"/>
                                <span className="price-right">{shopModelArr.content.sort2_pr3_title2}<span>{shopModelArr.content.sort2_pr3_title3}</span></span>
                            </div>
                        </div>

                        <div className="popular-five">
                            <div className="popular-box">
                                <div style={{background: shopModelArr.content.bg_color}} className="popular-five-bottom"/>
                                <div className="popular-five-top">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[shopModelArr.content.sort2_pr4_ix]} alt=""/>
                                </div>
                            </div>
                            <div className="overcoat">
                                <div className="introduce-left">{shopModelArr.content.sort2_pr4_title1}</div>
                                <div className="price">
                                    <span className="price-left">{shopModelArr.content.sort2_pr4_title2}</span>
                                    <span className="price-center"/>
                                    <span className="price-right">{shopModelArr.content.sort2_pr4_title3}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFive;
