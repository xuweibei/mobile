
/**
 * 店铺模板3
 */
import PropTypes from 'prop-types';
import {Carousel, WingBlank} from 'antd-mobile';
import './ShopHomeIndexThird.less';

const {appHistory} = Utils;

class ShopHomeIndexThird extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.array.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    //热门商品组件
    hotSellComponent = (ix, id, pic, title1, title2, title3, uniqueClassName) => (
        // const {shopModelArr: {picurl}} = this.props;
        <div className={uniqueClassName}>
            <div className="commodity-img">
                <img src={pic} onClick={() => this.goToGoods(id)} alt=""/>
            </div>
            <div className="headline-price">
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
        const {shopModelArr: {content, picurl}} = this.props;
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeThirdContent">
                    <div className="shopHomThirdBanner">
                        {
                            content && (
                                <WingBlank>
                                    <Carousel
                                        autoplay
                                        infinite
                                        speed={2000}
                                    >
                                        {
                                            content.banner.length > 0 ? content.banner.map(item => (
                                                <div key={item} style={{height: '248px'}}>
                                                    <img src={item.url} onClick={() => this.goToGoods(item.id)}/>
                                                </div>
                                            )) : null
                                        }
                                    </Carousel>
                                </WingBlank>
                            )
                        }
                    </div>
                    <div className="compile-box" style={{marginTop: '30px'}}>
                        <div className="title-bar">
                            {/* <p className={(content && content.sort1_title1) ? 'time' : 'time no-edit-model'}>{content && (content.sort1_title1 || '2018/5/20')}</p> */}
                            <p className={(content && content.sort1_title1) ? 'headline' : 'hot no-edit-model'}>{content && (content.sort1_title1 || 'POPULAR COMMODITY')}</p>
                            <p className={(content && content.sort1_title2) ? 'fiery' : 'fiery no-edit-model'}>{content && (content.sort1_title2 || '热门商品')}</p>
                        </div>
                        <div className="hot-box">
                            {this.hotSellComponent(content.sort1_pr1_ix, content.sort1_pr1_id, picurl[content.sort1_pr1_ix], content.sort1_pr1_title1, content.sort1_pr1_title2, content.sort1_pr1_title3, 'hot')}
                            {this.hotSellComponent(content.sort1_pr2_ix, content.sort1_pr2_id, picurl[content.sort1_pr2_ix], content.sort1_pr2_title1, content.sort1_pr2_title2, content.sort1_pr2_title3, 'hot')}
                        </div>
                        <div className={(content && content.sort2_title1 && content.sort2_title2) ? 'title-bar' : 'title-bar no-edit-model'}>
                            <p className="headline">{content && (content.sort2_title1 || '热销榜单')}</p>
                            <p className="fiery">{content && (content.sort2_title2 || 'SUPER HOT SALE')}</p>
                        </div>
                        <div className="sell-box">
                            {this.hotSellComponent(content.sort2_pr1_ix, content.sort2_pr1_id, picurl[content.sort2_pr1_ix], content.sort2_pr1_title1, content.sort2_pr1_title2, content.sort2_pr1_title3, 'sell')}
                            {this.hotSellComponent(content.sort2_pr2_ix, content.sort2_pr2_id, picurl[content.sort2_pr2_ix], content.sort2_pr2_title1, content.sort2_pr2_title2, content.sort2_pr2_title3, 'sell')}
                        </div>
                        <div className="hot-box">
                            {this.hotSellComponent(content.sort2_pr3_ix, content.sort2_pr3_id, picurl[content.sort2_pr3_ix], content.sort2_pr3_title1, content.sort2_pr3_title2, content.sort2_pr3_title3, 'hot')}
                            {this.hotSellComponent(content.sort2_pr4_ix, content.sort2_pr4_id, picurl[content.sort2_pr4_ix], content.sort2_pr4_title1, content.sort2_pr4_title2, content.sort2_pr4_title3, 'hot')}
                        </div>
                        <div className="sell-two-box">
                            {this.hotSellComponent(content.sort2_pr5_ix, content.sort2_pr5_id, picurl[content.sort2_pr5_ix], content.sort2_pr5_title1, content.sort2_pr5_title2, content.sort2_pr5_title3, 'sell-two')}
                            {this.hotSellComponent(content.sort2_pr6_ix, content.sort2_pr6_id, picurl[content.sort2_pr6_ix], content.sort2_pr6_title1, content.sort2_pr6_title2, content.sort2_pr6_title3, 'sell-two')}
                            {this.hotSellComponent(content.sort2_pr7_ix, content.sort2_pr7_id, picurl[content.sort2_pr7_ix], content.sort2_pr7_title1, content.sort2_pr7_title2, content.sort2_pr7_title3, 'sell-two')}
                            {this.hotSellComponent(content.sort2_pr8_ix, content.sort2_pr8_id, picurl[content.sort2_pr8_ix], content.sort2_pr8_title1, content.sort2_pr8_title2, content.sort2_pr8_title3, 'sell-two')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexThird;
