//店铺模板1标题组件，2019/10/21，楚小龙
import './GoodsTitle.less';

export default class GoodsTitle extends BaseComponent {
    render() {
        const {title1, title2, title3, modalId} = this.props;
        return (
            <div className="goods-title-box">
                {
                    modalId === 1 && (
                        <div className="title">
                            <p className="marginTop">{title1}</p>
                            <h2>{title2}</h2>
                            {
                                title3 && <h3>{title3}</h3>
                            }
                        </div>
                    )}
                {
                    modalId === 2 && (
                        <div className="comTitle2 shopHomeTwoContentMarTop">
                            <div>{title1}</div>
                            <p>{title2}</p>
                        </div>
                    )
                }
                {
                    modalId === 3 && (
                        <div className="title-bar">
                            <p className={(title1) ? 'headline' : 'hot no-edit-model'}>{title1 || 'POPULAR COMMODITY'}</p>
                            <p className={(title2) ? 'fiery' : 'fiery no-edit-model'}>{title2 || '热门商品'}</p>
                        </div>
                    )
                }
                {
                    modalId === 4 && (
                        <div className="title-bar">
                            <div>{title1 || 'fdsfs'}</div>
                            <div>{title2 || '热门商品'}</div>
                        </div>
                    )
                }
                {
                    modalId === 5 && (
                        <div className="boutique-name">
                            <div className="boutique-name-top">- {title1} -</div>
                            <div className="boutique-name-bottom">{title2}</div>
                        </div>
                    )
                }
            </div>
        );
    }
}