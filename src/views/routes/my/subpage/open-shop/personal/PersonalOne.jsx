
import React from 'react';
import './PersonalOne.less';
import {List, InputItem, Picker, Radio, Modal, TextareaItem, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import Region from '../../../../../common/region/Region';
import AppNavBar from '../../../../../common/navbar/NavBar';


const {urlCfg} = Configs;
const Fragment = React.Fragment;
const {MESSAGE: {Form}} = Constants;
const {showInfo, validator} = Utils;
const RadioItem = Radio.RadioItem;
const data = [
    {value: 1, label: '正式商户'},
    {value: 2, label: '体验商户'}
];

const DESC_ONE = '选择直接入驻，您将直接成为正式商家，设置的折扣在审核通过后即生效并享有跨界收益。';
const DESC_TWO = '您申请入驻体验商家享有5,000体验额度，此额度内商家折扣不生效且没有跨界收益；如您体验期超一个月或营业总额超过体验金额，将转为正式商家。成为正式商家后，您此时设置的折扣自动生效且将享有跨界收益，商家折扣可在店铺设置内修改。';
class PersonalOne extends BaseComponent {
    state = {
        // data: []
        province: '', //省的名字
        urban: '', //市辖区的名字
        county: '', //城市名字
        category: [], //行业列表
        shopName: '',  //店铺名称
        discount: '', //折扣率
        pca: [],  //省市县
        linkName: '', //负责人
        phone: '', //负责人手机号
        cshPhone: '', //客服手机号
        pick_up_self: false, //是否支持自提
        cate1: '', //分类名
        cate1_id: '', //分类名id
        shop_type: '', //商户类型
        cValue: [], //行业
        cateId: '', //行业id
        cateName: '', //选中行业名
        shopStatus: '',  //商户类型
        modal1: false,
        text: '',
        address: '', //详细地址
        date: [],
        oTValue: '',
        cTValue: '',
        openTime: '',
        closeTime: '',
        urlParams: '',
        editStatus: false,  //地区选择显示与否
        updateAudit: '', //审核填过的信息
        addressStatus: ''
    };

    componentDidMount() {
        console.log('第一步');
        this.getCategorys();
        this.getdoBusinessTime();
        this.getUpdateAudit();
    }

    //父级数据变更
    editStatusChange = () => {
        this.setState({
            editStatus: false
        });
    };

    //获取修改审核的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.updateAudit, {data: {type: 1}}).subscribe(res => {
            if (res.status === 0  && res.data.length !== 0) {
                this.setState({
                    updateAudit: res.data,
                    shopName: res.data.shopName,
                    cateName: res.data.cate1,
                    cateId: res.data.cate1_id,
                    cValue: Array(res.data.cate1_id),
                    province: res.data.city_name[0],
                    urban: res.data.city_name[1],
                    county: res.data.city_name[2],
                    address: res.data.address,
                    openTime: res.data.open_time,
                    closeTime: res.data.close_time,
                    discount: parseInt(res.data.discount, 10),
                    shopStatus: Number(res.data.type),
                    cshPhone: res.data.csh_phone,
                    linkName: res.data.linkName,
                    phone: res.data.phone,
                    addressStatus: '1'
                });
            }
        });
    };

    onChecked = (value) => {
        console.log(value);
        this.setState({
            shopStatus: value
        }, () => {
            const {shopStatus} = this.state;
            if (shopStatus === 1) {
                this.setState({
                    text: DESC_ONE
                });
            } else if (shopStatus === 2) {
                this.setState({
                    text: DESC_TWO
                });
            }
        });
    };

    //  省市县的赋值
    setProvince = str => {
        console.log(str);
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

    //校验商店名称
    checkShopName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_StoreName, callback)) return;
        if (!validator.ckeckShopName(value)) {
            validator.showMessage(Form.Error_ShopName, callback);
            return;
        }
        if (value.length < 2 || value.length > 30) {
            showInfo(Form.Error_ShopName);
            return;
        }
        callback();
    };

    //校验是否选择行业
    checkCate = (rule, value, callback) => {
        const {cateName} = this.state;
        if (!validator.isEmpty(cateName, Form.No_cate1, callback)) return;
        callback();
    };

    //校验是否选择地址
    checkArea = (rule, value, callback) => {
        const {province, urban, county} = this.state;
        const pca = [province, urban, county];
        if (!validator.isEmpty(pca, Form.No_pca, callback)) return;
        callback();
    };

    //判断是否填写详细地址
    checkAddress = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_address, callback)) return;
        callback();
    };

    //验证开店时间
    checkOpenTime = (rule, value, callback) => {
        const {openTime, closeTime} = this.state;
        const ifOpenTime = validator.isEmpty(openTime, Form.Error_Open_Time, callback);
        const ifCloseTime = validator.isEmpty(closeTime, Form.Error_Open_Time, callback);
        if (!ifOpenTime ||  !ifCloseTime) return;
        callback();
    };

    //验证折扣信息
    checkDiscount = (rule, value, callback) => {
        if (!value) {
            showInfo(Form.No_disRange);
            return;
        }
        if (Number(value) < 8 || Number(value) > 9.5) {
            validator.showMessage(Form.No_disNum, callback);
            return;
        }
        callback();
    };

    //校验商户状态
    checkShopStatus = (rule, value, callback) => {
        if (!value) {
            showInfo(Form.No_isExp);
            return;
        }
        callback();
    };

    //校验客服电话
    // checkCshPhone = (rule, value, callback) => {
    //     const myCshPhone = validator.wipeOut(value);
    //     if (!validator.isEmpty(myCshPhone, Form.No_cshPhone, callback)) return;
    //     if (!validator.checkStr(myCshPhone, 4, 12)) {
    //         showInfo(Form.Error_CasPhone);
    //         return;
    //     }
    //     callback();
    // };

    //校验负责人电话
    checkLinkName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_linkName, callback)) return;
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.No_OpenShopName, callback);
            return;
        }
        callback();
    };

    //校验负责人电话
    checkPhone = (rule, value, callback) => {
        const myPhone = validator.wipeOut(value);
        if (!validator.isEmpty(value, Form.No_Principal_Phone, callback)) return;
        if (!validator.checkPhone(myPhone)) {
            showInfo(Form.No_checkPhone, 1);
            return;
        }
        callback();
    };

    //校验客服电话
    checkCasPhone = (rule, value, callback) => {
        const myCshPhone = validator.wipeOut(value);
        if (!validator.isEmpty(myCshPhone, Form.No_cshPhone, callback)) return;
        // if (!validator.checkNum(Number(myCshPhone), 3, 11)) {
        //     showInfo(Form.Error_CasPhone);
        //     return;
        // }
        callback();
    };

    //提交店铺信息
    postInformation = () => {
        const {that} = this.props;
        const {form: {validateFields}} = this.props;
        const {province, county, urban, cateId, cateName, openTime, closeTime, shopStatus} = this.state;
        const pca = [province, urban, county];
        validateFields({first: true, force: true}, (error, val) => {
            if (val && !error) {
                if (!error) {
                    this.fetch(urlCfg.postShopapply, {
                        data: {
                            shopName: val.shopName,
                            linkName: val.linkName,
                            phone: validator.wipeOut(val.phone),
                            csh_phone: validator.wipeOut(val.casPhone).replace('-', ''),
                            discount: parseFloat(val.discount),
                            pca: pca,
                            pick_up_self: 1,
                            shop_type: that.state.urlParams,
                            cate1_id: Number(cateId),
                            cate1: cateName,
                            is_exp: shopStatus,
                            address: val.address,
                            open_time: openTime,
                            close_time: closeTime
                        }
                    }).subscribe(res => {
                        if (res) {
                            if (res.status === 0) {
                                that.getChildren('two');
                            }
                        }
                    });
                }
            }
        });
    };

    //获取行业分类
    getCategorys = () => {
        const {that} = this.props;
        this.fetch(urlCfg.getCategory, {data: {
            type: that.state.urlParams
        }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    const category = [];
                    res.data.map(item => {
                        category.push({
                            label: item.cate_name,
                            value: item.id1
                        });
                    });
                    this.setState({
                        category: category
                    });
                }
            }
        });
    };

    onClose = () => {
        this.setState({
            modal1: false
        });
    };

    openMod = () => {
        this.setState({
            modal1: true
        });
    };

    //创建营业时间
    getdoBusinessTime = () => {
        const arr1 = [];
        const arr2 = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                arr1.push({label: '0' + i + '时', value: '0' + i + ':'});
            } else {
                arr1.push({label: i.toString() + '时', value: i.toString() + ':'});
            }
        }
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                arr2.push({label: '0' + i + '分', value: '0' + i});
            } else {
                arr2.push({label: i.toString() + '分', value: i.toString()});
            }
        }
        this.setState((prevState) => {
            const arr = prevState.date;
            arr.push(arr1);
            arr.push(arr2);
            return {
                date: arr
            };
        });
    };

    //设置开店时间
    setOpenTime = (val, type) => {
        const {date} = this.state;
        const result1 = date[0].find(item => item.value === val[0].toString());
        const result2 = date[1].find(item => item.value === val[1].toString());
        const arr = [];
        arr.push(result1.value);
        arr.push(result2.value);
        if (type === 'open') {
            this.setState({
                oTValue: val,
                openTime: arr.join('')
            });
        }
        if (type === 'close') {
            this.setState({
                cTValue: val,
                closeTime: arr.join('')
            });
        }
    };

    //获取行业分类id和名称
    category = (val) => {
        const {category} = this.state;
        const values = val.toString();
        const result = category.find((item) => item.value === values);
        this.setState({
            cValue: val,
            cateId: result.value,
            cateName: result.label
        });
    };

    //点击下一步,跳转开店人信息
    editModalMain = () => {
        const {getFieldDecorator} = this.props.form;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        const {
            shopName, address, discount, linkName, cshPhone, addressStatus,
            category, cValue, text, date, oTValue, cTValue, openTime, closeTime,
            updateAudit, province, urban, county, shopStatus, phone, editStatus
        } = this.state;
        return (
            <div>
                <AppNavBar title="店铺信息"/>
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
                            {getFieldDecorator('shopName', {
                                initialValue: shopName,
                                rules: [
                                    {validator: this.checkShopName}
                                ],
                                validateTrigger: 'postInformation'//校验值的时机
                            })(
                                <InputItem
                                    // value={shopName}
                                    clear
                                    placeholder="请输入2-30位店铺名称"
                                    maxLength={30}
                                    type="text"
                                    // onChange={val => this.onChange(val, 'shopname')}
                                >店铺名称
                                </InputItem>
                            )}
                            {
                                getFieldDecorator('category', {
                                    initialValue: cValue,
                                    rules: [
                                        //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                        {validator: this.checkCate}
                                    ],
                                    validateTrigger: 'postInformation'//校验值的时机
                                })(
                                    <Picker
                                        data={category}
                                        cols={1}
                                        // value={cValue}
                                        onChange={(val) => this.category(val)}
                                    >
                                        <List.Item arrow="horizontal" onClick={this.onClick}>主营行业</List.Item>
                                    </Picker>
                                )
                            }
                            {
                                getFieldDecorator('area', {
                                    initialValue: cValue,
                                    rules: [
                                        {validator: this.checkArea}
                                    ],
                                    validateTrigger: 'postInformation'//校验值的时机
                                })(
                                    <List.Item arrow="horizontal" className="area">
                                        <span>区域选择</span>
                                        {
                                            addressStatus === '1' && (
                                                <Region
                                                    onSetProvince={this.setProvince}
                                                    onSetCity={this.setCity}
                                                    onSetCounty={this.setCounty}
                                                    provinceValue={province}
                                                    cityValue={urban}
                                                    countyValue={county}
                                                    provinceId={updateAudit.province_id}
                                                    cityId={updateAudit.city_id}
                                                    editStatus={editStatus}
                                                    editStatusChange={this.editStatusChange}
                                                />
                                            )
                                        }
                                        {
                                            addressStatus === '' && (
                                                <Region
                                                    onSetProvince={this.setProvince}
                                                    onSetCity={this.setCity}
                                                    onSetCounty={this.setCounty}
                                                    add
                                                />
                                            )
                                        }
                                    </List.Item>
                                )
                            }
                            {
                                getFieldDecorator('address', {
                                    initialValue: address,
                                    rules: [
                                        {validator: this.checkAddress}
                                    ],
                                    validateTrigger: 'postInformation'//校验值的时机
                                })(
                                    <TextareaItem
                                        // value={address}
                                        placeholder="请输入详细地址"
                                        rows={5}
                                        className="text-area"
                                        // onChange={val => this.onChange(val, 'address')}
                                    />
                                )
                            }

                            <List.Item onClick={this.onClick} className="doBusiness-time">
                                {
                                    getFieldDecorator('openTime', {
                                        initialValue: oTValue,
                                        rules: [
                                            {validator: this.checkOpenTime}
                                        ],
                                        validateTrigger: 'postInformation'//校验值的时机
                                    })(
                                        <Fragment>
                                            <span>营业时间</span>
                                            <div className="select-openTime">
                                                <Picker
                                                    data={date}
                                                    title="开店时间"
                                                    extra="请选择(可选)"
                                                    cascade={false}
                                                    // value={oTValue}
                                                    onOk={v => this.setOpenTime(v, 'open')}
                                                >
                                                    <span
                                                        className={this.state.openTime ? 'chose' : 'select'}
                                                    >{openTime || '请选择'}
                                                    </span>
                                                </Picker>
                                            </div>
                                        </Fragment>
                                    )
                                }
                                {
                                    getFieldDecorator('closeTime', {
                                        initialValue: cTValue,
                                        rules: [
                                            {validator: this.checkOpenTime}
                                        ],
                                        validateTrigger: 'postInformation'//校验值的时机
                                    })(
                                        <Fragment>
                                            <span className="curved-line">~</span>
                                            <div className="select-closeTime">
                                                <Picker
                                                    data={date}
                                                    title="打烊时间"
                                                    extra="请选择(可选)"
                                                    cascade={false}
                                                    // value={cTValue}
                                                    onOk={v => this.setOpenTime(v, 'close')}
                                                >
                                                    <span
                                                        className={this.state.closeTime ? 'chose' : 'select'}
                                                    >{closeTime || '请选择'}
                                                    </span>
                                                </Picker>
                                            </div>
                                        </Fragment>
                                    )
                                }
                            </List.Item>
                            {
                                getFieldDecorator('discount', {
                                    initialValue: discount || '',
                                    rules: [
                                        {validator: this.checkDiscount}
                                    ],
                                    validateTrigger: 'postInformation'//校验值的时机
                                })(
                                    <InputItem
                                        clear
                                        placeholder="请设置8~ 9.5折"
                                        // value={discount}
                                        type="text"
                                        // onChange={val => this.onChange(val, 'discount')}
                                    >收款码折扣
                                        <span className="nani" onClick={this.openMod}>?</span>
                                    </InputItem>
                                )
                            }
                            {
                                getFieldDecorator('shopStatus', {
                                    initialValue: shopStatus,
                                    rules: [
                                        {validator: this.checkShopStatus}
                                    ],
                                    validateTrigger: 'postInformation'//校验值的时机
                                })(
                                    <div className="merchant-state">
                                        <span className="state-left">商户状态</span>
                                        <span className="state-right">
                                            {/* {data.map(i => (
                                                <RadioItem
                                                    key={i.value}
                                                    checked={shopStatus === i.value}
                                                    onChange={() => this.onChecked(i.value)}
                                                >
                                                    {i.label}
                                                </RadioItem>
                                            ))}*/}
                                            {
                                                data.map(i => (
                                                    <div onClick={() => this.onChecked(i.value)} className="merchant" key={i.value}>
                                                        <span className={`switch-icon icon ${i.value === shopStatus ? 'switch-red' : ''}`}/>
                                                        <span>{i.label}</span>
                                                    </div>
                                                ))
                                            }
                                        </span>
                                    </div>
                                )
                            }
                            <div className="showInfo">
                                {text}
                            </div>
                        </List>
                    </div>
                    <List>
                        {
                            getFieldDecorator('casPhone', {
                                initialValue: cshPhone,
                                rules: [
                                    {validator: this.checkCasPhone}
                                ],
                                validateTrigger: 'postInformation'//校验值的时机
                            })(
                                <InputItem
                                    // value={cshPhone}
                                    maxLength={12}
                                    clear
                                    placeholder="请输入客服电话"
                                >客服电话
                                </InputItem>
                            )
                        }

                        {
                            getFieldDecorator('linkName', {
                                initialValue: linkName,
                                rules: [
                                    {validator: this.checkLinkName}
                                ],
                                validateTrigger: 'postInformation'//校验值的时机
                            })(
                                <InputItem
                                    // value={linkName}
                                    clear
                                    placeholder="开店人姓名"
                                    // onChange={val => this.onChange(val, 'linkName')}
                                >开店人姓名
                                </InputItem>
                            )
                        }
                        {
                            getFieldDecorator('phone', {
                                initialValue: phone,
                                rules: [
                                    {validator: this.checkPhone}
                                ],
                                validateTrigger: 'postInformation'//校验值的时机
                            })(
                                <InputItem
                                    // value={phone}
                                    clear
                                    placeholder="开店人手机号"
                                    type="phone"
                                    // onChange={val => this.onChange(val, 'phone')}
                                >开店人电话
                                </InputItem>
                            )
                        }

                    </List>
                </div>
                <div className="button">
                    {/*<div className="large-button general">先保存，下次填</div>*/}
                    <div className="large-button important" onClick={() => this.postInformation()}>填好了，下一步</div>
                </div>
                <Modal
                    className="modal-text"
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    footer={[{
                        text: '知道了',
                        onPress: () => {
                            this.onClose();
                        }
                    }]}
                >
                    <div>
                        收款码折扣指商家进行二维码收款时的实际到账比例及相应的消费者的记账量比例。如商家设置9.5折，消费者扫二维码付款10元，将累计5记账量，收款商家实际到账9.5元。
                    </div>
                </Modal>
            </div>

        );
    };

    render() {
        return (
            this.editModalMain()
        );
    }
}
export default createForm()(PersonalOne);
