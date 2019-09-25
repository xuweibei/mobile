import React from 'react';
import {connect} from 'react-redux';
import {createForm} from 'rc-form';
import {List, InputItem, Checkbox, Button} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import GeisInputItem from '../../../../../common/form/input/GeisInputItem';
import GeisTextareaItem from '../../../../../common/form/textArea/GeisTextareaItem';
import Region from '../../../../../common/region/Region';
import {myActionCreator} from '../../../actions/index';
import './index.less';

const CheckboxItem = Checkbox.CheckboxItem;
const {MESSAGE: {Form, Feedback}} = Constants;
const {appHistory, getUrlParam, validator, showInfo, showSuccess} = Utils;
const {urlCfg} = Configs;

// FIXME: 页面需要优化
class BasicInput extends BaseComponent {
    state = {
        defaultState: false, //设置为默认地址
        province: '', //省的名字
        urban: '', //市辖区的名字
        county: '', //城市的名字
        addressArr: [], //初始地址
        editStatus: true, //地址选择显示与否
        addressStatus: decodeURI(getUrlParam('status', encodeURI(this.props.location.search))), //编辑还是删除 1编辑2添加
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 1.08) //扣除微信头部高度
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (id) {
            this.fetch(urlCfg.editAddressOne, {method: 'post', data: {id: id}})
                .subscribe(res => {
                    if (res.status === 0) {
                        this.setState({
                            addressArr: res.data,
                            province: res.data.province[0],
                            urban: res.data.city[0],
                            county: res.data.county[0],
                            defaultState: !!Number(res.data.if_default)
                        });
                    }
                });
        }
    };

    //设置是否默认地址
    onChangeDefault = (data) => {
        this.setState({
            defaultState: data.target.checked
        });
    };

    //点击保存
    saveData = () => {
        const {province, urban, county} = this.state;
        const district = [];
        if (province) {
            district.push(province);
        }
        if (urban) {
            district.push(urban);
        }
        if (county) {
            district.push(county);
        }
        const account = this.props.form.getFieldsValue().account;
        const addressAll = this.props.form.getFieldsValue().addressAll;
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const phone = this.props.form.getFieldsValue().phone;
        //表单验证
        if (!validator.checkRange(2, 20, account)) return showInfo(Form.No_Name);
        if (!phone) return showInfo(Form.No_Phone);
        if (!validator.checkPhone(validator.wipeOut(phone))) return showInfo(Form.Error_Phone);
        if (district.length < 3) return showInfo(Form.Error_Address);
        if (!addressAll) return showInfo(Form.Error_Address_Required);
        if (addressAll.length < 3) return showInfo(Form.Error_Address_Length);

        this.fetch(urlCfg.addedOrEditedAddress, {method: 'post', data: {id: id, linkname: account, linktel: validator.wipeOut(phone), pca: district, address: addressAll, if_default: this.state.defaultState ? '1' : '0'}})
            .subscribe(res => {
                if (res.status === 0) {
                    const {getAddress} = this.props;
                    getAddress();
                    showSuccess(Feedback.Edit_Success);
                    appHistory.goBack();
                }
            });
        return undefined;
    };

    //父级数据变更
    editStatusChange = () => {
        this.setState({
            editStatus: false
        });
    };

    //  省市县的赋值
    setProvince = str => {
        this.setState({
            province: str,
            urban: '',
            county: ''
        });
    };

    //  市辖区赋值
    setCity = str => {
        this.setState({
            urban: str,
            county: ''
        });
    };

    //  城市赋值
    setCounty = str => {
        this.setState({
            county: str
        });
    };

    //地址删除
    deleteData = (data) => {
        const that = this;
        const {showConfirm, getAddress} = this.props;
        showConfirm({
            title: '确定删除吗?',
            btnTexts: ['取消', '确定'],
            callbacks: [null, () => {
                const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
                that.fetch(urlCfg.deleteAddress, {method: 'post', data: {id: id}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            getAddress();
                            appHistory.push('/address');
                        }
                    });
            }]
        });
    };

    render() {
        const {getFieldProps} = this.props.form;
        const {getFieldDecorator} = this.props.form;//getFieldDecorator用于和表单进行双向绑定
        const {province, urban, county, addressArr, defaultState, editStatus, addressStatus, height} = this.state;
        return (
            <div data-component="add-address" data-role="page" className="add-address">
                <AppNavBar title="地址管理"/>
                <form style={{height: height}} className="location-list">
                    <List>
                        {
                            getFieldDecorator('account', {
                                initialValue: addressArr.linkname
                                // validateTrigger: 'onSubmit'//校验值的时机
                            })(
                                <GeisInputItem
                                    type="nonSpace"
                                    clear
                                    placeholder="请输入您的收件人姓名"
                                    isStyle
                                />
                            )
                        }
                        {/*<InputItem*/}
                        {/*    {...getFieldProps('account', {initialValue: addressArr.linkname})}*/}
                        {/*    clear*/}
                        {/*    error={!!getFieldError('account')}*/}
                        {/*    onErrorClick={() => {}}*/}
                        {/*    placeholder="请输入您的收件人姓名"*/}
                        {/*    className="add-input"*/}
                        {/*/>*/}
                        <InputItem
                            className="add-input"
                            {...getFieldProps('phone', {initialValue: addressArr.linktel})}
                            placeholder="请输入电话号码"
                            type="phone"
                        />
                        <div className="receiving-address">
                            <InputItem>
                                {
                                    addressStatus === '1'
                                        ? (
                                            <Region
                                                onSetProvince={this.setProvince}
                                                onSetCity={this.setCity}
                                                onSetCounty={this.setCounty}
                                                provinceValue={province}
                                                cityValue={urban}
                                                countyValue={county}
                                                provinceId={addressArr.province_id}
                                                cityId={addressArr.city_id}
                                                editStatus={editStatus}
                                                editStatusChange={this.editStatusChange}
                                            />
                                        ) : (
                                            <Region
                                                onSetProvince={this.setProvince}
                                                onSetCity={this.setCity}
                                                onSetCounty={this.setCounty}
                                                add
                                            />
                                        )
                                }
                            </InputItem>
                        </div>
                        {
                            getFieldDecorator('addressAll', {
                                initialValue: addressArr.address
                                // validateTrigger: 'onSubmit'//校验值的时机
                            })(
                                <GeisTextareaItem
                                    type="nonSpace"
                                    placeholder="请输入详细地址"
                                />
                            )
                        }
                        {/*<TextareaItem*/}
                        {/*    {...getFieldProps('addressAll', {initialValue: addressArr.address})}*/}
                        {/*    placeholder="请输入详细地址"*/}
                        {/*    // autoHeight*/}
                        {/*    count={100}*/}
                        {/*/>*/}
                        <div className="default">
                            <CheckboxItem onChange={(data) => this.onChangeDefault(data)} checked={defaultState}>
                                {'设为默认地址'}
                            </CheckboxItem>
                        </div>
                        <Button className="save" onClick={this.saveData}>保存</Button>
                        {addressStatus === '1' && <Button className="delete" onClick={this.deleteData}>删除</Button>}
                    </List>
                </form>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        userTypes: base.get('userTypes')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    getAddress: myActionCreator.getAddress
};

const BasicInputWrapper = createForm()(BasicInput);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BasicInputWrapper);
