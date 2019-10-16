/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import './ShopHomeIndex.less';
import {Carousel, WingBlank} from 'antd-mobile';

const {appHistory} = Utils;

class ShopHomeIndex extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr: {content, picurl}} = this.props;
        const hotSellList = [
            {
                id: content.sort1_pr1_id,
                pic: picurl[1],
                unit: '￥',
                title1: content.sort1_pr1_title1,
                title2: content.sort1_pr1_title2,
                title3: content.sort1_pr1_title3
            },
            {
                id: content.sort1_pr2_id,
                pic: picurl[2],
                unit: '￥',
                title1: content.sort1_pr2_title1,
                title2: content.sort1_pr2_title2,
                title3: content.sort1_pr2_title3
            }
        ];
        //新品商品第一部分ix值
        const newSellList1 = [
            content.sort2_pr1_ix,
            content.sort2_pr2_ix,
            content.sort2_pr3_ix,
            content.sort2_pr4_ix
        ];
        //新品商品第二部分ix值
        const newSellList2 = [
            content.sort2_pr5_ix,
            content.sort2_pr6_ix,
            content.sort2_pr7_ix,
            content.sort2_pr8_ix
        ];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeContent">
                    <div style={{background: content.bg_color}} className="shopHomeBanner">
                        {
                            (content && content.banner && content.banner.length > 0) ? (
                                <WingBlank>
                                    <Carousel
                                        className="my-carousel"
                                        autoplay
                                        infinite
                                        speed={2000}
                                    >
                                        {
                                            content.banner.map(item => (
                                                <div key={item} style={{height: '475px'}}>
                                                    <img src={item.url} onClick={() => this.goToGoods(item.id)} title="693"/>
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </WingBlank>
                            ) : <img title="图片"/>
                        }
                    </div>
                    <div className="items" style={{marginTop: '30px'}}>
                        <div className="title">
                            <p className="marginTop">{content.sort1_title1}</p>
                            <h2>{content.sort1_title2}</h2>
                            <h3>{content.sort1_title3}</h3>
                        </div>
                        <div className="hotImgShow">
                            {
                                hotSellList.map(item => (
                                    <div className="top" key={item}>
                                        <img onClick={() => this.goToGoods(item.id)} src={item.pic} alt=""/>
                                        <div className="priceInfo">
                                            <div className="infoLeft">
                                                <p className="shopTitleSmall">{item.title1}</p>
                                                <div className="shopPeiceSmall">
                                                    <span className="money-ZH">{item.unit}</span>
                                                    <span className="money-now">{item.title2}</span>
                                                    <span className="money-before">{item.title3}</span>
                                                </div>
                                            </div>
                                            {/* <div onClick={() => this.goToGoods(content.sort1_pr1_id)} className="textTip fr">{content.buy_name}</div> */}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="items">
                        <div className="title">
                            <h2>{content.sort2_title1}</h2>
                            <h3>{content.sort2_title2}</h3>
                        </div>
                        <div className="hotImgBottom">
                            <div className="bottomImg">
                                {
                                    newSellList1.map(item => (
                                        <div className="bottomImgLeft" key={item}>
                                            <div className="marginBot">
                                                <img onClick={() => this.goToGoods(content[`sort2_pr${item - 2}_id`])} src={picurl[item]} alt=""/>
                                                <div className="margin-bot-box">
                                                    <div className="margin-bot-content-top">{content[`sort2_pr${item - 2}_title1`]}</div>
                                                    <div className="margin-bot-content-bot">
                                                        <span className="money-ZH">￥</span>
                                                        <span className="money-now">{content[`sort2_pr${item - 2}_title2`]}</span>
                                                        <span className="money-before">{content[`sort2_pr${item - 2}_title3`]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="newImgShow">
                            {
                                newSellList2.map(item => (
                                    <div className="newImgBottom" key={item}>
                                        <img onClick={() => this.goToGoods(content[`sort2_pr${item - 2}_id`])} src={picurl[item]} alt=""/>
                                        <div className="priceInfo">
                                            <div className="shop-title-small">{content[`sort2_pr${item - 2}_title1`]}</div>
                                            <div className="shopPeiceSmall">
                                                <span className="money-ZH">￥</span>
                                                <span className="money-now">{content[`sort2_pr${item - 2}_title2`]}</span>
                                                <span className="money-before">{content[`sort2_pr${item - 2}_title3`]}</span>
                                            </div>
                                            {/* <div onClick={() => this.goToGoods(content.sort2_pr3_id)} className="textTip fr">{content.buy_name}</div> */}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
