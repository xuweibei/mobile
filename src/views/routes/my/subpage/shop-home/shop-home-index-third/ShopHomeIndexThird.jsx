
/**
 * 店铺模板3
 */
import PropTypes from 'prop-types';
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
        const {shopModelArr} = this.props;
        console.log(shopModelArr);
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeThirdContent">
                    <div className="shopHomThirdBanner"><img src={shopModelArr.picurl[0]} alt=""/></div>
                    <div className="hotClassify">
                        <div className="comTitle3">
                            <h2>{shopModelArr.content.sort1_title1}</h2>
                            <h3>{shopModelArr.content.sort1_title2}</h3>
                        </div>
                        <ul>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[2]} alt=""/>
                                <div className="hotSellInfo">
                                    <h4>{shopModelArr.content.sort1_pr1_title1}</h4>
                                    <h5>
                                        {shopModelArr.content.sort1_pr1_title2}
                                        <span>{shopModelArr.content.sort1_pr1_title3}</span>
                                    </h5>
                                    {/* <p>{shopModelArr.content.sort1_pr1_title3}<span>{shopModelArr.content.sort1_pr1_title4}</span></p>
                                    <span onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)}>{shopModelArr.content.sort1_pr1_title5}</span> */}
                                </div>
                            </li>
                            <li>
                                <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} src={shopModelArr.picurl[3]} alt=""/>
                                <div className="hotSellInfo">
                                    <h4>{shopModelArr.content.sort1_pr2_title1}</h4>
                                    <h5>{shopModelArr.content.sort1_pr2_title2}<span>{shopModelArr.content.sort1_pr2_title3}</span></h5>
                                    {/* <p>{shopModelArr.content.sort1_pr2_title4}<span>{shopModelArr.content.sort1_pr2_title5}</span></p>
                                    <span onClick={() => this.goToGoods(shopModelArr.content.sort1_pr2_id)} className="spanBg">{shopModelArr.content.sort1_pr2_title6}</span> */}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="classifyEntry">
                        <div className="comTitle3">
                            <h2>{shopModelArr.content.sort2_title1}</h2>
                            <h3>{shopModelArr.content.sort2_title2}</h3>
                        </div>
                        {/* <ul className="classifyNav">
                            <li>
                                <img src={shopModelArr.picurl[3]} alt=""/>
                                <div>
                                    <p>Chiffon</p>
                                    <p>雪纺衫</p>
                                </div>

                            </li>
                            <li>
                                <img src={shopModelArr.picurl[4]} alt=""/>
                                <div>
                                    <p>Chiffon</p>
                                    <p>雪纺衫</p>
                                </div>

                            </li>
                            <li>
                                <img src={shopModelArr.picurl[5]} alt=""/>
                                <div>
                                    <p>Chiffon</p>
                                    <p>雪纺衫</p>
                                </div>

                            </li>
                            <li>
                                <img src={shopModelArr.picurl[6]} alt=""/>
                                <div>
                                    <p>Chiffon</p>
                                    <p>雪纺衫</p>
                                </div>

                            </li>
                        </ul> */}
                        <div className="classifyEntryCon">
                            <div className="classifyEntryConMid">
                                <div className="classifyEntryConMidRt fl">
                                    <div><img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[8]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr3_title1}<i>{shopModelArr.content.sort2_pr3_title2}</i></span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr2_title3}</p>
                                        <div className="price">
                                            <span>{shopModelArr.content.sort2_pr2_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr3_title5}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className="classifyEntryConMidLt fl">
                                    <div className="classifyEntryBigImg"><img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[7]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr2_title1}<i>{shopModelArr.content.sort2_pr2_title2}</i></span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr2_title3}</p>
                                        <div className="price">
                                            <span>{shopModelArr.content.sort2_pr2_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr2_title5}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="classifyEntryConTop">
                                <div className="classifyEntryConTopLt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[4]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <h5 className="dePriceActive">{shopModelArr.content.sort2_pr1_title1}</h5>
                                            {/* <span>5折价:<i>298</i></span> */}
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr1_title3}<span>{shopModelArr.content.sort2_pr1_title2}</span></p>
                                        {/* <div className="price">
                                            <span>{shopModelArr.content.sort2_pr1_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr1_title5}</span>
                                        </div> */}

                                    </div>
                                </div>
                                {/* <div className="classifyEntryConTopRt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[5]} alt=""/>
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[6]} alt="" className="act"/>
                                </div> */}
                                <div className="classifyEntryConTopLt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[4]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr1_title1}</span>
                                            {/* <span>5折价:<i>298</i></span> */}
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr1_title3}<span>{shopModelArr.content.sort2_pr1_title2}</span></p>
                                        {/* <div className="price">
                                            <span>{shopModelArr.content.sort2_pr1_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr1_title5}</span>
                                        </div> */}

                                    </div>
                                </div>
                            </div>
                            <div className="classifyEntryConMid2">
                                <div className="classifyEntryConMid2Lt fl">
                                    <div className="classifyEntryBigImg2"><img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[9]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr4_title1}</span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr4_title3}<span>{shopModelArr.content.sort2_pr4_title2}</span></p>
                                        {/* <div className="price">
                                            <span>{shopModelArr.content.sort2_pr4_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr4_title5}</span>
                                        </div> */}

                                    </div>
                                </div>
                                {/* <div className="classifyEntryConMid2Rt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[10]} alt=""/>
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[11]} alt=""/>
                                </div> */}
                                <div className="classifyEntryConMid2Lt fl">
                                    <div className="classifyEntryBigImg2"><img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[9]} alt=""/></div>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr4_title1}</span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr4_title3}<span>{shopModelArr.content.sort2_pr4_title2}</span></p>
                                        {/* <div className="price">
                                            <span>{shopModelArr.content.sort2_pr4_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr4_title5}</span>
                                        </div> */}

                                    </div>
                                </div>
                            </div>
                            <div className="classifyEntryConBot">
                                <div className="classifyEntryConBotLt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr5_id)} src={shopModelArr.picurl[12]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr5_title1}</span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr5_title3}<span>{shopModelArr.content.sort2_pr5_title2}</span></p>
                                        <div className="price">
                                            <span>{shopModelArr.content.sort2_pr5_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr5_title5}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="classifyEntryConBotLt fl">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr5_id)} src={shopModelArr.picurl[12]} alt=""/>
                                    <div className="imgInfo">
                                        <div className="dePrice">
                                            <span className="dePriceActive">{shopModelArr.content.sort2_pr5_title1}</span>
                                        </div>
                                        <p>{shopModelArr.content.sort2_pr5_title3}<span>{shopModelArr.content.sort2_pr5_title2}</span></p>
                                        <div className="price">
                                            <span>{shopModelArr.content.sort2_pr5_title4}</span>
                                            <span className="act">{shopModelArr.content.sort2_pr5_title5}</span>
                                        </div>
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
