/**
 * 店铺模板2
 */
import PropTypes from 'prop-types';
import {Carousel, WingBlank} from 'antd-mobile';
import './ShopHomeIndexTwo.less';


const {appHistory} = Utils;
//轮播图
const data = [
    {
        index: 1,
        price: 1001
    },
    {
        index: 2,
        price: 102
    },
    {
        index: 3,
        price: 103
    },
    {
        index: 4,
        price: 104
    },
    {
        index: 5,
        price: 105
    }
];

class ShopHomeIndexTwo extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.object.isRequired
    };

    state = {
        selectedIndex: 0
    };

    //走马灯下一页
    shopHomeNext = () => {
        const {selectedIndex} = this.state;
        if (selectedIndex === data.length - 1) {
            this.setState({
                selectedIndex: 0
            });
        } else {
            this.setState((prevState) => ({
                selectedIndex: prevState.selectedIndex + 1
            }));
        }
    }

    //走马灯上一页
    shopHomePrev = () => {
        const {selectedIndex} = this.state;
        if (selectedIndex === 0) {
            this.setState({
                selectedIndex: 4
            });
        } else {
            this.setState((prevState) => ({
                selectedIndex: prevState.selectedIndex - 1
            }));
        }
    }

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {selectedIndex} = this.state;
        const {shopModelArr} = this.props;
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeTwoContent">
                    <div className="shopHomeTwoBanner"><img src={shopModelArr.picurl[1]} alt=""/></div>
                    <div className="newRecommend shopHomeTwoContentPadding">
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{shopModelArr.content.sort1_title1}</div>
                            <p>{shopModelArr.content.sort1_title2}</p>
                        </div>
                        <div className="newRecommendCon">
                            <div className="newRecommendConImg">
                                <div className="newRecommendConImgLeft">
                                    <div className="newArrivals-one">
                                        <div className="new-img-one">
                                            <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[2]} alt=""/>
                                        </div>
                                        <p>{shopModelArr.content.sort1_pr1_title1}</p>
                                        <span><span>￥</span>{shopModelArr.content.sort1_pr1_title2}</span>
                                    </div>
                                    <div className="newArrivals-two">
                                        <div className="new-img-two">
                                            <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr4_id)} src={shopModelArr.picurl[5]} alt=""/>
                                        </div>
                                        <p>{shopModelArr.content.sort1_pr4_title1}</p>
                                        <span><span>￥</span>{shopModelArr.content.sort1_pr4_title2}</span>
                                    </div>
                                </div>
                                <div className="newRecommendConImgRight">
                                    <div className="newArrivals-two">
                                        <div className="new-img-two">
                                            <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr1_id)} src={shopModelArr.picurl[3]} alt=""/>
                                        </div>
                                        <p>{shopModelArr.content.sort1_pr2_title1}</p>
                                        <span><span>￥</span>{shopModelArr.content.sort1_pr2_title2}</span>
                                    </div>
                                    <div className="newArrivals-one">
                                        <div className="new-img-one">
                                            <img onClick={() => this.goToGoods(shopModelArr.content.sort1_pr3_id)} src={shopModelArr.picurl[4]} alt=""/>
                                        </div>
                                        <p>{shopModelArr.content.sort1_pr3_title1}</p>
                                        <span><span>￥</span>{shopModelArr.content.sort1_pr3_title2}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="discountArea shopHomeTwoContentPadding">
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{shopModelArr.content.sort2_title1}</div>
                            <p>{shopModelArr.content.sort2_title2}</p>
                        </div>
                        <div className="discountAreaCon">
                            <div className="discountAreaConItem">
                                <div className="discount-img">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr1_id)} src={shopModelArr.picurl[6]} alt=""/>
                                </div>
                                <p>{shopModelArr.content.sort2_pr1_title1}</p>
                                <div className="price">
                                    <span><span>￥</span>{shopModelArr.content.sort2_pr1_title3}</span>
                                    <span>{shopModelArr.content.sort2_pr1_title2}</span>
                                </div>
                            </div>

                            <div className="discountAreaConItem">
                                <div className="discount-img">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr2_id)} src={shopModelArr.picurl[7]} alt=""/>
                                </div>
                                <p>{shopModelArr.content.sort2_pr2_title1}</p>
                                <div className="price">
                                    <span><span>￥</span>{shopModelArr.content.sort2_pr2_title3}</span>
                                    <span>{shopModelArr.content.sort2_pr2_title2}</span>
                                </div>
                            </div>
                            <div className="discountAreaConItem">
                                <div className="discount-img">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr3_id)} src={shopModelArr.picurl[8]} alt=""/>
                                </div>
                                <p>{shopModelArr.content.sort2_pr3_title1}</p>
                                <div className="price">
                                    <span><span>￥</span>{shopModelArr.content.sort2_pr3_title3}</span>
                                    <span>{shopModelArr.content.sort2_pr3_title2}</span>
                                </div>
                            </div>
                            <div className="discountAreaConItem">
                                <div className="discount-img">
                                    <img onClick={() => this.goToGoods(shopModelArr.content.sort2_pr4_id)} src={shopModelArr.picurl[9]} alt=""/>
                                </div>
                                <p>{shopModelArr.content.sort2_pr4_title1}</p>
                                <div className="price">
                                    <span><span>￥</span>{shopModelArr.content.sort2_pr4_title3}</span>
                                    <span>{shopModelArr.content.sort2_pr4_title2}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hotRecommend shopHomeTwoContentPadding">
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{shopModelArr.content.sort3_title1}</div>
                            <p>{shopModelArr.content.sort3_title2}</p>
                        </div>
                        <div className="hotSellRecommendCon" style={{background: shopModelArr.content.bg_color}}>
                            <div className="hotSellImg">
                                <WingBlank>
                                    <Carousel
                                        autoplay
                                        selectedIndex={selectedIndex}
                                        infinite
                                    >
                                        {shopModelArr && shopModelArr.banner && shopModelArr.banner.length > 0 && shopModelArr.banner.map(item  => (
                                        // {shopModelArr.banner && shopModelArr.banner.map(item  => (
                                            <div
                                                className="hotSellImgItem fl"
                                                key={item}
                                            >
                                                <img
                                                    src={item}
                                                    alt=""
                                                    onClick={() => this.goToGoods(shopModelArr.content.sort3_pr1_id)}
                                                />
                                                <p>{shopModelArr.content.sort3_pr1_title3}</p>
                                                <div
                                                    onClick={() => this.goToGoods(shopModelArr.content.sort3_pr1_id)}
                                                    style={{background: shopModelArr.content.bg_color}}
                                                ><p>{shopModelArr.content.sort3_pr1_title1}<span>456</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </Carousel>
                                </WingBlank>
                            </div>
                            <div className="checkBtn">
                                <i className="icon pre" onClick={this.shopHomePrev}/>
                                <i className="icon next" onClick={this.shopHomeNext}/>
                            </div>
                        </div>
                    </div>
                    {/* <div className="shopNotice">
                        <div>
                            <h2><i/>店铺の公告<i className="noticeDot"/></h2>
                            <h3>shop notices</h3>
                            <span/>
                            <p>亲们欢迎光临本店，祝您购物愉快</p>
                            <p> 本店默认韵达快递，如不到或者需要其他快递请联系客服</p>
                            <p> 本店已加入消费者保障服务，支持七天无理由退换</p>
                            <p>本店所有商品均为实物拍摄，可能会有些许色差介意慎拍</p>
                            <p>器亲，如果满意我们的服务请给五星好评哦！</p>
                        </div>
                    </div>
                    <div className="serverShow">
                        <div className="serverShowItem">
                            <i/>
                            <p>闪电发货</p>
                        </div>
                        <div className="serverShowItem">
                            <i/>
                            <p>闪电发货</p>
                        </div>
                        <div className="serverShowItem">
                            <i/>
                            <p>闪电发货</p>
                        </div>
                        <div className="serverShowItem">
                            <i/>
                            <p>闪电发货</p>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexTwo;
