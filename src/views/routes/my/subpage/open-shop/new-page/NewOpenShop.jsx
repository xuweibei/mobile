// import {useEffect, useState} from 'react';
import './NewOpenShop.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {native, showInfo} = Utils;
export default class OpenShop extends BaseComponent {
    state = {
        qrCode: '', // 二维码
        banner: '', // banner
        url: ''
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.fetch(urlCfg.getQrCode).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    qrCode: res.data.qrcode,
                    url: res.data.url,
                    banner: res.data.shop
                });
            }
        });
    }

    //保存图片
    saveImg = () => {
        const {qrCode} = this.state;
        if (qrCode) {
            native('savePicCallback', {type: 2, imgUrl: qrCode});
        } else {
            showInfo('暂无图片可以保存');
        }
    };

    render() {
        const {banner, qrCode, url} = this.state;
        return (
            <div className="open-shop">
                <AppNavBar
                    title="我要开店"
                    nativeGoBack
                />
                <img src={banner} alt="" className="shop-banner"/>
                <div className="shop-content">
                    <div className="runtime-title">
                        <div>1</div>
                        <div>小程序申请</div>
                    </div>
                    <p className="runtime-desc">保存下方小程序二维码，扫码进入小程序后点击我的店铺进行申请</p>
                    <div className="runtime-img">
                        <div>
                            <img src={qrCode} alt="" className="img-show"/>
                            {
                                window.isWX ? (
                                    <p onClick={this.saveImg}>长按保存二维码</p>
                                ) : (
                                    <p onClick={this.saveImg}>点击保存二维码</p>
                                )
                            }
                        </div>
                    </div>

                    <div className="client-title runtime-title">
                        <div>2</div>
                        <div>电脑端申请</div>
                    </div>

                    <div className="client-desc runtime-desc">
                        进入网址{process.env.NATIVE ? url : <span>{url}</span>} 登陆后即可进行开店申请
                    </div>
                </div>
            </div>
        );
    }
}