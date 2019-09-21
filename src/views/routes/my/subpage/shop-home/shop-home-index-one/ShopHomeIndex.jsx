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
        console.log(shopModelArr, '乐山大佛恢复健康');
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
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr1_ix]} alt=""/>
                                <div className="priceInfo">
                                    <div className="infoLeft">
                                        <p className="shopTitleSmall">{shopModelArr.content.sort1_pr1_title1}</p>
                                    </div>
                                    <div className="fr">{shopModelArr.content.sort1_pr1_title2}<span>{shopModelArr.content.sort1_pr1_title3}</span></div>
                                </div>
                            </div>
                            <div className="top">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[shopModelArr.content.sort1_pr2_ix]} alt=""/>
                                <div className="priceInfo">
                                    <div className="infoLeft">
                                        <p className="shopTitleSmall">{shopModelArr.content.sort1_pr2_title1}</p>
                                    </div>
                                    <div className="fr">{shopModelArr.content.sort1_pr2_title2}<span>{shopModelArr.content.sort1_pr2_title3}</span></div>
                                </div>
                            </div>
                            {/* <div className="hotImgBottom">
                                <div className="bottomImg">
                                    <div className="bottomImgLeft fl">
                                        <div className="marginBot"><img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/></div>
                                        <div><img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[5]} alt=""/></div>
                                    </div>
                                    <div className="bottomImgRight fl"><img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[6]} alt=""/></div>
                                </div>
                                <div className="priceInfo">
                                    <p>{shopModelArr.content.sort1_pr3_title1}</p>
                                    <strong className="shopPeiceSmall">{shopModelArr.content.sort1_pr3_title2}<span>{shopModelArr.content.sort1_pr3_title3}</span></strong>
                                    <div onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    <div className="commodity-title-two" style={{backgroundColor: shopModelArr.content && shopModelArr.content.bg_color}}>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr1_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr1_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr1_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr1_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr2_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr2_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr2_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr2_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr3_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr3_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr3_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr3_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr8_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr4_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr4_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr4_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr4_title3}</span>
                            </div>
                        </div>
                    </div>

                    <div className="commodity-title-two">
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr5_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr5_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr5_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr5_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr5_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr6_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr6_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr6_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr6_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr6_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr7_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr7_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr7_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr7_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr7_title3}</span>
                            </div>
                        </div>
                        <div className="commodity-two" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr8_id)}>
                            <img src={shopModelArr.picurl && shopModelArr.picurl[shopModelArr.content.sort2_pr8_ix]} alt=""/>
                            <div className="two-headline">{shopModelArr.content && shopModelArr.content.sort2_pr8_title1}</div>
                            <div className="two-price">
                                <span>{shopModelArr.content && shopModelArr.content.sort2_pr8_title2}</span>
                                <span className="price">{shopModelArr.content && shopModelArr.content.sort2_pr8_title3}</span>
                            </div>
                        </div>
                    </div>
                    {/* <div className="items">
                        <div className="title">
                            <h2>{shopModelArr.content.sort2_title1}</h2>
                            <h3>{shopModelArr.content.sort2_title2}</h3>
                        </div>
                        <div className="newImgShow">
                            <div className="top">
                                <div style={{background: shopModelArr.content.bg_color}} className="newImgShowRight fl">
                                    <div className="newImgShowLeft fl"> <img src={shopModelArr.picurl[7]} alt=""/></div>
                                    <img className="newImg1" onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[8]} alt=""/>
                                    <div className="priceInfo">
                                        <p>{shopModelArr.content.sort2_pr2_title1}</p>
                                        <strong className="shopPeiceSmall">{shopModelArr.content.sort2_pr2_title2}<span>{shopModelArr.content.sort2_pr2_title3}</span></strong>
                                        <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} className="textTip fr">{shopModelArr.content.buy_name}</div>
                                    </div>
                                    <div className="imgNice">
                                        <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} className="newImg2" src={shopModelArr.picurl[9]} alt=""/>
                                        <div className="priceInfoS">
                                            <p>{shopModelArr.content.sort2_pr2_title1}</p>
                                            <strong className="shopPeiceSmall">{shopModelArr.content.sort2_pr2_title2}<span>{shopModelArr.content.sort2_pr2_title3}</span></strong>
                                            <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} className="textTip">{shopModelArr.content.buy_name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="newImgBottom">
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[10]} alt=""/>
                                <div className="priceInfo">
                                    <p>{shopModelArr.content.sort2_pr3_title1}</p>
                                    <strong className="shopPeiceSmall">{shopModelArr.content.sort2_pr3_title2}<span>{shopModelArr.content.sort2_pr3_title3}</span></strong>
                                    <div onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} className="textTip fr">{shopModelArr.content.buy_name}</div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
