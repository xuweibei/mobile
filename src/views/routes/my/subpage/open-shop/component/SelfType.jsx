import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './selectType.less';

const {appHistory} = Utils;

// FIXME: 改用纯组件 完成
class SelfType extends React.PureComponent {
    //跳转开店
    routeTo = (type, num) => {
        appHistory.push(`/openShopPage?shopType=${type}&shopStatus=${num}`);
    };

    render() {
        return (
            <div className="chose-type">
                <AppNavBar
                    title="选择开店类型"
                    rightExplain
                />
                <div className="type-box" onClick={() => this.routeTo('self', 0)}>
                    <h3 className="type-title">个人店</h3>
                    <p className="type-body">
                        个人店营业总额为1000元/天，超过之后将不能收款成功；发现板块不推荐，无法发布线上商品。适用于小吃摊开店。
                    </p>
                </div>
                <div className="type-box" onClick={() => this.routeTo('net', 2)}>
                    <h3 className="type-title shop">网店</h3>
                    <p className="type-body">
                        网店总营业额为1000元/天，不能在发现板块中找到，只可发布线上商品。适用于电商开店。
                    </p>
                </div>
            </div>
        );
    }
}

const mapState = state => {
    const my = state.get('my');
    return {
        message: my.get('message')
    };
};

export default connect(mapState, null)(SelfType);