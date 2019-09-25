/*
* 限制输入框
* */
import React from 'react';
import PropTypes from 'prop-types';
import {InputItem} from 'antd-mobile';

class GeisInputItem extends React.PureComponent {
    static defaultProps = {
        clear: false,
        showPass: false,
        editable: true,
        placeholder: '',
        itemTitle: '',
        maxLength: 30,
        onChange() {},
        type: ''
    };

    static propTypes = {
        placeholder: PropTypes.string,   //inputItem的placeholder
        type: PropTypes.string,   //限制类型
        editable: PropTypes.bool,   //是否可编辑
        showPass: PropTypes.bool, //是否显示密码输入框
        itemTitle: PropTypes.string,     //inputItem的标题
        clear: PropTypes.bool,   //是否可清除
        maxLength: PropTypes.number,  //inputItem的最大长度
        onChange: PropTypes.func     //表单的onChange事件
    };

    state = {
        value: ''
    };

    itemChange = e => {
        const {type} = this.props;
        const reg = new Map([
            ['any', /^(\b).*\S\s?$/], //不能空格或符号开头，中间只能输入一个空格
            ['amount', /^((0)|([1-9]{1}\d{0,7}))(\.\d{0,2})?$/], //金额 邮费 0~99999999.99
            ['discount', /^([8-9]{1})(\.{0,1}\d{1,2})$/], //折扣 8~9.5
            ['stock', /^\d+$/], //输入商品库存
            ['num',  /^\d+$/], //数字输入
            ['numAndBar', /^[\d-]*$/],  //数字和中横线(客服电话)
            ['cn', /^[a-zA-Z\u4e00-\u9fa5]+$/], //中文以及英文字母
            ['numEn', /^[0-9a-zA-Z]+$/],  //数字和英文
            ['es', /^\w+$/], //英文输入
            ['nonSpace', /^[^\s]*$/], //限制不能输入空格
            ['cnEnNum', /^[\u4E00-\u9FA5A-Za-z0-9_]+$/],  //中英文数字
            ['float', /^[0-9]+.?[0-9]*$/]    //可以输入小数的数字
        ]);
        if (!reg.get(type).test(e) && e !== '') return;
        const {onChange} = this.props;
        if (onChange) {
            onChange(e);
            this.setState({
                value: e
            });
        }
    };

    render() {
        const {clear, placeholder, editable, itemTitle, maxLength, showPass} = this.props;
        const {value} = this.state;
        return (
            <InputItem
                value={value}
                clear={clear}
                type={showPass ? 'password' : 'text'}
                placeholder={placeholder}
                editable={editable}
                onChange={this.itemChange}
                maxLength={maxLength}
            >{itemTitle}
            </InputItem>
        );
    }
}
export default GeisInputItem;
