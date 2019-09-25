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
        const {shopModelArr: {picurl, content}} = this.props;
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeFourContent">
                    {/* <div className="shopHomFourBanner"><img src={shopModelArr.picurl[1]} alt=""/></div>
                    <div className="newImgShow">
                        <div className="newImgShowRt fl">
                            <h3>{shopModelArr.content.sort1_title1}</h3>
                            <a href="javaScripe:;"><img src={shopModelArr.picurl[2]} alt=""/></a>
                            <div className="newImgShowRT-bottom">
                                <div>54656</div>
                                <div>
                                    <span>122</span>
                                    <span>120</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hotRank" style={{background: shopModelArr.content.bg_color}}>
                        <div className="comTitle4">
                            <h2>{shopModelArr.content.sort2_title1}</h2>
                            <p/>
                            <h3>{shopModelArr.content.sort2_title2}</h3>
                        </div>
                        <div className="rankImg">
                            <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[3]} alt=""/>
                            <div className="rankImgInfo">
                                <p style={{background: shopModelArr.content.bg_color}}>{shopModelArr.content.sort2_pr1_title1}</p>
                                <p style={{background: shopModelArr.content.bg_color}}><span>{shopModelArr.content.sort2_pr1_title2}</span>{shopModelArr.content.sort2_pr1_title3}<i>{shopModelArr.content.sort2_pr1_title4}</i></p>
                            </div>
                        </div>
                        <ul>
                            <li onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)}>
                                <img src={shopModelArr.picurl[4]} alt=""/>
                                <div>
                                    <div>大萨达</div>
                                    <div>
                                        <span>456</span><span>35456</span>
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)}>
                                <img src={shopModelArr.picurl[5]} alt=""/>
                                <div>
                                    <div>大萨达</div>
                                    <div>
                                        <span>456</span><span>35456</span>
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)}>
                                <img src={shopModelArr.picurl[6]} alt=""/>
                                <div>
                                    <div>大萨达</div>
                                    <div>
                                        <span>456</span><span>35456</span>
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)}>
                                <img src={shopModelArr.picurl[7]} alt=""/>
                                <div>
                                    <div>大萨达</div>
                                    <div>
                                        <span>456</span><span>35456</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="hotRank2">
                        <div className="comTitle4">
                            <h2>{shopModelArr.content.sort3_title1}</h2>
                            <p/>
                            <h3>{shopModelArr.content.sort3_title2}</h3>
                        </div>
                        <ul>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort3_pr1_id)} src={shopModelArr.picurl[8]} alt=""/>
                                <i style={{background: shopModelArr.content.bg_color}}>{shopModelArr.content.sort3_pr1_title1}</i>
                                <p className="price"><span>{shopModelArr.content.sort3_pr1_title2}</span><span>{shopModelArr.content.sort3_pr1_title3}</span></p>
                            </li>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort3_pr2_id)} src={shopModelArr.picurl[9]} alt=""/>
                                <i style={{background: shopModelArr.content.bg_color}}>{shopModelArr.content.sort3_pr2_title1}</i>
                                <p className="price"><span>{shopModelArr.content.sort3_pr2_title2}</span><span>{shopModelArr.content.sort3_pr2_title3}</span></p>
                            </li>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort3_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <i style={{background: shopModelArr.content.bg_color}}>{shopModelArr.content.sort3_pr3_title1}</i>
                                <p className="price"><span>{shopModelArr.content.sort3_pr3_title2}</span><span>{shopModelArr.content.sort3_pr3_title3}</span></p>
                            </li>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort3_pr4_id)} src={shopModelArr.picurl[11]} alt=""/>
                                <i style={{background: shopModelArr.content.bg_color}}>{shopModelArr.content.sort3_pr4_title1}</i>
                                <p className="price"><span>{shopModelArr.content.sort3_pr4_title2}</span><span>{shopModelArr.content.sort3_pr4_title3}</span></p>
                            </li>
                        </ul>
                    </div> */}

                    <div className="compile-box">
                        <div className={(picurl && picurl.length === 0) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl[0]})` : '', backgroundSize: '100% 100%'}}>
                            <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                        </div>
                        {
                            content && (
                                <Carousel className="banner">
                                    {
                                        content.banner.length > 0 ? content.banner.map(item => <img key={item} onClick={() => this.clickOnShow('two')} className={(content.banner.every(value => value.id !== '') && content.banner.every(value => value.url)) ? '' : 'no-edit-model'} src={item.url}/>) : <div className={content.banner.length === 0 ? 'banner-img no-edit-model' : 'banner-img'} onClick={() => this.clickOnShow('two')}/>
                                    }
                                </Carousel>
                            )
                        }
                        <div className="new-box" onClick={() => this.clickOnShow('four')}>
                            <div className="new-left"/>
                            <div className={(picurl && content && picurl[content.sort1_pr1_ix] && content.sort1_pr1_title1 && content.sort1_pr1_title2 && content.sort1_pr1_title3) ? 'new-right' : 'new no-edit-model'}>
                                <div className="fresh">NEW</div>
                                <img src={picurl && picurl[content.sort1_pr1_ix]} alt=""/>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort1_pr1_title1}</div>
                                    <div className="price">
                                        <span>￥<span>{content && content.sort1_pr1_title2}</span></span>
                                        <span>{content && content.sort1_pr1_title3}</span>
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
                                            <span>￥<span>{content && content.sort2_pr1_title2}</span></span>
                                            <span>{content && content.sort2_pr1_title3}</span>
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
                                            <span>￥<span>{content && content.sort2_pr2_title2}</span></span>
                                            <span>{content && content.sort2_pr2_title3}</span>
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
                                            <span>￥<span>{content && content.sort2_pr3_title2}</span></span>
                                            <span>{content && content.sort2_pr3_title3}</span>
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
                                            <span>￥<span>{content && content.sort2_pr4_title2}</span></span>
                                            <span>{content && content.sort2_pr4_title3}</span>
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
                                            <span>￥<span>{content && content.sort2_pr5_title2}</span></span>
                                            <span>{content && content.sort2_pr5_title3}</span>
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
                                        <span>￥<span>{content && content.sort3_pr1_title2}</span></span>
                                        <span>{content && content.sort3_pr1_title3}</span>
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
                                        <span>￥<span>{content && content.sort2_pr3_title2}</span></span>
                                        <span>{content && content.sort3_pr2_title3}</span>
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
                                        <span>￥<span>{content && content.sort3_pr3_title2}</span></span>
                                        <span>{content && content.sort3_pr3_title3}</span>
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
                                        <span>￥<span>{content && content.sort3_pr4_title2}</span></span>
                                        <span>{content && content.sort3_pr4_title3}</span>
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
