import {useEffect, useState} from 'react';
import './NewOpenShop.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
export default () => {
    const [qrCode, setqrCode] = useState('');
    const [banner, setBanner] = useState('');
    useEffect(() => {
        XHR.fetch(urlCfg.getQrCode).subscribe(res => {
            if (res && res.status === 0) {
                setqrCode(res.data.qrcode);
                setBanner(res.data.shop);
            }
        });
    }, []);

    const goTo = () => {
        window.open('www.shop.zzha.vip.com');
    };
    alert(123);
    return (
        <div className="open-shop">
            <AppNavBar
                title="我要开店"
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
                        <p>点击保存二维码</p>
                    </div>
                </div>

                <div className="client-title runtime-title">
                    <div>1</div>
                    <div>电脑端申请</div>
                </div>

                <div className="client-desc runtime-desc">
                    进入网址<span onClick={goTo}>www.shop.zzha.vip.com</span> 登陆后即可进行开店申请
                </div>
            </div>
        </div>
    );
};