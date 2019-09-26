/**
 * 店铺模板4
 */
import PropTypes from 'prop-types';
import {Carousel} from 'antd-mobile';
import './ShopHomeIndexFour.less';


const {appHistory} = Utils;

class ShopHomeIndexFour extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr: {picurl, content}, shopModelArr} = this.props;
        console.log(shopModelArr);
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeFourContent">
                    <div className="shopHomFourBanner">
                        {
                            content && (
                                <Carousel
                                    autoplay
                                    infinite
                                    speed={2000}
                                >
                                    {
                                        content.banner.length > 0 ? (
                                            content.banner.map(item => (
                                                <div style={{height: '158px'}}>
                                                    <img key={item} src={item.url} onClick={() => this.clickOnShow('two')}/>
                                                </div>
                                            ))) : null
                                    }
                                </Carousel>
                            )
                        }
                    </div>
                    <div className="compile-box">
                        {/* <div className={(picurl && picurl.length === 0) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl[0]})` : '', backgroundSize: '100% 100%'}}>
                            <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                        </div> */}

                        <div className="new-box" onClick={() => this.clickOnShow('four')}>
                            <div className="new-left"/>
                            <div className={(picurl && content && picurl[content.sort1_pr1_ix] && content.sort1_pr1_title1 && content.sort1_pr1_title2 && content.sort1_pr1_title3) ? 'new-right' : 'new no-edit-model'}>
                                <div className="fresh">NEW</div>
                                <img src={picurl && picurl[content.sort1_pr1_ix]} alt=""/>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort1_pr1_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort1_pr1_title2}</span>
                                        <span className="money-before">{content && content.sort1_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sell-box">
                            <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                                <div>{content && (content.sort2_title1 || 'fdsfs')}</div>
                                <div>{content && (content.sort2_title2 || '热门商品')}</div>
                            </div>
                            <div className="sell-commodity-box" onClick={() => this.clickOnShow('five')}>
                                <div className={(picurl && content && picurl[content.sort2_pr1_ix] && content.sort2_pr1_title1 && content.sort2_pr1_title2 && content.sort2_pr1_title3) ? 'sell' : 'sell no-edit-model'}>
                                    <div className="sell-goods">
                                        <img src={picurl && picurl[content.sort2_pr1_ix]} alt=""/>
                                    </div>
                                    <div className="headline-price">
                                        <div className="headline">{content && content.sort2_pr1_title1}</div>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{content && content.sort2_pr1_title2}</span>
                                            <span className="money-before">{content && content.sort2_pr1_title3}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={(picurl && content && picurl[content.sort2_pr2_ix] && content.sort2_pr2_title1 && content.sort2_pr2_title2 && content.sort2_pr2_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                    <div className="sell-commodity-img">
                                        <img src={picurl && picurl[content.sort2_pr2_ix]} alt=""/>
                                    </div>
                                    <div className="headline-price-take">
                                        <div className="headline">{content && content.sort2_pr2_title1}</div>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{content && content.sort2_pr2_title2}</span>
                                            <span className="money-before">{content && content.sort2_pr2_title3}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={(picurl && content && picurl[content.sort2_pr3_ix] && content.sort2_pr3_title1 && content.sort2_pr3_title2 && content.sort2_pr3_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                    <div className="sell-commodity-img">
                                        <img src={picurl && picurl[content.sort2_pr3_ix]} alt=""/>
                                    </div>
                                    <div className="headline-price-take">
                                        <div className="headline">{content && content.sort2_pr3_title1}</div>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{content && content.sort2_pr3_title2}</span>
                                            <span className="money-before">{content && content.sort2_pr3_title3}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={(picurl && content && picurl[content.sort2_pr4_ix] && content.sort2_pr4_title1 && content.sort2_pr4_title2 && content.sort2_pr4_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                    <div className="sell-commodity-img">
                                        <img src={picurl && picurl[content.sort2_pr4_ix]} alt=""/>
                                    </div>
                                    <div className="headline-price-take">
                                        <div className="headline">{content && content.sort2_pr4_title1}</div>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{content && content.sort2_pr4_title2}</span>
                                            <span className="money-before">{content && content.sort2_pr4_title3}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={(picurl && content && picurl[content.sort2_pr5_ix] && content.sort2_pr5_title1 && content.sort2_pr5_title2 && content.sort2_pr5_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                    <div className="sell-commodity-img">
                                        <img src={picurl && picurl[content.sort2_pr5_ix]} alt=""/>
                                    </div>
                                    <div className="headline-price-take">
                                        <div className="headline">{content && content.sort2_pr5_title1}</div>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-now">{content && content.sort2_pr5_title2}</span>
                                            <span className="money-before">{content && content.sort2_pr5_title3}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={(content && content.sort3_title1 && content.sort3_title2) ? 'title-bar hot-sale' : 'title-bar no-edit-model'} onClick={() => this.clickOnShow('six')}>
                            <div>{content && (content.sort3_title1 || 'NEW')}</div>
                            <div>{content && (content.sort3_title2 || '新品')}</div>
                        </div>
                        <div className="sell-commodity-box" onClick={() => this.clickOnShow('seven')}>
                            <div className={(picurl && content && picurl[content.sort3_pr1_ix] && content.sort3_pr1_title1 && content.sort3_pr1_title2 && content.sort3_pr1_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                <div className="sell-commodity-img">
                                    <img src={picurl && picurl[content.sort3_pr1_ix]} alt=""/>
                                </div>
                                <div className="headline-price-take">
                                    <div className="headline">{content && content.sort3_pr1_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort3_pr1_title2}</span>
                                        <span className="money-before">{content && content.sort3_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort3_pr2_ix] && content.sort3_pr2_title1 && content.sort3_pr2_title2 && content.sort3_pr2_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                <div className="sell-commodity-img">
                                    <img src={picurl && picurl[content.sort3_pr2_ix]} alt=""/>
                                </div>
                                <div className="headline-price-take">
                                    <div className="headline">{content && content.sort3_pr2_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort3_pr2_title2}</span>
                                        <span className="money-before">{content && content.sort3_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort3_pr3_ix] && content.sort3_pr3_title1 && content.sort3_pr3_title2 && content.sort3_pr3_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                <div className="sell-commodity-img">
                                    <img src={picurl && picurl[content.sort3_pr3_ix]} alt=""/>
                                </div>
                                <div className="headline-price-take">
                                    <div className="headline">{content && content.sort3_pr3_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort3_pr3_title2}</span>
                                        <span className="money-before">{content && content.sort3_pr3_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort3_pr4_ix] && content.sort3_pr4_title1 && content.sort3_pr4_title2 && content.sort3_pr4_title3) ? 'sell-commodity' : 'sell-commodity no-edit-model'}>
                                <div className="sell-commodity-img">
                                    <img src={picurl && picurl[content.sort3_pr4_ix]} alt=""/>
                                </div>
                                <div className="headline-price-take">
                                    <div className="headline">{content && content.sort3_pr4_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort3_pr4_title2}</span>
                                        <span className="money-before">{content && content.sort3_pr4_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFour;
