/*
* 收货地址页面
* */
import {Button, SwipeAction} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator} from '../../../../../../redux/baseAction';
import {myActionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Address.less';

const {appHistory, showSuccess} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}} = Constants;

class Address extends BaseComponent {
    state={
        // height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 2.08),
        editShow: false
    }

    componentDidMount() {
        const {addressList, getAddress} = this.props;
        if (!addressList) {
            getAddress();
        }
    }

    //前往新增地址页面
    switchTo = () => {
        appHistory.push('/addAddress');
    };

    //删除地址
    deleteGoods = (id) => {
        const {showConfirm, getAddress} = this.props;
        showConfirm({
            title: '确定删除吗?',
            btnTexts: ['取消', '确定'],
            callbacks: [null, () => {
                this.fetch(urlCfg.deleteAddress, {data: {id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            getAddress();
                        }
                    });
            }]
        });
    }

    //编辑地址
    editAdree = (ev, data) => {
        appHistory.push(`/editAddress?id=${data ? data.id : ''}&status=${data ? '1' : '2'}`);//2是添加，1是编辑
        ev.stopPropagation();
    }

    //点击设置默认地址
    /*setDefault = (info) => {
        this.fetch(urlCfg.addedOrEditedAddress, {
            data: {
                id: info.id,
                linkname: info.linkname,
                linktel: info.linktel,
                pca: info.area,
                address: info.address,
                if_default: 1
            }
        })
            .subscribe(res => {
                if (res.status === 0) {
                    showSuccess(Feedback.Edit_Success);
                    const {getAddress} = this.props;
                    getAddress();
                }
            });
    }*/

    // //点击保存
    // saveData = () => {
    //     const {province, urban, county} = this.state;
    //     const district = [];
    //     if (province) {
    //         district.push(province);
    //     }
    //     if (urban) {
    //         district.push(urban);
    //     }
    //     if (county) {
    //         district.push(county);
    //     }
    //     const account = this.props.form.getFieldsValue().account;
    //     const addressAll = this.props.form.getFieldsValue().addressAll;
    //     const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
    //     const phone = this.props.form.getFieldsValue().phone;
    //     //表单验证
    //     if (!validator.checkRange(2, 20, account)) return showInfo(Form.No_Name);
    //     if (!phone) return showInfo(Form.No_Phone);
    //     if (!validator.checkPhone(validator.wipeOut(phone))) return showInfo(Form.Error_Phone);
    //     if (district.length < 3) return showInfo(Form.Error_Address);
    //     if (!addressAll) return showInfo(Form.Error_Address_Required);
    //     if (addressAll.length < 3) return showInfo(Form.Error_Address_Length);

    //     this.fetch(urlCfg.addedOrEditedAddress, {method: 'post', data: {id: id, linkname: account, linktel: validator.wipeOut(phone), pca: district, address: addressAll, if_default: this.state.defaultState ? '1' : '0'}})
    //         .subscribe(res => {
    //             if (res.status === 0) {
    //                 const {getAddress} = this.props;
    //                 getAddress();
    //                 showSuccess(Feedback.Edit_Success);
    //                 appHistory.goBack();
    //             }
    //         });
    //     return undefined;
    // };

    //保存地址信息
    saveAddress = async (val) => {
        if (this.props.location.search.includes('from')) {
            const {saveAddress} = this.props;
            await saveAddress(val);
            await appHistory.goBack();
        }
    }

    //底部结构
    bottomModal = (adreeArr) => adreeArr.map((item, index) => (
        <SwipeAction
            autoClose
            key={index.toString()}
            right={[
                {
                    text: '删除',
                    style: {backgroundColor: '#E21E13', color: 'white'},
                    onPress: () => this.deleteGoods(item.id)
                }
            ]}
            onOpen={() => this.setState({editShow: true})}
            onClose={() => this.setState({editShow: false})}
        >
            <div className="location-box" onClick={() => { this.saveAddress(item) }}>
                <div className="list-detail" key={index.toString()}>
                    <div className="item-desc">
                        <div className="address-name">{item.area.join('') + item.address}</div>
                        <div className="user-name">
                            {item.if_default === '1' ? <span className="default-address">默认</span> : ''}
                            <span>{item.linkname}</span>
                            <span>{item.linktel}</span>
                        </div>
                    </div>
                    {
                        !this.state.editShow && (
                            <div className="item-button">
                                <div className="button-inner" onClick={(ev) => this.editAdree(ev, item)}>编辑</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </SwipeAction>
    ))

    render() {
        const {addressList} = this.props;
        return (
            <div data-component="address-set" data-role="page" className={`address-set ${window.isWX ? 'WX-address' : ''}`}>
                {
                    window.isWX ? null : (
                        <AppNavBar title="地址管理"/>
                    )
                }
                <div className="add-list">
                    {
                        (addressList && addressList.length > 0)
                            ? this.bottomModal(addressList)
                            : (
                                <div className="no-address">
                                    <div>添加地址</div>
                                </div>
                            )
                    }
                </div>
                <div className="new-address" onClick={(ev) => this.editAdree(ev)}>
                    <Button><i className="add-icon icon"/>添加地址</Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const my = state.get('my');
    return {
        addressList: my.get('addressList')
    };
};

const mapDispatchToProps = {
    showConfirm: baseActionCreator.showConfirm,
    getAddress: myActionCreator.getAddress,
    saveAddress: myActionCreator.saveAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);
