/*
* 商品图片懒加载
* */
import LazyLoad, {forceCheck} from 'react-lazyload';
import PropTypes from 'prop-types';

export default class LazyLoadIndex extends React.PureComponent {
    state={
        lazyInfo: this.props.lazyInfo,
        bigPicture: this.props.bigPicture
    }

    static propTypes = {
        lazyInfo: PropTypes.object.isRequired,
        bigPicture: PropTypes.func
    }

    static defaultProps = {
        bigPicture() {}
    };

    componentDidUpdate(data) {
        console.log(data, '克里斯多夫');
        this.setState({
            lazyInfo: data.lazyInfo,
            bigPicture: data.bigPicture
        });
    }

    lazyImg = () => <img src={require('../../../assets/images/Lazy-loading.png')} alt="正在加载。。。"/>;

    render() {
        const {lazyInfo, bigPicture} = this.state;
        // forceCheck();//当LazyLoad组件进入视口而没有调整大小或滚动事件时很有用，例如，当组件的容器被隐藏然后可见时。
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
