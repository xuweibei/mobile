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
        const {shopModelArr: {content, picurl}} = this.props;
        const discountList = [
            content.sort2_pr1_ix,
            content.sort2_pr2_ix,
            content.sort2_pr3_ix,
            content.sort2_pr4_ix
        ];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeTwoContent">
                    <div className="shopHomeTwoBanner">
                        <WingBlank>
                            <Carousel
                                className="my-carousel"
                                autoplay
                                infinite
                                speed={2000}
                            >
                                {
                                    content && picurl && content && content.banner.map(item => (
                                        <div key={item} style={{height: '475px'}}>
                                            <img src={item.url} onClick={() => this.goToGoods(item.id)} title="693"/>
                                        </div>
                                    ))
                                }
                            </Carousel>
                        </WingBlank>
                    </div>
                    <div className="newRecommend shopHomeTwoContentPadding" style={{marginTop: '30px'}}>
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{content.sort1_title1}</div>
                            <p>{content.sort1_title2}</p>
                        </div>
                        <div className="newRecommendCon">
                            <div className="newRecommendConImg">
                                <div className="newRecommendConImgLeft">
                                    <div className="newArrivals-one">
                                        <div className="new-img-one">
                                            <img onClick={() => this.goToGoods(content.sort1_pr1_id)} src={picurl[1]} alt=""/>
                                        </div>
                                        <p>{content.sort1_pr1_title1}</p>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-new">{content.sort1_pr1_title2}</span>
                                            <span className="money-before">{content.sort1_pr1_title3}</span>
                                        </div>
                                    </div>
                                    <div className="newArrivals-two">
                                        <div className="new-img-two">
                                            <img onClick={() => this.goToGoods(content.sort1_pr2_id)} src={picurl[2]} alt=""/>
                                        </div>
                                        <p>{content.sort1_pr2_title1}</p>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-new">{content.sort1_pr2_title2}</span>
                                            <span className="money-before">{content.sort1_pr2_title3}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="newRecommendConImgRight">
                                    <div className="newArrivals-two">
                                        <div className="new-img-two">
                                            <img onClick={() => this.goToGoods(content.sort1_pr3_id)} src={picurl[3]} alt=""/>
                                        </div>
                                        <p>{content.sort1_pr3_title1}</p>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-new">{content.sort1_pr3_title2}</span>
                                            <span className="money-before">{content.sort1_pr3_title3}</span>
                                        </div>
                                    </div>
                                    <div className="newArrivals-one">
                                        <div className="new-img-one">
                                            <img onClick={() => this.goToGoods(content.sort1_pr4_id)} src={picurl[4]} alt=""/>
                                        </div>
                                        <p>{content.sort1_pr4_title1}</p>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-new">{content.sort1_pr4_title2}</span>
                                            <span className="money-before">{content.sort1_pr4_title3}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="discountArea shopHomeTwoContentPadding">
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{content.sort2_title1}</div>
                            <p>{content.sort2_title2}</p>
                        </div>
                        <div className="discountAreaCon">
                            {
                                discountList.map(item => (
                                    <div className="discountAreaConItem" key={item}>
                                        <div className="discount-img">
                                            <img onClick={() => this.goToGoods(content[`sort2_pr${item - 4}_id`])} src={picurl[item]} alt=""/>
                                        </div>
                                        <p>{content[`sort2_pr${item - 4}_title1`]}</p>
                                        <div className="price">
                                            <span className="money-ZH">￥</span>
                                            <span className="money-new">{content[`sort2_pr${item - 4}_title2`]}</span>
                                            <span className="money-before">{content[`sort2_pr${item - 4}_title3`]}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="hotRecommend shopHomeTwoContentPadding">
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{content.sort3_title1}</div>
                            <p>{content.sort3_title2}</p>
                        </div>
                        <div className="hotSellRecommendCon" style={{background: content.bg_color}}>
                            <div className="hotSellImg">
                                <WingBlank>
                                    <Carousel
                                        autoplay
                                        selectedIndex={selectedIndex}
                                        infinite
                                    >
                                        {content && content.pr_banner && content.pr_banner.length > 0 && content.pr_banner.map(item  => (
                                        // {banner && banner.map(item  => (
                                            <div className="pr_banner_bottom" key={item}>
                                                <img
                                                    src={item.url}
                                                    alt=""
                                                    onClick={() => this.goToGoods(item.id)}
                                                />
                                                <div className="introduce">
                                                    <div className="introduce-title">{item.title1}</div>
                                                    <div
                                                        onClick={() => this.goToGoods(item.id)}
                                                        style={{background: content.bg_color}}
                                                    >
                                                        <span className="money-ZH">￥</span>
                                                        <span className="money-now">{item.title2}</span>
                                                        <span className="money-before">{item.title3}</span>
                                                    </div>
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
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexTwo;
