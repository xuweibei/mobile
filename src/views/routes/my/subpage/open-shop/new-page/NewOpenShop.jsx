import {useEffect, useState} from 'react';
import './NewOpenShop.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {native, showInfo} = Utils;
export default () => {
    const [qrCode, setqrCode] = useState('');
    const [banner, setBanner] = useState('');
    const [url, setUrl] = useState('');
    useEffect(() => {
        XHR.fetch(urlCfg.getQrCode).subscribe(res => {
            if (res && res.status === 0) {
                setqrCode(res.data.qrcode);
                setBanner(res.data.shop);
                setUrl(res.data.url);
            }
        });
    }, []);

    // const goTo = () => {
    //     window.open('www.shop.zzha.vip.com');
    // };

    //保存图片
    const saveImg = () => {
        if (qrCode) {
            native('savePicCallback', {type: 2, imgUrl: qrCode});
        } else {
            showInfo('暂无图片可以保存');
        }
    };

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
                                <p onClick={saveImg}>长按保存二维码</p>
                            ) : (
                                <p onClick={saveImg}>点击保存二维码</p>
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
};