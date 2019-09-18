/**我要投诉 */
import {TextareaItem, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './MyComplain.less';

const {dealImage, showInfo, appHistory, showSuccess, getUrlParam, native} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}} = Constants;
const hybrid = process.env.NATIVE;
export default class MyComplain extends BaseComponent {
    state = {
        files: [],
        fileMain: []
    };

    //问题反馈内容
    questionMain = (value) => {
        this.setState({
            questionInfo: value
        });
    }

    //图片选择
    uploadPictures = (files) => {
        this.setState({
            files
        }, () => {
            const fileMain = [];
            files.forEach((imgB) => {
                let imgBD = '';
                let imgS = '';
                dealImage(imgB, 100, (imgSX) => {
                    imgS = imgSX;
                });
                dealImage(imgB, 800, (imgD) => {
                    imgBD = imgD;
                });
                setTimeout(() => {
                    fileMain.push({
                        imgB: imgBD,
                        imgS
                    });
                }, 100);
            });
            this.setState({
                fileMain: fileMain
            }, () => {
                console.log(fileMain);
            });
        });
    }

    //提交投诉
    submit = () => {
        const {questionInfo, fileMain} = this.state;
        const orderId = decodeURI(getUrlParam('orderId', encodeURI(this.props.location.search)));
        if (!questionInfo) return showInfo(Form.No_Complain);
        this.fetch(urlCfg.doComplain, {method: 'post', data: {reason: questionInfo, orderid: orderId}})
            .subscribe(res => {
                if (res.status === 0) {
                    fileMain.forEach(item => {
                        item.imgB = encodeURIComponent(item.imgB);
                        item.imgS = encodeURIComponent(item.imgS);
                    });
                    if (fileMain.length > 0) {
                        fileMain.forEach((item, index) => {
                            this.fetch(urlCfg.pictureUploadBase, {
                                method: 'post',
                                data: {
                                    id: res.data.id,
                                    type: 4,
                                    ix: index,
                                    num: fileMain.length,
                                    file: item.imgB,
                                    filex: item.imgS
                                }
                            }).subscribe(value => {
                                if (value.status === 0) {
                                    showSuccess(Feedback.submit_Success);
                                    if (hybrid) {
                                        native('goHome');
                                    } else {
                                        appHistory.push('/home');
                                    }
                                }
                            });
                        });
                    } else {
                        showSuccess(Feedback.submit_Success);
                        if (hybrid) {
                            native('goHome');
                        } else {
                            appHistory.push('/home');
                        }
                    }
                }
            });
        return undefined;
    }

    //原生图片选择
    addPictrue = () => {
        if (hybrid) {
            native('picCallback', {num: 9}).then(res => {
                const arr = [];
                res.data.img.forEach(item => {
                    arr.push({imgB: item[0], imgS: item[1], id: new Date()});
                });
                this.setState((proveState) => ({
                    fileMain: proveState.fileMain.concat(arr)
                }));
            });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        this.setState((proveState) => ({
            fileMain: proveState.fileMain.filter(item => item.id !== id)
        }));
    };

    render() {
        const {files, fileMain} = this.state;
        return (
            <div className="my-Complain">
                <AppNavBar title="我要投诉"/>
                <div className="button-box">
                    <div className="complain-wrap">
                        <div className="complain-content">
                            <div className="complain-text">投诉内容</div>
                            <TextareaItem
                                placeholder="请填写您要投诉的内容"
                                autoHeight
                                rows="4"
                                onChange={this.questionMain}
                            />
                        </div>
                        <div className="complain-img">
                            <div className="img-text">添加图片（选填）</div>
                            {
                                hybrid ? (
                                    <div className="picture-area">
                                        <ul>
                                            {
                                                fileMain && fileMain.map(value => (
                                                    <li id={value.id}>
                                                        <span onClick={() => this.deleteImg(value.id)}>×</span>
                                                        <img src={value.imgS}/>
                                                    </li>
                                                ))
                                            }
                                            {
                                                fileMain && fileMain.length <= 9 && (
                                                    <li className="imgAdd-button" onClick={() => this.addPictrue()}>
                                                        <span>+</span>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                ) : (
                                    <ImagePicker
                                        files={files}
                                        onChange={this.uploadPictures}
                                        selectable={files.length < 9}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="complain-btn">
                        <div className="button large-button important" onClick={this.submit}>
                            <span>立即提交</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
