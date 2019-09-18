/**我要开店---个体页面 */


import React from 'react';
import './PersonalTwo.less';
import {List, InputItem, ImagePicker, WingBlank, Flex, DatePicker, Checkbox} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}} = Constants;
const {dealImage, showInfo, native, validator} = Utils;
const hybrid = process.env.NATIVE;
const AgreeItem = Checkbox.AgreeItem;


class PersonalTwo extends BaseComponent {
    state ={
        file: [],
        file2: [],
        file3: [],
        multiple: false,
        userName: '', //用户姓名
        ID: '',
        date: '',
        wxFiles: [], //图片文件
        wxUrl: [],
        flagArr: [false, false, false], //图片上传成功状态
        nativeForward: [], //原生图片 身份证正面
        nativeBack: [], //原生图片 身份证反面
        nativeHand: [], //原生图片 手持身份证
        urlParams: '',
        checked: false,
        disabled: false
    };

    componentDidMount() {
        this.getUpdateAudit();
    }

    //图片转换
    transImg = (file, ix, index) => {
        // const {file} = this.state;
        const {flagArr} = this.state;
        const arr = flagArr;
        if (file.length === 0) {
            arr[index] = false;
            this.setState({
                flagArr: arr
            }, () => {
                console.log(this.state.flagArr);
            });
        }
        if (file && file.length > 0) {
            const img = file[0];
            // console.log(img);
            const wxUrls = [];
            let imgBD = '';
            let imgS = '';
            dealImage(img, 100, imgSX => {
            // console.log(imgSX);
                imgS = imgSX;
            });
            dealImage(img, 800, imgD => {
                imgBD = imgD;
            });
            setTimeout(() => {
                wxUrls.push({
                    imgB: encodeURIComponent(imgBD),
                    imgS: encodeURIComponent(imgS)
                });
                this.setState({
                    wxUrl: wxUrls
                }, () => {
                    const {wxUrl} = this.state;
                    this.fetch(urlCfg.postIDcard, {data: {
                        ix: ix,
                        file: wxUrl[0].imgB,
                        filex: wxUrl[0].imgS
                    }}).subscribe(res => {
                        if (res && res.status === 0) {
                            console.log(res);
                            arr[index] = true;
                            if (res.data.name && res.data.id_num) {
                                this.setState({
                                    flagArr: arr,
                                    userName: res.data.name,
                                    ID: res.data.id_num
                                });
                            }
                            if (res.data.exp) {
                                this.setState({
                                    flagArr: arr,
                                    date: res.data.exp
                                });
                            }
                            showInfo('上传成功');
                        }
                    });
                });
            }, 100);
        }
    };

    //获取审核失败后返回的填过的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.updateAudit, {data: {type: 2}}).subscribe(res => {
            if (res.status === 0 && res.data.length !== 0) {
                console.log(res.data.idcard_exp);
                const {flagArr} = this.state;
                const arr = flagArr;
                const arr1 = [];
                const arr2 = [];
                const arr3 = [];
                let date = '';
                let checked = false;
                let disabled = false;
                if (res.data.pics[0]) {
                    arr[0] = true;
                    arr1.push({url: res.data.pics[0]});
                }
                if (res.data.pics[1]) {
                    arr[1] = true;
                    arr2.push({url: res.data.pics[1]});
                }
                if (res.data.pics[4]) {
                    arr[2] = true;
                    arr3.push({url: res.data.pics[4]});
                }
                if (res.data.idcard_exp) {
                    if (res.data.idcard_exp === '长期有效') {
                        checked = true;
                        disabled = true;
                    } else {
                        date =  new Date(res.data.idcard_exp);
                    }
                }
                this.setState({
                    userName: res.data.mastar_name,
                    ID: res.data.idcard,
                    date,
                    file: arr1,
                    file2: arr2,
                    file3: arr3,
                    flagArr: arr,
                    checked,
                    disabled
                });
            }
        });
    };

    onChange = (files, type) => {
        if (type === 'forward') {
            this.setState({
                file: files
            }, () => {
                const {file} = this.state;
                this.transImg(file, 0, 0);
            });
        } else if (type === 'back') {
            this.setState({
                file2: files
            }, () => {
                const {file2} = this.state;
                this.transImg(file2, 1, 1);
            });
        } else if (type === 'handle') {
            this.setState({
                file3: files
            }, () => {
                const {file3} = this.state;
                this.transImg(file3, 4, 2);
            });
        }
    }

    //原生图片上传的时候的请求
    pasGass = (arrInfo, ix, index) => {
        const {flagArr} = this.state;
        const arr = flagArr;
        this.fetch(urlCfg.postIDcard, {data: {
            ix,
            file: encodeURIComponent(arrInfo[0].imgB),
            filex: encodeURIComponent(arrInfo[0].imgS)
        }}).subscribe(value => {
            if (value && value.status === 0) {
                arr[index] = true;
                if (value.data.name && value.data.id_num) {
                    this.setState({
                        flagArr: arr,
                        userName: value.data.name,
                        ID: value.data.id_num
                    });
                }
                if (value.data.exp) {
                    this.setState({
                        flagArr: arr,
                        date: value.data.exp
                    });
                }
                showInfo('上传成功');
            }
        });
    }

    //点击添加图片
    addPictrue = (type) => {
        const arrInfo = [];
        if (hybrid) {
            if (type === 'forward') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState((proveState) => ({
                        file: proveState.file.concat(arrInfo)
                    }));
                    this.pasGass(arrInfo, 0, 0);
                });
            } else if (type === 'back') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState((proveState) => ({
                        file2: proveState.file2.concat(arrInfo)
                    }));
                    this.pasGass(arrInfo, 2, 1);
                });
            } else {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState((proveState) => ({
                        file3: proveState.file3.concat(arrInfo)
                    }));
                    this.pasGass(arrInfo, 4, 2);
                });
            }
        }
    };

    //点击删除图片
    deleteImg = (type, id) => {
        const {file, file2, file3} = this.state;
        if (type === 'forward') {
            this.setState({
                file: file.filter(item => item.id !== id)
            });
        } else if (type === 'back') {
            this.setState({
                file2: file2.filter(item => item.id !== id)
            });
        } else {
            this.setState({
                file3: file3.filter(item => item.id !== id)
            });
        }
    };

     //获取input的输入值
     inputChange = (type, val) => {
         if (type === 'name') {
             this.setState({
                 userName: val
             });
         } else if (type === 'id') {
             this.setState({
                 ID: val
             });
         } else {
             this.setState({
                 date: val
             });
         }
     };

    //检验身份证正面
    checkForward = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[0], Form.No_cardForward, callback)) return;
        callback();
    };

    //检验身份证反面
    checkBack = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[1], Form.No_cardBack, callback)) return;
        callback();
    };

    //j检验手持身份证
    checkHand = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[2], Form.No_cardHand, callback)) return;
        callback();
    };

    //检验用户名
    checkUserName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.Error_UserName, callback)) {
            return;
        }
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.Error_ShopName, callback);
            return;
        }
        callback();
    };

    //效验身份证
    checkIdcard = (rule, value, callback) => {
        if (!validator.ID(value)) {
            validator.showMessage(Form.Error_ID, callback);
            return;
        }
        callback();
    };

    //检验身份证有效期
    checkValidDate = (rule, value, callback) => {
        const {checked} = this.state;
        const result1 = validator.isEmpty(value, Form.No_validDate, callback);
        if (!result1 && !checked) {
            return;
        }
        callback();
    };

    //是否长期有效
    check = (e) => {
        this.setState({
            checked: e.target.checked,
            disabled: e.target.checked
        });
    };

     //提交用户 信息
     gotoNext = () => {
         const {that} = this.props;
         const {form: {validateFields}} = this.props;
         const {userName, ID, checked, flagArr} = this.state;
         const result = flagArr.find(item => item === false);
         validateFields({first: true, force: true}, (error, val) => {
             if (!error && (result !== false)) {
                 const data = Date.parse(val.validDate);
                 const da = new Date(data);
                 const year = da.getFullYear();
                 const month = da.getMonth() + 1;
                 const date = da.getDate();
                 this.setState({
                     date: [year, month, date].join('-')
                 });
                 if (checked) {
                     val.validDate = '长期有效';
                 } else {
                     val.validDate = [year, month, date].join('-');
                 }
                 this.fetch(urlCfg.peopleInformati0n, {
                     data: {
                         mastar_name: userName,
                         idcard: ID,
                         idcard_exp: val.validDate
                     }
                 }).subscribe(res => {
                     if (res) {
                         if (res.status === 0) {
                             showInfo(Feedback.Handle_Success, 1);
                             that.getChildren('three');
                         } else {
                             showInfo(Form.No_correctInfo);
                         }
                     }
                 });
                 return;
             }
             showInfo(Form.No_Prove);
         });
     };

     render() {
         const {form: {getFieldDecorator}} = this.props;
         const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
         const {file, disabled, file2, file3, userName, ID, date, checked} = this.state;
         return (
             <div data-component="personal-two" data-role="page" className="personal-two">
                 <AppNavBar rightExplain title="开店人信息" goBackModal={this.props.goBack}/>
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
                     <div className="ID-photo">
                         <div className="start">开店人证件照</div>
                         <div className="upload-box">
                             <div>
                                 <WingBlank>
                                     {
                                         hybrid ? (
                                             <div className="picture-area">
                                                 <ul>
                                                     {
                                                         file && file.map(item => (
                                                             <li id={item.id}>
                                                                 <span className="delete-icon" onClick={() => this.deleteImg('forward', item.id)}>×</span>
                                                                 <img src={item.imgS}/>
                                                             </li>
                                                         ))
                                                     }
                                                     {
                                                         file.length === 0 && (
                                                             <li className="imgAdd-button" onClick={() => this.addPictrue('forward')}>
                                                                 <span className="imgAdd-icon">+</span>
                                                             </li>
                                                         )
                                                     }
                                                 </ul>
                                             </div>
                                         )
                                             : getFieldDecorator('forward', {
                                                 // initialValue: '',
                                                 rules: [
                                                     {validator: this.checkForward}
                                                 ],
                                                 validateTrigger: 'submit'//校验值的时机
                                             })(
                                                 <ImagePicker
                                                     files={file}
                                                     onChange={(files) => { this.onChange(files, 'forward') }}
                                                     selectable={file.length < 1}
                                                     length={1}
                                                 />
                                             )
                                     }
                                 </WingBlank>
                                 <span>上传身份证正面</span>
                             </div>
                         </div>
                     </div>
                     <div className="ID-photo">
                         <div className="upload-box">
                             <div>
                                 <WingBlank>
                                     {
                                         hybrid ? (
                                             <div className="picture-area">
                                                 <ul>
                                                     {/* <li>
                                                         <span className="delete-icon" onClick={() => this.deleteImg()}>×</span>
                                                         <img src="http://img.redocn.com/sheji/20141219/zhongguofengdaodeliyizhanbanzhijing_3744115.jpg"/>
                                                     </li> */}
                                                     {
                                                         file2 && file2.map(item => (
                                                             <li id={item.id}>
                                                                 <span className="delete-icon" onClick={() => this.deleteImg('back', item.id)}>×</span>
                                                                 <img src={item.imgS}/>
                                                             </li>
                                                         ))
                                                     }
                                                     {
                                                         file2.length === 0 && (
                                                             <li className="imgAdd-button" onClick={() => this.addPictrue('back')}>
                                                                 <span className="imgAdd-icon">+</span>
                                                             </li>
                                                         )
                                                     }
                                                 </ul>
                                             </div>
                                         )
                                             : getFieldDecorator('back', {
                                                 // initialValue: '',
                                                 rules: [
                                                     {validator: this.checkBack}
                                                 ],
                                                 validateTrigger: 'submit'//校验值的时机
                                             })(
                                                 <ImagePicker
                                                     files={file2}
                                                     onChange={(files) => { this.onChange(files, 'back') }}
                                                     selectable={file2.length < 1}
                                                     length={1}
                                                 />
                                             )
                                     }
                                 </WingBlank>
                                 <span>上传身份证背面</span>
                             </div>
                         </div>
                     </div>
                     <div className="ID-photo">
                         <div className="start">开店人手持身份证照</div>
                         <div className="upload-box">
                             <div>
                                 <WingBlank>
                                     {
                                         hybrid ? (
                                             <div className="picture-area">
                                                 <ul>
                                                     {
                                                         file3 && file3.map(item => (
                                                             <li id={item.id}>
                                                                 <span className="delete-icon" onClick={() => this.deleteImg('handle', item.id)}>×</span>
                                                                 <img src={item.imgS}/>
                                                             </li>
                                                         ))
                                                     }
                                                     {
                                                         file3.length === 0 && (
                                                             <li className="imgAdd-button" onClick={() => this.addPictrue('handle')}>
                                                                 <span className="imgAdd-icon">+</span>
                                                             </li>
                                                         )
                                                     }
                                                 </ul>
                                             </div>
                                         ) :  getFieldDecorator('handle', {
                                         // initialValue: '',
                                             rules: [
                                                 {validator: this.checkHand}
                                             ],
                                             validateTrigger: 'submit'//校验值的时机
                                         })(
                                             <ImagePicker
                                                 files={file3}
                                                 onChange={(files) => { this.onChange(files, 'handle') }}
                                                 selectable={file3.length < 1}
                                                 length={1}
                                             />
                                         )
                                     }
                                 </WingBlank>
                                 <span>上传手持身份证照</span>
                             </div>
                         </div>
                     </div>
                     <div>
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
                                             placeholder="请输入真实姓名"
                                             onChange={val => this.inputChange('name', val)}
                                         >姓名
                                         </InputItem>
                                     )
                                 }
                                 {
                                     getFieldDecorator('idCard', {
                                         initialValue: ID,
                                         rules: [
                                             {validator: this.checkIdcard}
                                         ],
                                         validateTrigger: 'submit'//校验值的时机
                                     })(
                                         <InputItem
                                             placeholder="请输入身份证号"
                                             type="number"
                                             maxLength="18"
                                             onChange={val => this.inputChange('id', val)}
                                         >身份证号
                                         </InputItem>
                                     )
                                 }
                                 <div className="card-other">
                                     {
                                         getFieldDecorator('validDate', {
                                             initialValue: date,
                                             rules: [
                                                 {validator: this.checkValidDate}
                                             ],
                                             validateTrigger: 'submit'//校验值的时机
                                         })(
                                             <DatePicker
                                                 className="date"
                                                 disabled={disabled}
                                                 mode="date"
                                                 title="选择有效期"
                                                 format="YYYY-MM-DD"
                                             >
                                                 <List.Item arrow="horizontal">身份证有效期</List.Item>
                                             </DatePicker>
                                         )
                                     }
                                     <AgreeItem data-seed="logId" onChange={e => this.check(e)} checked={checked}>
                                         长期有效
                                     </AgreeItem>
                                 </div>
                             </List>
                         </div>
                     </div>
                 </div>
                 <div className="button">
                     <div className="large-button important" onClick={() => this.gotoNext()}>填好了，下一步</div>
                 </div>
             </div>
         );
     }
}
export default createForm()(PersonalTwo);
