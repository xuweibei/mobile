/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import './ShopHomeIndex.less';
// import {Carousel, WingBlank} from 'antd-mobile';
import GoodsTitle from '../components/GoodsTitle';
import CarouselComponent from '../components/CarouselComponent';
import Products from '../components/Products';

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
                    <CarouselComponent
                        content={content}
                        cHeight={475}
                    />
                    <div className="items" style={{marginTop: '30px'}}>
                        <GoodsTitle
                            title1={content.sort1_title1}
                            title2={content.sort1_title2}
                            title3={content.sort1_title3}
                            modalId={1}
                        />
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
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="items">
                        <GoodsTitle
                            title1={content.sort2_title1}
                            title2={content.sort2_title2}
                            modalId={1}
                        />
                        <Products
                            content={content}
                            sort={2}
                            newSellList={newSellList1}
                            picurl={picurl}
                            mode2={2}
                        />
                        <Products
                            content={content}
                            sort={2}
                            newSellList={newSellList2}
                            picurl={picurl}
                            mode2={2}
                        />
                    </div>
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
