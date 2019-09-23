
/**
 * 店铺模板3
 */
import PropTypes from 'prop-types';
import {Carousel} from 'antd-mobile';
import './ShopHomeIndexThird.less';

const {appHistory} = Utils;

class ShopHomeIndexThird extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr: {content, picurl}, shopModelArr} = this.props;
        console.log(shopModelArr);
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeThirdContent">
                    {/* <div className="shopHomThirdBanner"><img src={picurl[0]} alt=""/></div>
                    <div className="hotClassify">
                        <div className="comTitle3">
                            <h2>{content.sort1_title1}</h2>
                            <h3>{content.sort1_title2}</h3>
                        </div>
                        <ul>
                            <li>
                                <img onClick={() => this.goToGoods(content.sort1_pr1_id)} src={picurl[2]} alt=""/>
                                <div className="hotSellInfo">
                                    <h4>{content.sort1_pr1_title1}</h4>
                                    <h5>{content.sort1_pr1_title2}</h5>
                                    <p>{content.sort1_pr1_title3}<span>{content.sort1_pr1_title4}</span></p>
                                    <span onClick={() => this.goToGoods(content.sort1_pr1_id)}>{content.sort1_pr1_title5}</span>
                                </div>
                            </li>
                            <li>
                                <img onClick={() => this.goToGoods(content.sort1_pr2_id)} src={picurl[3]} alt=""/>
                                <div className="hotSellInfo">
                                    <h4>{content.sort1_pr2_title1}</h4>
                                    <h5>{content.sort1_pr2_title2}<span>{content.sort1_pr2_title3}</span></h5>
                                    <p>{content.sort1_pr2_title4}<span>{content.sort1_pr2_title5}</span></p>
                                    <span onClick={() => this.goToGoods(content.sort1_pr2_id)} className="spanBg">{content.sort1_pr2_title6}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="classifyEntry">
                        <div className="comTitle3">
                            <h2>{content.sort2_title1}</h2>
                            <h3>{content.sort2_title2}</h3>
                        </div>
                        <div className="classifyEntryCon">
                            <div className="classifyEntryConTop">
                                <div className="classifyEntryConTopLt fl">
                                    <img onClick={() => this.goToGoods(content.sort2_pr1_id)} src={picurl[4]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{content.sort2_pr1_title1}<i>{content.sort2_pr1_title2}</i></span>
                                        </div>
                                        <p>{content.sort2_pr1_title3}</p>
                                        <div className="price">
                                            <span>{content.sort2_pr1_title4}</span>
                                            <span className="act">{content.sort2_pr1_title5}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className="classifyEntryConTopRt fl">
                                    <img onClick={() => this.goToGoods(content.sort2_pr1_id)} src={picurl[5]} alt=""/>
                                    <img onClick={() => this.goToGoods(content.sort2_pr1_id)} src={picurl[6]} alt="" className="act"/>
                                </div>
                            </div>
                            <div className="classifyEntryConMid">
                                <div className="classifyEntryConMidLt fl">
                                    <div className="classifyEntryBigImg"><img onClick={() => this.goToGoods(content.sort2_pr2_id)} src={picurl[7]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{content.sort2_pr2_title1}<i>{content.sort2_pr2_title2}</i></span>
                                        </div>
                                        <p>{content.sort2_pr2_title3}</p>
                                        <div className="price">
                                            <span>{content.sort2_pr2_title4}</span>
                                            <span className="act">{content.sort2_pr2_title5}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="classifyEntryConMidRt fl">
                                    <div><img onClick={() => this.goToGoods(content.sort2_pr3_id)} src={picurl[8]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{content.sort2_pr3_title1}<i>{content.sort2_pr3_title2}</i></span>
                                        </div>
                                        <p>{content.sort2_pr2_title3}</p>
                                        <div className="price">
                                            <span>{content.sort2_pr2_title4}</span>
                                            <span className="act">{content.sort2_pr3_title5}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="classifyEntryConMid2">
                                <div className="classifyEntryConMid2Lt fl">
                                    <div className="classifyEntryBigImg2"><img onClick={() => this.goToGoods(content.sort2_pr4_id)} src={picurl[9]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{content.sort2_pr4_title1}<i>{content.sort2_pr4_title2}</i></span>
                                        </div>
                                        <p>{content.sort2_pr4_title3}</p>
                                        <div className="price">
                                            <span>{content.sort2_pr4_title4}</span>
                                            <span className="act">{content.sort2_pr4_title5}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className="classifyEntryConMid2Rt fl">
                                    <img onClick={() => this.goToGoods(content.sort2_pr4_id)} src={picurl[10]} alt=""/>
                                    <img onClick={() => this.goToGoods(content.sort2_pr4_id)} src={picurl[11]} alt=""/>
                                </div>
                            </div>
                            <div className="classifyEntryConBot">
                                <div className="classifyEntryConBotLt fl">
                                    <img onClick={() => this.goToGoods(content.sort2_pr5_id)} src={picurl[12]} alt=""/>
                                </div>
                                <div className="classifyEntryConBotRt fl">
                                    <img onClick={() => this.goToGoods(content.sort2_pr5_id)} src={picurl[13]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{content.sort2_pr5_title1}<i>{content.sort2_pr5_title2}</i></span>
                                        </div>
                                        <p>{content.sort2_pr5_title3}</p>
                                        <div className="price">
                                            <span>{content.sort2_pr5_title4}</span>
                                            <span className="act">{content.sort2_pr5_title5}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="compile-box">
                        <div className={(picurl && picurl.length === 0) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl[0]})` : '', backgroundSize: '100% 100%'}}>
                            <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                        </div>
                        {
                            content && (
                                <Carousel>
                                    {
                                        content.banner.length > 0 ? content.banner.map(item => <img key={item} onClick={() => this.clickOnShow('two')} className={(content.banner.every(value => value.id !== '') && content.banner.every(value => value.url)) ? '' : 'no-edit-model'} src={item.url}/>) : <div className={content.banner.length === 0 ? 'banner-img no-edit-model' : 'banner-img'} onClick={() => this.clickOnShow('two')}/>
                                    }
                                </Carousel>
                            )
                        }
                        <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                            {/* <p className={(content && content.sort1_title1) ? 'time' : 'time no-edit-model'}>{content && (content.sort1_title1 || '2018/5/20')}</p> */}
                            <p className={(content && content.sort1_title1) ? 'hot' : 'hot no-edit-model'}>{content && (content.sort1_title1 || 'POPULAR COMMODITY')}</p>
                            <p className={(content && content.sort1_title2) ? 'fiery' : 'fiery no-edit-model'}>{content && (content.sort1_title2 || '热门商品')}</p>
                        </div>
                        <div className="hot-box" onClick={() => this.clickOnShow('four')}>
                            <div className={(picurl && content && picurl[content.sort1_pr1_ix] && content.sort1_pr1_title1 && content.sort1_pr1_title2 && content.sort1_pr1_title3) ? 'hot' : 'hot no-edit-model'}>
                                <div className="commodity-img">
                                    <img src={picurl && picurl[content.sort1_pr1_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort1_pr1_title1}</div>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort1_pr1_title2}</span></span>
                                        <span>{content && content.sort1_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort1_pr2_ix] && content.sort1_pr1_title1 && content.sort1_pr1_title2 && content.sort1_pr1_title3) ? 'hot' : 'hot no-edit-model'}>
                                <div className="commodity-img">
                                    <img src={picurl && picurl[content.sort1_pr2_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort1_pr2_title1}</div>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort1_pr2_title2}</span></span>
                                        <span>{content && content.sort1_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={(content && content.sort2_title1 && content.sort2_title2) ? 'title-bar' : 'title-bar no-edit-model'} onClick={() => this.clickOnShow('six')}>
                            <p className="hot">{content && (content.sort2_title1 || '热销榜单')}</p>
                            <p className="fiery">{content && (content.sort2_title2 || 'SUPER HOT SALE')}</p>
                        </div>
                        <div className="sell-box" onClick={() => this.clickOnShow('five')}>
                            <div className={(picurl && content && picurl[content.sort2_pr1_ix] && content.sort2_pr1_title1 && content.sort2_pr1_title2 && content.sort2_pr1_title3) ? 'sell' : 'sell no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr1_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr1_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr1_title2}</span></span>
                                        <span>{content && content.sort2_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort2_pr2_ix] && content.sort2_pr2_title1 && content.sort2_pr2_title2 && content.sort2_pr2_title3) ? 'sell' : 'sell no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr2_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr2_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr2_title2}</span></span>
                                        <span>{content && content.sort2_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sell-one-box" onClick={() => this.clickOnShow('five-extra')}>
                            <div className={(picurl && content && picurl[content.sort2_pr3_ix] && content.sort2_pr1_title1 && content.sort2_pr1_title2 && content.sort2_pr1_title3) ? 'sell-one' : 'sell-one no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr3_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr3_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr3_title2}</span></span>
                                        <span>{content && content.sort2_pr3_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort2_pr4_ix] && content.sort2_pr2_title1 && content.sort2_pr1_title2 && content.sort2_pr1_title3) ? 'sell-one' : 'sell-one no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr4_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr4_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr4_title2}</span></span>
                                        <span>{content && content.sort2_pr4_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sell-two-box" onClick={() => this.clickOnShow('seven')}>
                            <div className={(picurl && content && picurl[content.sort2_pr5_ix] && content.sort2_pr5_title1 && content.sort2_pr5_title2 && content.sort2_pr5_title3) ? 'sell-two' : 'sell-two no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr5_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr5_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr5_title2}</span></span>
                                        <span>{content && content.sort2_pr5_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort2_pr6_ix] && content.sort2_pr6_title1 && content.sort2_pr6_title2 && content.sort2_pr6_title3) ? 'sell-two' : 'sell-two no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr6_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr6_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr6_title2}</span></span>
                                        <span>{content && content.sort2_pr6_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort2_pr7_ix] && content.sort2_pr7_title1 && content.sort2_pr7_title2 && content.sort2_pr7_title3) ? 'sell-two' : 'sell-two no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr7_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr7_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr7_title2}</span></span>
                                        <span>{content && content.sort2_pr7_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={(picurl && content && picurl[content.sort2_pr8_ix] && content.sort2_pr8_title1 && content.sort2_pr8_title2 && content.sort2_pr8_title3) ? 'sell-two' : 'sell-two no-edit-model'}>
                                <div>
                                    <img src={picurl && picurl[content.sort2_pr8_ix]} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <p className="headline">{content && content.sort2_pr8_title1}</p>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort2_pr8_title2}</span></span>
                                        <span>{content && content.sort2_pr8_title3}</span>
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


export default ShopHomeIndexThird;
