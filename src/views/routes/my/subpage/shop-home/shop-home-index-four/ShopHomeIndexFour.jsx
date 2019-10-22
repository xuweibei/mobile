/**
 * 店铺模板4
 */
import PropTypes from 'prop-types';
import './ShopHomeIndexFour.less';
import CarouselComponent from '../components/CarouselComponent';
import GoodsTitle from '../components/GoodsTitle';
import Products from '../components/Products';


const {appHistory} = Utils;

class ShopHomeIndexFour extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    //热销商品组件
    hotSellComponent = (ix, id, pic, title1, title2, title3) => (
        <div className="sell-commodity">
            <div className="sell-commodity-img">
                <img src={pic} onClick={() => this.goToGoods(id)} alt=""/>
            </div>
            <div className="headline-price-take">
                <div className="headline">{title1}</div>
                <div className="price">
                    <span className="money-ZH">￥</span>
                    <span className="money-now">{title2}</span>
                    <span className="money-before">{title3}</span>
                </div>
            </div>
        </div>
    )

    render() {
        const {shopModelArr: {picurl, content}} = this.props;
        const goodsList2 = [
            content.sort2_pr2_ix,
            content.sort2_pr3_ix,
            content.sort2_pr4_ix,
            content.sort2_pr5_ix
        ];
        const goodsList3 = [
            content.sort3_pr1_ix,
            content.sort3_pr2_ix,
            content.sort3_pr3_ix,
            content.sort3_pr4_ix
        ];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeFourContent shopHomeContent">
                    <CarouselComponent
                        content={content}
                        cHeight={158}
                    />
                    <div className="compile-box items" style={{marginTop: '30px', paddingLeft: '0', paddingRight: '0'}}>
                        <div className="new-box">
                            <div className="new-left"/>
                            <div className={(picurl && content && picurl[content.sort1_pr1_ix] && content.sort1_pr1_title1 && content.sort1_pr1_title2 && content.sort1_pr1_title3) ? 'new-right' : 'new no-edit-model'}>
                                <div className="fresh">NEW</div>
                                <img src={picurl && picurl[content.sort1_pr1_ix]} onClick={() => this.goToGoods(content.sort1_pr1_id)} alt=""/>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort1_pr1_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort1_pr1_title2}</span>
                                        <span className="money-before">{content && content.sort1_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="compile-box items" style={{marginTop: '30px', backgroundColor: '#CAD9EC'}}>
                        <GoodsTitle
                            title1={content.sort2_title1}
                            title2={content.sort2_title2}
                            modalId={4}
                        />
                        <div className="sell-commodity-box">
                            <div className={(picurl && content && picurl[content.sort2_pr1_ix] && content.sort2_pr1_title1 && content.sort2_pr1_title2 && content.sort2_pr1_title3) ? 'sell' : 'sell no-edit-model'}>
                                <div className="sell-goods">
                                    <img src={picurl && picurl[content.sort2_pr1_ix]} onClick={() => this.goToGoods(content.sort2_pr1_id)} alt=""/>
                                </div>
                                <div className="headline-price">
                                    <div className="headline">{content && content.sort2_pr1_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content && content.sort2_pr1_title2}</span>
                                        <span className="money-before">{content && content.sort2_pr1_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Products
                            content={content}
                            sort={2}
                            newSellList={goodsList2}
                            picurl={picurl}
                            mode2={1}
                        />
                    </div>
                    <div className="items compile-box">
                        <GoodsTitle
                            title1={content.sort3_title1}
                            title2={content.sort3_title2}
                            modalId={1}
                        />
                        <Products
                            content={content}
                            sort={3}
                            newSellList={goodsList3}
                            picurl={picurl}
                            mode2={6}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFour;
