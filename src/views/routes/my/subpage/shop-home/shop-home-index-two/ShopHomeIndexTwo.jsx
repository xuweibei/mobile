/**
 * 店铺模板2
 */
import PropTypes from 'prop-types';
import {Carousel, WingBlank} from 'antd-mobile';
import './ShopHomeIndexTwo.less';
import CarouselComponent from '../components/CarouselComponent';
import GoodsTitle from '../components/GoodsTitle';
import Products from '../components/Products';


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
        const discountList1 = [
            content.sort1_pr1_ix,
            content.sort1_pr2_ix,
            content.sort1_pr3_ix,
            content.sort1_pr4_ix
        ];
        const discountList2 = [
            content.sort2_pr1_ix,
            content.sort2_pr2_ix,
            content.sort2_pr3_ix,
            content.sort2_pr4_ix
        ];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeTwoContent shopHomeContent">
                    <CarouselComponent
                        content={content}
                        cHeight={541}
                        goToGoods={this.goToGoods}
                    />
                    <div className="newRecommend shopHomeTwoContentPadding items" style={{marginTop: '30px'}}>
                        <GoodsTitle
                            title1={content.sort1_title1}
                            title2={content.sort1_title2}
                            modalId={2}
                        />
                        <Products
                            newSellList={discountList1}
                            content={content}
                            picurl={picurl}
                            sort={1}
                            mode2={0}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="discountArea shopHomeTwoContentPadding items">
                        <GoodsTitle
                            title1={content.sort2_title1}
                            title2={content.sort2_title2}
                            modalId={2}
                        />
                        <Products
                            newSellList={discountList2}
                            content={content}
                            picurl={picurl}
                            sort={2}
                            mode2={4}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="hotRecommend shopHomeTwoContentPadding items">
                        <GoodsTitle
                            title1={content.sort3_title1}
                            title2={content.sort3_title2}
                            modalId={2}
                        />
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
                                                    style={{height: '165px'}}
                                                    onClick={() => this.goToGoods(item.id)}
                                                />
                                                <div className="introduce">
                                                    <div className="introduce-title">{item.title}</div>
                                                    <div
                                                        onClick={() => this.goToGoods(item.id)}
                                                        style={{background: content.bg_color}}
                                                    >
                                                        <span className="money-ZH">￥</span>
                                                        <span className="money-now">{item.price}</span>
                                                        <span className="money-before">{item.price_original}</span>
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
