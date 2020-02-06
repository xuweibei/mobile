/*
* 商品图片懒加载
* */

import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'vanilla-lazyload';
import lazyloadConfig from './config/lazyload';

// Only initialize it one time for the entire application
if (!document.lazyLoadInstance) {
    document.lazyLoadInstance = new LazyLoad(lazyloadConfig);
}

export class LazyImage extends React.PureComponent {
    static propTypes = {
        src: PropTypes.string.isRequired,
        bigPicture: PropTypes.func
    }

    static defaultProps = {
        bigPicture() {}
    };

    // Update lazyLoad after first rendering of every image
    componentDidMount() {
        document.lazyLoadInstance.update();
        const timer = setTimeout(() => {
            const errorData = document.getElementsByClassName('errorData');
            for (let i = 0; i < errorData.length; i++) {
                errorData[i].classList.remove('error');
            }
            clearTimeout(timer);
        }, 200);
    }

    // Update lazyLoad after rerendering of every image
    componentDidUpdate() {
        document.lazyLoadInstance.update();
    }

    lazyImg = () => <img src={require('../../../assets/images/Lazy-loading.png')} alt="正在加载。。。"/>;

    render() {
        const {src, bigPicture} = this.props;
        console.log(this.imgs, '二');
        return (
            src ? (
                <img
                    onError={e => {
                        e.target.src = require('../../../assets/images/Lazy-loading.png');
                        e.target.className = 'errorData';
                    }
                    }
                    ref={imgs => { this.imgs = imgs }}
                    className="lazy"
                    onClick={bigPicture}
                    src={src}
                />
            ) : this.lazyImg()
        );
    }
}

export default LazyImage;