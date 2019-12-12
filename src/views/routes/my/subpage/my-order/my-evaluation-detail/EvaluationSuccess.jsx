/** 评价成功*/
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import LazyLoadIndex from '../../../../../common/lazy-load/LazyLoad';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './EvaluationSuccess.less';

const {appHistory} = Utils;
const {urlCfg} = Configs;
class EvaluationSuccess extends BaseComponent {
    state = {
        recommend: [], //获取评价列表
        greatDemand: [] //热门商品列表
    };

    componentDidMount() {
        this.recommend();
        this.greatDemand();
    }

    //获取订单列表
    recommend = () => {
        this.fetch(urlCfg.mallOrder,
            {data: {status: 3, page: 1, pagesize: 5}}).subscribe((res) => {
            if (res && res.status === 0) {
                this.setState({
                    recommend: res.list
                });
            }
        });
    }

    //热门推荐
    greatDemand = () => {
        this.fetch(urlCfg.homeRecommendPr,
            {data: {status: 3, page: 1, pagesize: 3}}).subscribe((res) => {
            if (res && res.status === 0) {
                this.setState({
                    greatDemand: res.data
                });
            }
        });
    }

    //跳转全部商品
    shopHome = (id) => {
        appHistory.push(`/shopHome?id=${id}`);
    }

    //跳转当个商品页
    goToGooods = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    }

    //查看我的评价
    myEvaluate = () => {
        this.props.setTab(1);//到查看页面，需要跳到已评价内容
        dropByCacheKey('PossessEvaluate');//清除我的评价页面缓存
        appHistory.replace('/possessEvaluate');
    }

    //继续评价
    continueAppraise = (id) => {
        appHistory.push(`/myEvaluate?id=${id}`);
    }

    render() {
        const {recommend, greatDemand} = this.state;
        return (
            <div className="Evaluation-success">
                <AppNavBar title="评价成功"/>
                {/*<div className="comment">*/}
                {/*<span className="icon comment-r">发表评价</span>*/}
                {/*</div>*/}
                <div className="loogEvaluation">
                    <div className="Evaluation-t">评价成功</div>
                    <div className="Evaluation-c">您的言论将会帮助更多人！</div>
                    <div className="Evaluation-b" onClick={this.myEvaluate}>查看评价</div>
                </div>
                <div className="reEvaluation">
                    <div className="Evaluation">
                        <div className="Evaluation-t" onClick={this.myEvaluate}>继续评论</div>
                    </div>
                    {(recommend && recommend.length > 0) ? recommend.map(item => (
                        <div className="goods">
                            {
                                item.pr_list && item.pr_list.map(data => (
                                    <div className="goods-name">
                                        <div className="goods-picture">
                                            {/* <img src={data.pr_picpath} alt=""/> */}
                                            <LazyLoadIndex lazyInfo={{offset: -10, imgUrl: item.picpath, overflow: false}}/>
                                        </div>
                                        <div className="goods-information">
                                            <div className="goods-explain explain-appraise" onClick={() => this.goToGooods(data.pr_id)}>{data.pr_title}</div>
                                            <div className="money-appraise" onClick={() => this.goToGooods(data.pr_id)}>￥{data.price}</div>
                                            <ul className="goods-label" onClick={() => this.goToGooods(data.pr_id)}>
                                                {data.property_content.map(items => (
                                                    <li key={items}>{items}</li>
                                                ))}
                                            </ul>
                                            <div className="num-appraise" onClick={() => this.goToGooods(data.pr_id)}>x{data.pr_num}</div>
                                            <div className="bookkeeping" onClick={() => this.goToGooods(data.pr_id)}>
                                                <span className="bookkeeping-l">记账量：{data.deposit}</span>
                                            </div>
                                            <div className="price">
                                                <div className="price-l">
                                                    {/* <span className="enter-l">{data.shopName}</span>
                                                <span className="enter-r" onClick={this.shopHome}>进店<span className="icon"/></span> */}
                                                </div>
                                                <div className="btn-appraise">
                                                    <div className="buttons">
                                                        <div className="evaluate-button" onClick={() => this.continueAppraise(item.id)}>立即评价</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )) : ''}
                </div>
                <div className="recommend">
                    <div className="recommend-text">热门推荐</div>
                    {(greatDemand && greatDemand.length > 0) ? greatDemand.map(item => (
                        <div className="goods">
                            <div className="goods-name">
                                <div className="goods-picture" onClick={() => this.goToGooods(item.pr_id)}>
                                    <LazyLoadIndex lazyInfo={{offset: -60, imgUrl: item.picpath_s, overflow: false}}/>
                                </div>
                                <div className="goods-information">
                                    <div className="goods-explain" onClick={() => this.goToGooods(item.pr_id)}>{item.title}</div>
                                    <div className="bookkeeping" onClick={() => this.goToGooods(item.pr_id)}>
                                        <span className="bookkeeping-l">记账量：{item.deposit}</span>
                                        <span className="bookkeeping-r">{item.city}</span>
                                    </div>
                                    <div className="payment">
                                        <span>{item.sale_num}人付款</span>
                                        {/*<span className="payment-r">￥9999</span>*/}
                                    </div>
                                    <div className="price" onClick={this.shopHome.bind(this, item.shop_id)}>
                                        <div className="price-l">
                                            <span className="enter-l">{item.shopName}</span>
                                            <span className="enter-r">进店<span className="icon"/></span>
                                        </div>
                                        <div className="price-r">￥{item.price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : ''}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setTab: actionCreator.setTab,
    showConfirm: actionCreator.showConfirm
};

export default connect(
    null,
    mapDispatchToProps
)(EvaluationSuccess);
