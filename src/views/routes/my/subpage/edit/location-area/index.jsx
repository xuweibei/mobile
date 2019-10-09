//所在区域管理

import {connect} from 'react-redux';
import {List, Button, InputItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import {myActionCreator as actionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Region from '../../../../../common/region/Region';
import './index.less';

const Item = List.Item;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}, navColorF} = Constants;
const {appHistory, showInfo, validator, setNavColor} = Utils;
const hybird = process.env.NATIVE;

class Area extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08), //是微信扣除头部高度
        address: [],
        province: '',
        urban: '',
        county: ''
    };

    componentDidMount() {
        const {areaInfo, getArea} = this.props;
        if (!areaInfo) {
            getArea();
        }
    }

    componentWillMount() {
        if (hybird) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    //  省市县的赋值
    setProvince = str => {
        this.setState({
            province: str,
            urban: '',
            county: ''
        });
    };

    //设置城市
    setCity = str => {
        this.setState({
            urban: str,
            county: ''
        });
    };

    //设置市辖区
    setCounty = str => {
        this.setState({
            county: str
        });
    };

    //校验是否选择地址
    checkArea = (rule, value, callback) => {
        // FIXME: 代码要优化
        //已以优化
        const {province, urban, county} = this.state;
        if (!province || !urban || !county) {
            validator.showMessage(Form.No_pca, callback);
            return;
        }
        callback();
    };

    //确认修改
    submit = () => {
        const {form: {validateFields}, getArea, getUserInfo} = this.props;
        const {province, urban, county} = this.state;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                const arr = [province, urban, county];
                this.fetch(urlCfg.personalAddress, {data: {pca: arr}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Handle_Success);
                            getArea();
                            getUserInfo();
                            appHistory.goBack();
                        }
                    });
                return;
            }
            console.log('错误', error, val);
        });
    };

    render() {
        const {height} = this.state;
        const {areaInfo, form: {getFieldDecorator}} = this.props;
        return (
            <div data-component="regicon" data-role="page" className="regicon">
                <AppNavBar title="所在区域管理"/>
                <List className="my-list">
                    <div style={{height: height}} className="receiving-reg">
                        <Item
                            extra={areaInfo && areaInfo.join('-')}
                        >当前区域
                        </Item>
                        <InputItem>
                            <div className="area">修改区域</div>
                            {
                                getFieldDecorator('area', {
                                    rules: [
                                        {validator: this.checkArea}
                                    ],
                                    validateTrigger: 'submit'//校验值的时机
                                })(
                                    <Region
                                        onSetProvince={this.setProvince}
                                        onSetCity={this.setCity}
                                        onSetCounty={this.setCounty}
                                        add
                                    />
                                )
                            }
                        </InputItem>
                        <Button className="button" onClick={this.submit}>确认修改</Button>
                    </div>

                </List>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        areaInfo: EditInfo.get('areaInfo')
    };
};
const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo,
    getArea: actionCreator.getArea
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Area));
