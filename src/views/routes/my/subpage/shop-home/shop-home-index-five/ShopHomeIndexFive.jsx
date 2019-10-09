
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

    //精选商品组件
    hotSellComponent = (ix, id, pic, title1, title2, title3) => (
        <div className="sell-well">
            <img onClick={() => this.goToGoods(id)} src={pic} alt="" className="thing-big"/>
            <div className="thing-center">
                <p className="introduce-left">{title1}</p>
                <div>
                    <span className="money-ZH">￥</span>
                    <span className="money-now">{title2}</span>
                    <span className="money-before">{title3}</span>
                </div>
            </div>
        </div>
    )

    render() {
        const {shopModelArr: {content, picurl}, shopModelArr} = this.props;
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
                                                    <img src={item.url} onClick={() => this.goToGoods(item.id)} title="693"/>
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
                            {this.hotSellComponent(content.sort1_pr1_ix, content.sort1_pr1_id, picurl[content.sort1_pr1_ix], content.sort1_pr1_title1, content.sort1_pr1_title2, content.sort1_pr1_title3)}
                            {this.hotSellComponent(content.sort1_pr2_ix, content.sort1_pr2_id, picurl[content.sort1_pr2_ix], content.sort1_pr2_title1, content.sort1_pr2_title2, content.sort1_pr2_title3)}
                            {this.hotSellComponent(content.sort1_pr3_ix, content.sort1_pr3_id, picurl[content.sort1_pr3_ix], content.sort1_pr3_title1, content.sort1_pr3_title2, content.sort1_pr3_title3)}
                            {this.hotSellComponent(content.sort1_pr4_ix, content.sort1_pr4_id, picurl[content.sort1_pr4_ix], content.sort1_pr4_title1, content.sort1_pr4_title2, content.sort1_pr4_title3)}
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
                                            <span>The Winter</span>
                                            <span>冬季热销</span>
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
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFive;
