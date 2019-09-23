/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import {WingBlank, Carousel} from 'antd-mobile';
import './ShopHomeIndex.less';

const {appHistory} = Utils;

class ShopHomeIndex extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.object.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    //热销结构
    topModal = (id, url, title1, title2, title3) => (
        <div className="top">
            <img onClick={() => this.goToGoods(id)} src={url} alt=""/>
            <div className="priceInfo">
                <div className="infoLeft">
                    <p className="shopTitleSmall">{title1}</p>
                </div>
                <div className="fr">{title2}<span>{title3}</span></div>
            </div>
        </div>
    )

    //折扣结构
    centerModal = (id, url, title1, title2, title3) => (
        <div className="commodity-two" onClick={() => this.goToGoods(id)}>
            <img src={url} alt=""/>
            <div className="two-headline">{title1}</div>
            <div className="two-price">
                <span>{title2}</span>
                <span className="price">{title3}</span>
            </div>
        </div>
    )

    render() {
        const {shopModelArr, shopModelArr: {content, picurl}} = this.props;
        console.log(shopModelArr, '圣诞节快乐风');
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeContent">
                    <div style={{background: content.bg_color}} className="shopHomeBanner">
                        <WingBlank>
                            <Carousel
                                autoplay
                                infinite
                                autoplayInterval={3000}
                            >
                                {content.banner && content.banner.map(val => (
                                    <img onClick={() => this.goToGoods(val.id)} src={val.url} alt=""/>
                                ))}
                            </Carousel>
                        </WingBlank>
                    </div>
                    <div className="items">
                        <div className="title">
                            <p className="marginTop">{content.sort1_title1}</p>
                            <h2>{content.sort1_title2}</h2>
                            <h3>{content.sort1_title3}</h3>
                        </div>
                        <div className="hotImgShow">
                            {/* //热销结构 */}
                            {content && this.topModal(content.sort1_pr1_id, picurl[content.sort1_pr1_ix], content.sort1_pr1_title1, content.sort1_pr1_title2, content.sort1_pr1_title3)}
                            {content && this.topModal(content.sort1_pr2_id, picurl[content.sort1_pr2_ix], content.sort1_pr2_title1, content.sort1_pr2_title2, content.sort1_pr2_title3)}
                        </div>
                    </div>

                    {/* //折扣结构 */}
                    <div className="commodity-title-two" style={{backgroundColor: content && content.bg_color}}>
                        {content && this.centerModal(content.sort2_pr1_id, picurl[content.sort2_pr1_ix], content.sort2_pr1_title1, content.sort2_pr1_title2, content.sort2_pr1_title3)}
                        {content && this.centerModal(content.sort2_pr2_id, picurl[content.sort2_pr2_ix], content.sort2_pr2_title1, content.sort2_pr2_title2, content.sort2_pr2_title3)}
                        {content && this.centerModal(content.sort2_pr3_id, picurl[content.sort2_pr3_ix], content.sort2_pr3_title1, content.sort2_pr3_title2, content.sort2_pr3_title3)}
                        {content && this.centerModal(content.sort2_pr4_id, picurl[content.sort2_pr4_ix], content.sort2_pr4_title1, content.sort2_pr4_title2, content.sort2_pr4_title3)}
                    </div>

                    <div className="commodity-title-two">
                        {content && this.centerModal(content.sort2_pr5_id, picurl[content.sort2_pr5_ix], content.sort2_pr5_title1, content.sort2_pr5_title2, content.sort2_pr5_title3)}
                        {content && this.centerModal(content.sort2_pr6_id, picurl[content.sort2_pr6_ix], content.sort2_pr6_title1, content.sort2_pr6_title2, content.sort2_pr6_title3)}
                        {content && this.centerModal(content.sort2_pr7_id, picurl[content.sort2_pr7_ix], content.sort2_pr7_title1, content.sort2_pr7_title2, content.sort2_pr7_title3)}
                        {content && this.centerModal(content.sort2_pr8_id, picurl[content.sort2_pr8_ix], content.sort2_pr8_title1, content.sort2_pr8_title2, content.sort2_pr8_title3)}
                    </div>
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
