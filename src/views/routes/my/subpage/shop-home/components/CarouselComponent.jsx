//店铺模板轮播图组件，2019/10/21，楚小龙
import {WingBlank, Carousel} from 'antd-mobile';
import './CarouselComponent.less';

export default class CarouselComponent extends BaseComponent {
    render() {
        const {content, cHeight} = this.props;
        return (
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
                                        <div key={item} style={{height: cHeight + 'px'}}>
                                            <img src={item.url} onClick={() => this.goToGoods(item.id)} title="693"/>
                                        </div>
                                    ))
                                }
                            </Carousel>
                        </WingBlank>
                    ) : <img title="图片"/>
                }
            </div>
        );
    }
}