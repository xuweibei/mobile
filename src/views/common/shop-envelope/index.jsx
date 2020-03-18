
import './index.less';
import PropTypes from 'prop-types';

const mokeDate = [
    {money: '1', arrive: '3', time: '2019-12-03至2023-12-03', state: '新到'},
    {
        money: '234',
        arrive: '45634',
        time: '2010-12-03至2063-12-03',
        state: '将过期'
    },
    {
        money: '89',
        arrive: '5464',
        time: '2019-16-03至2023-92-03',
        state: '新到'
    },
    {money: '1', arrive: '3', time: '2019-12-03至2023-12-03', state: '新到'},
    {
        money: '234',
        arrive: '45634',
        time: '2010-12-03至2063-12-03',
        state: '将过期'
    },
    {
        money: '89',
        arrive: '5464',
        time: '2019-16-03至2023-92-03',
        state: '新到'
    },

    {money: '1', arrive: '3', time: '2019-12-03至2023-12-03', state: '新到'},
    {
        money: '234',
        arrive: '45634',
        time: '2010-12-03至2063-12-03',
        state: '将过期'
    },
    {
        money: '89',
        arrive: '5464',
        time: '2019-16-03至2023-92-03',
        state: '新到'
    },

    {money: '1', arrive: '3', time: '2019-12-03至2023-12-03', state: '新到'},
    {
        money: '234',
        arrive: '45634',
        time: '2010-12-03至2063-12-03',
        state: '将过期'
    },
    {
        money: '89',
        arrive: '5464',
        time: '2019-16-03至2023-92-03',
        state: '新到'
    }
];

class ShopEnvlope extends React.PureComponent {
    static propTypes = {
        changeBox: PropTypes.func.isRequired
    }

    changeBox = () => {
        this.props.changeBox();
    }

    render() {
        return (
            <div className="shop-env-wrap">
                <div className="shop-env-main">
                    <div className="shop-env-title">
                        <p>领取红包</p>
                        <span className="icon" onClick={this.changeBox}/>
                    </div>
                    <div className="shop-env-list">
                        {
                            mokeDate.map(item => (
                                <div className="card-view">
                                    <div className="card-money">
                                        <p>
                                            <span>￥</span>10
                                        </p>
                                        <span className="full">满50可用</span>
                                    </div>
                                    <div className="card-main">
                                        <p>全站满10使用</p>
                                        <p>限实物商品</p>
                                        <p>2016-2019</p>
                                        {<span className="card-receive">立即领取</span>}
                                        {/* {<span className="card-use">去使用</span>} */}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ShopEnvlope;