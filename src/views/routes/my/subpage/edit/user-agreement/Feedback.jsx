import {List, TextareaItem, Picker, Button, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import './Feedback.less';

const {appHistory, showInfo, showSuccess, dealImage, native} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;

const seasons = [
    [
        {
            label: '功能异常  不能使用现有功能',
            value: '1'
        },
        {
            label: '其他问题  用的不爽、功能建议都提过来吧',
            value: '2'
        }
    ]
];
const hybird = process.env.NATIVE;

export default class Feedbacks extends BaseComponent {
    state = {
        asyncValue: [], //问题类型
        question: '', //问题反馈
        wxFiles: [], //图片文件
        wxUrl: [], //最后需要的url
        nativeImg: [] //原生图片集合
    };

    //选择图片方法一
    onChange = (files) => {
        this.setState({
            wxFiles: files
        }, () => {
            const {wxFiles} = this.state;
            const wxImg = [];
            wxFiles.forEach((item) => {
                wxImg.push(item);
            });
            const wxUrl = [];
            wxImg.forEach((imgB) => {
                let imgBD = '';
                let imgS = '';
                dealImage(imgB, 100, (imgSX) => {
                    imgS = imgSX;
                });
                dealImage(imgB, 800, (imgD) => {
                    imgBD = imgD;
                });
                setTimeout(() => {
                    wxUrl.push({
                        imgB: imgBD,
                        imgS
                    });
                }, 100);
            });
            this.setState({
                wxUrl: wxUrl
            }, () => {
                console.log(wxUrl);
            });
        });
    };

    //选择图片方法二
    // onChange = (files) => {
    //     this.setState({
    //         wxFiles: files
    //     }, () => {
    //         const {wxFiles} = this.state;
    //         const wxImg = [];
    //         wxFiles.forEach((item) => {
    //             wxImg.push(item);
    //         });
    //         const wxUrl = [];
    //         files.forEach((img, number) => {
    //             dealImage(img, 100, (imgs) => {
    //                 if (wxUrl.length === 0) {
    //                     wxUrl.push({
    //                         imgS: imgs
    //                     });
    //                 } else {
    //                     wxUrl.forEach((item, num) => {
    //                         if (number === num) {
    //                             item.imgS = imgs;
    //                         } else if (number - num === 1) {
    //                             wxUrl.push({
    //                                 imgS: imgs
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //             dealImage(img, 800, (imgb) => {
    //                 wxUrl.forEach((item, num) => {
    //                     if (number === num) {
    //                         item.imgB = imgb;
    //                     }
    //                 });
    //             });
    //         });
    //         this.setState({
    //             wxUrl: wxUrl
    //         });
    //     });
    // };

    //点击添加图片
    addPictrue = () => {
        if (hybird) {
            native('picCallback', {num: 9}).then(res => {
                const arr = [];
                res.data.img.forEach(item => {
                    arr.push({imgB: item[0], imgS: item[1], id: new Date()});
                });
                this.setState((proveState) => ({
                    nativeImg: proveState.nativeImg.concat(arr)
                }));
            });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        const {nativeImg} = this.state;
        this.setState({
            nativeImg: nativeImg.filter(item => item.id !== id)
        });
    };

    //提交申请
    submit = () => {
        const {asyncValue, question, wxUrl, nativeImg} = this.state;
        if (asyncValue.length === 0) {
            showInfo(Form.No_IssueType);
            return;
        }
        if (!question) {
            showInfo(Form.No_IssueDescribe);
            return;
        }
        this.fetch(urlCfg.questionFeedback, {method: 'post', data: {question_type: asyncValue[0], question: question}})
            .subscribe(res => {
                const arr = hybird ? nativeImg : wxUrl;
                if (res.status === 0) {
                    arr.forEach(item => {
                        item.imgB = encodeURIComponent(item.imgB);
                        item.imgS = encodeURIComponent(item.imgS);
                    });
                    if (arr.length > 0) {
                        arr.forEach((item, index) => {
                            this.fetch(urlCfg.pictureUploadBase, {
                                method: 'post',
                                data: {
                                    id: res.id,
                                    type: 3,
                                    ix: index,
                                    num: arr.length,
                                    file: item.imgB,
                                    filex: item.imgS
                                }
                            }).subscribe(value => {
                                if (value.status === 0) {
                                    showSuccess(Feedback.Feedback_Success);
                                    appHistory.goBack();
                                }
                            });
                        });
                    } else {
                        showSuccess(Feedback.Feedback_Success);
                        appHistory.goBack();
                    }
                }
            });
        // FIXME: 这个跟没有返回值是一样的
        //已优化
    };

    render() {
        const {wxFiles, nativeImg} = this.state;
        return (
            <div data-component="Feedback" data-role="page" className="feed-back">
                <AppNavBar title="我要反馈"/>
                <div className={`feedback-box ${window.isWX ? 'WX-feedback-box' : ''}`}>
                    <div className="feedback-type">请选择反馈问题的类型</div>
                    <div className="choice">
                        <div className="choice-top">
                            <Picker
                                data={seasons}
                                cascade={false}
                                cols={1}
                                value={this.state.asyncValue}
                                onChange={data => this.setState({asyncValue: data})}
                            >
                                {/*FIXME: 为什么留一个空的元素*/}
                                {/* 没有内容展示不出选择 */}
                                <List.Item/>
                            </Picker>
                        </div>
                    </div>
                    <div className="opinion">问题和意见</div>
                    <List>
                        <TextareaItem
                            rows={3}
                            onChange={data => this.setState({question: data})}
                            placeholder="请描述您使用中品优购时遇到的问题和意见，若功能异常，上传页面截图反馈更加准确噢！（亲，商品评价不在这提交哦）"
                        />
                    </List>
                    <div className="feedback-type">添加图片（选填，提供问题截图）</div>
                    {
                        hybird ? (
                            <div className="picture-area">
                                <ul>
                                    {
                                        nativeImg && nativeImg.map(item => (
                                            <li id={item.id}>
                                                <span onClick={() => this.deleteImg(item.id)}>×</span>
                                                <img src={item.imgS}/>
                                            </li>
                                        ))
                                    }
                                    <li className="imgAdd-button" onClick={() => this.addPictrue()}>
                                        <span>+</span>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <ImagePicker
                                files={wxFiles}
                                onChange={(files, type, index) => this.onChange(files, type, index)}
                                selectable={(wxFiles ? wxFiles.length : 1) < 9}
                                multiple
                            />
                        )
                    }
                    <Button className="sure" onClick={this.submit}>提交申请</Button>
                </div>
            </div>
        );
    }
}
