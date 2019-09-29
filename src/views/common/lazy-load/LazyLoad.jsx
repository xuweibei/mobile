/*
* 商品图片懒加载
* */
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';

export default class LazyLoadIndex extends React.PureComponent {
    static defaultProps = {
        bigPicture() {}
    };

    static propTypes = {
        lazyInfo: PropTypes.object.isRequired,
        bigPicture: PropTypes.func
    }

    lazyImg = () => <img src={require('../../../assets/images/Lazy-loading.png')} alt="正在加载。。。"/>;

    render() {
        const {lazyInfo, bigPicture} = this.props;
        return (
            <LazyLoad overflow={lazyInfo.overflow} offset={lazyInfo.offset} placeholder={this.lazyImg()} alt="">
                <img data-original={lazyInfo.imgUrl} onClick={bigPicture} key={new Date()} src={lazyInfo.imgUrl || require('../../../assets/images/Lazy-loading.png')}/>
            </LazyLoad>
        );
    }
}
