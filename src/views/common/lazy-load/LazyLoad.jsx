/*
* 商品图片懒加载
* */
import LazyLoad, {forceCheck} from 'react-lazyload';
import PropTypes from 'prop-types';

export default class LazyLoadIndex extends React.PureComponent {
    static propTypes = {
        lazyInfo: PropTypes.object.isRequired,
        bigPicture: PropTypes.func
    }

    static defaultProps = {
        bigPicture() {}
    };

    lazyImg = () => <img src={require('../../../assets/images/Lazy-loading.png')} alt="正在加载。。。"/>;

    render() {
        const {lazyInfo, bigPicture} = this.props;
        forceCheck();//当LazyLoad组件进入视口而没有调整大小或滚动事件时很有用，例如，当组件的容器被隐藏然后可见时。
        return (
            <LazyLoad overflow={lazyInfo.overflow} offset={lazyInfo.offset} placeholder={this.lazyImg()} alt="">
                <img
                    data-original={lazyInfo.imgUrl}
                    onClick={bigPicture}
                    key={lazyInfo.imgUrl}
                    onLoad={(e) => { e.target.src = lazyInfo.imgUrl || require('../../../assets/images/Lazy-loading.png') }}
                    src={lazyInfo.imgUrl || require('../../../assets/images/Lazy-loading.png')}
                />
            </LazyLoad>
        );
    }
}
