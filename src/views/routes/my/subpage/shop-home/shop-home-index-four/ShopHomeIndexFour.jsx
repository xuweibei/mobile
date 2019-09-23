/**
 * 店铺模板4
 */
import PropTypes from 'prop-types';
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
        const {shopModelArr} = this.props;
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeFourContent">
                    <div className="shopHomFourBanner"><img src={shopModelArr.picurl[1]} alt=""/></div>
                    <div className="newImgShow">
                        {/*FIXME: 不要用ul*/}
                        {/* 已注释 */}
                        <ul className="fl" style={{background: shopModelArr.content.bg_color}}>
                            {/* <li><p>COAT</p><span>外套 / 风衣</span></li>
                            <li><p>COAT</p><span>外套 / 风衣 </span></li>
                            <li><p>COAT</p><span>外套 / 风衣 </span></li>
                            <li><p>COAT</p><span>外套 / 风衣</span></li> */}
                        </ul>
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
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFour;
