/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import './ShopHomeIndex.less';

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
                    <div style={{background: shopModelArr.content.bg_color}} className="shopHomeBanner"><img src={shopModelArr.picurl[1]} alt=""/></div>
                    <div className="items">
                        <div className="title">
                            <p className="marginTop">{shopModelArr.content.sort1_title1}</p>
                            <h2>{shopModelArr.content.sort1_title2}</h2>
                            <h3>{shopModelArr.content.sort1_title3}</h3>
                        </div>
                        <div className="hotImgShow">
                            <div className="top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[2]} alt=""/>
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
                            {/* <div className="middle">
                                <div className="leftImg fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[3]} alt=""/>
                                    <div className="rightText fl">
                                        <p className="rightTextCon fl">
                                            <div className="priceInfo">
                                                <p className="shopTitleSmall">{shopModelArr.content.sort1_pr2_title1}</p>
                                                <div className="shopPeiceSmall">{shopModelArr.content.sort1_pr2_title2}<span>{shopModelArr.content.sort1_pr2_title3}</span></div>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[2]} alt=""/>
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
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">佛挡杀</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">453</span>
                                                <span className="money-before">54635</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="bottomImgRight fl">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[6]} alt=""/>
                                    </div> */}
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">佛挡杀</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">453</span>
                                                <span className="money-before">54635</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">佛挡杀</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">453</span>
                                                <span className="money-before">54635</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomImgLeft">
                                    <div className="marginBot">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        <div className="margin-bot-box">
                                            <div className="margin-bot-content-top">佛挡杀</div>
                                            <div className="margin-bot-content-bot">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">453</span>
                                                <span className="money-before">54635</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="priceInfo">
                                    <p>{shopModelArr.content.sort1_pr3_title1}</p>
                                    <div className="shopPeiceSmall">{shopModelArr.content.sort1_pr3_title2}
                                        <span>{shopModelArr.content.sort1_pr3_title3}</span>
                                    </div>
                                    <div onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div>
                                </div> */}
                        </div>
                        <div className="newImgShow">
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr3_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr3_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr3_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">fgdgfgfd</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">546</span>
                                        <span className="money-before">120</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr3_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr3_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr3_title3}</span>
                                    </div>
                                    {/* <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div> */}
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <div className="shop-title-small">{shopModelArr.content.sort2_pr3_title1}</div>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{shopModelArr.content.sort2_pr3_title2}</span>
                                        <span className="money-before">{shopModelArr.content.sort2_pr3_title3}</span>
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
