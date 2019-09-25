/**我要开店---个体页面 */


import React from 'react';
import './IndividualFour.less';
import {List, InputItem, Picker, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Region from '../../../../../common/region/Region';
import Audit from '../personal/Audit';

const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;
const {showInfo, validator} = Utils;
/*const data = [
    {value: 0, label: '银行卡'}
];*/
class IndividualFour extends BaseComponent {
    state ={
        files: [],
        banks: [],
        branchBank: [], //支行信息数组
        bankName: '',  //所属银行
        bankId: '', //所属银行id
        branchBankName: '', //支行名称
        multiple: false,
        userName: '', //卡主姓名
        value: 0,
        id: 0,
        cValue: '',
        bValue: '',
        province: '', //省的名字
        urban: '', //市辖区的名字
        county: '', //城市名字
        bankCard: '', // 银行卡号,
        cardType: 1, //卡类型
        phone: '', //  手机号
        // vcCode: '', //验证码
        countyId: '', //区id
        // type: 2, //1：个人户；2：个体工商户
        cardStatus: '银行卡号'
        // id: ''
    };

    //提交绑定银行卡信息
    postInformation = () => {
        const {form: {validateFields}} = this.props;
        const {bankName, bankId, id, cardType, branchBankName, province, county, urban} = this.state;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.bindBankCard, {
                    data: {
                        id: id,
                        bank_id: bankId,
                        real_name: val.userName,
                        bank_name: bankName,
                        bank_number: val.bankCard,
                        branches: branchBankName,
                        phone: validator.wipeOut(val.phone),
                        pcat: [province, urban, county],
                        // vcode: vcCode,
                        userType: 2,
                        cardType: cardType
                        // type: type
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        this.fetch(urlCfg.shopFinish).subscribe(res2 => {
                            console.log(res2);
                        });
                        this.setState({editModal: 'audits'});
                    }
                });
                return;
            }
        });
    };

    componentDidMount = () => {
        this.getBank();
        this.getUpdateAudit();
    };

    //获取审核失败返回的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.getShopbank, {data: {type: 4}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    userName: res.data.realname,
                    bankCard: res.data.bankNo,
                    cValue: Array(res.data.bankId),
                    bankId: res.data.bankId,
                    phone: res.data.phone,
                    bankName: res.data.bankArea,
                    id: res.data.id,
                    province: res.data.city_name && res.data.city_name[0],
                    urban: res.data.city_name && res.data.city_name[1],
                    county: res.data.city_name && res.data.city_name[2],
                    provinceId: res.data.province_id,
                    cityId: res.data.city_id,
                    countyId: res.data.county_id
                });
            }
        });
    };

    //设置用户输入信息
    getInfo = (val, type) => {
        if (type === 'name') {
            this.setState({
                userName: val
            });
        } else if (type === 'card') {
            this.setState({
                bankCard: val
            });
        } else if (type === 'phone') {
            this.setState({
                phone: val
            });
        } else {
            this.setState({
                vcCode: val
            });
        }
    };

    //获取银行
    getBank = () => {
        this.fetch(urlCfg.getBank).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    const arr = [];
                    res.data.forEach(item => {
                        arr.push({
                            label: item.name,
                            value: item.id
                        });
                    });
                    this.setState({
                        banks: arr
                    });
                }
            }
        });
    };

    //获取支行
    getBankBranch = () => {
        const {bankName, countyId} = this.state;
        console.log(bankName, countyId);
        if (bankName && countyId) {
            this.fetch(urlCfg.getBankList, {data: {
                cityId: countyId,
                key: bankName.substr(0, 2)
            }}).subscribe(res => {
                if (res.status === 0) {
                    const arr = [];
                    res.data.forEach(item => {
                        arr.push({
                            label: item.bankBranchName,
                            value: item.code
                        });
                    });
                    this.setState(() => ({
                        branchBank: arr
                    }));
                }
            });
        } else {
            showInfo(Form.failGetBankBranch);
        }
    };

    //获取选中的银行
    getBankInfo = (val) => {
        const {banks} =  this.state;
        const result = banks.find((item) => item.value === val.toString());
        this.setState(() => ({
            cValue: val,
            bankName: result.label,
            bankId: result.value
        }));
    };

    // 获取选中的支行
    setBankBranch = (val) => {
        const {branchBank} = this.state;
        console.log(val);
        if (branchBank.length !== 0) {
            const result = branchBank.find(item => item.value === val.toString());
            this.setState(() => ({
                branchBankName: result.label,
                bValue: result.label
            }));
        }
    };

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

    //区的id
    setCountyId = (str) => {
        this.setState(() => ({
            countyId: str
        }));
    };

    //检验卡主姓名
    checkUserName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_cardHolderName, callback)) {
            return;
        }
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.Error_UserName, callback);
            return;
        }
        callback();
    };

    //验证银行卡号
    checkBankCard = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_BankNumber, callback)) {
            return;
        }
        if (!validator.bankCard(value)) {
            validator.showMessage(Form.Error_Bank, callback);
            return;
        }
        callback();
    };

    //校验是否选择开户行
    checkBanks = (rule, value, callback) => {
        const {bankName} = this.state;
        if (!validator.isEmpty(bankName, Form.No_Bank, callback)) {
            return;
        }
        callback();
    };

    //是否选择银行支行
    checkBranchName = (rule, value, callback) => {
        const {branchBankName} = this.state;
        if (!validator.isEmpty(branchBankName, Form.No_branchBankName, callback)) {
            return;
        }
        callback();
    };

    //校验银行预留手机号
    checkPhone = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_reservePhone, callback)) {
            return;
        }
        const myPhone = validator.wipeOut(value);
        if (!validator.checkPhone(myPhone)) {
            showInfo(Form.No_checkPhone, 1);
            return;
        }
        callback();
    };

    editModalMain = () => {
        const {form: {getFieldDecorator}} = this.props;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        const {banks, cValue, branchBank, userName, bankCard, phone, branchBankName, provinceId, cityId, countyId, province, urban, county} = this.state;
        return (
            <div>
                <AppNavBar goBackModal={this.props.goBack} rightExplain title="绑定银行卡"/>
                <div className={`step-box ${window.isWX ? 'step-box-clear' : ''}`}>
                    {steps.map((item, index) => (
                        <div className="step" key={item}>
                            <span>{index + 1}</span>
                            <span>{item}</span>
                        </div>
                    ))}
                    <Flex className="dotted"><Flex.Item/><Flex.Item/><Flex.Item/></Flex>
                </div>
                <div className="list-content">
                    <div className="margin">
                        <List>
                            {
                                getFieldDecorator('userName', {
                                    initialValue: userName,
                                    rules: [
                                        {validator: this.checkUserName}
                                    ],
                                    validateTrigger: 'submit'//校验值的时机
                                })(
                                    <InputItem
                                        clear
                                        placeholder="请输入卡主名称"
                                    >卡主姓名
                                    </InputItem>
                                )
                            }
                            {
                                getFieldDecorator('bankCard', {
                                    initialValue: bankCard,
                                    rules: [
                                        {validator: this.checkBankCard}
                                    ],
                                    validateTrigger: 'submit'//校验值的时机
                                })(
                                    <InputItem
                                        clear
                                        maxLength="20"
                                        type="number"
                                        placeholder="请输入银行卡号"
                                    >银行卡号
                                    </InputItem>
                                )
                            }
                            {
                                getFieldDecorator('banks', {
                                    initialValue: cValue,
                                    rules: [
                                        {validator: this.checkBanks}
                                    ],
                                    validateTrigger: 'submit'//校
                                })(
                                    <Picker
                                        data={banks}
                                        cols={1}
                                        onOk={val => this.getBankInfo(val)}
                                    >
                                        <List.Item arrow="horizontal" onClick={this.onClick}>开户银行</List.Item>
                                    </Picker>
                                )
                            }
                            <List.Item className="branches area" arrow="horizontal">
                                <span>开户地区</span>
                                <Region
                                    provinceId={provinceId}
                                    cityId={cityId}
                                    countyId={countyId}
                                    provinceValue={province}
                                    cityValue={urban}
                                    countyValue={county}
                                    onSetProvince={this.setProvince}
                                    onSetCity={this.setCity}
                                    onSetCounty={this.setCounty}
                                    onCountyId={this.setCountyId}
                                    add
                                />
                            </List.Item>
                            {
                                getFieldDecorator('branchName', {
                                    initialValue: branchBankName,
                                    rules: [
                                        {validator: this.checkBranchName}
                                    ],
                                    validateTrigger: 'submit'//校
                                })(
                                    <Picker
                                        data={branchBank}
                                        cols={1}
                                        onOk={val => this.setBankBranch(val)}
                                    >
                                        <List.Item
                                            arrow="horizontal"
                                            onClick={this.getBankBranch}
                                        >开户支行
                                        </List.Item>
                                    </Picker>
                                )
                            }
                            {/*<List.Item>所属支行</List.Item>*/}
                            {/*<List.Item className="select-bank">*/}
                            {/*    <Region*/}
                            {/*        onSetProvince={this.setProvince}*/}
                            {/*        onSetCity={this.setCity}*/}
                            {/*        onCountyId={this.setCountyId}*/}
                            {/*        onSetCounty={this.setCounty}*/}
                            {/*        add*/}
                            {/*    />*/}
                            {/*    {*/}
                            {/*        getFieldDecorator('branchName', {*/}
                            {/*            initialValue: branchBankName,*/}
                            {/*            rules: [*/}
                            {/*                {validator: this.checkBranchName}*/}
                            {/*            ],*/}
                            {/*            validateTrigger: 'submit'//校*/}
                            {/*        })(*/}
                            {/*            <Picker*/}
                            {/*                data={branchBank}*/}
                            {/*                cols={1}*/}
                            {/*                onOk={val => this.setBankBranch(val)}*/}
                            {/*            >*/}
                            {/*                <List.Item arrow="horizontal" onClick={this.getBankBranch}>{bValue || '所属银行'}</List.Item>*/}
                            {/*            </Picker>*/}
                            {/*        )*/}
                            {/*    }*/}
                            {/*</List.Item>*/}
                            {
                                getFieldDecorator('phone', {
                                    initialValue: phone,
                                    rules: [
                                        {validator: this.checkPhone}
                                    ],
                                    validateTrigger: 'submit'//校
                                })(
                                    <InputItem
                                        clear
                                        placeholder="请输入手机号码"
                                        maxLength={11}
                                    >银行预留手机号
                                    </InputItem>
                                )
                            }
                            <List.Item arrow="horizontal" className="remark">请填写与开店人信息一致的所属人银行卡信息</List.Item>
                        </List>
                    </div>
                </div>
                <div className="button">
                    <div className="large-button important" onClick={() => this.postInformation()}>提交申请</div>
                </div>
            </div>
        );
    };

    goBack = () => {
        this.setState({
            editModal: ''
        });
    };

    render() {
        const {editModal} = this.state;
        return (
            <div data-component="individual-four" data-role="page" className="individual-four">
                {
                    !editModal && this.editModalMain()
                }
                {
                    editModal && <Audit/>
                }
            </div>
        );
    }
}
export default createForm()(IndividualFour);
