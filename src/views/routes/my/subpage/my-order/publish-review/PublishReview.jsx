/**发表追评 */

import React from 'react';
import {List, TextareaItem, ImagePicker, WingBlank} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './PublishReview.less';

const {getUrlParam, dealImage, showInfo, showSuccess, appHistory, native} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;
const hybrid = process.env.NATIVE;
export default class PublishReview extends BaseComponent {
    state = {
        files: [], //展示图片集合
        fileArr: [], //请求图片集合
        publishInfo: [], //商品信息集合
        nativePicNum: 9 //原生选择图片的数量
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.rublishReview, {method: 'post', data: {id}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        publishInfo: res.data
                    });
                }
            });
    }

    //图片选择
    onChange = (files) => {
        const fileArr = files.map((imgB) => {
            const objTemp = {
                url: '',
                urlB: ''
            };
            dealImage(imgB, 100, (imgSX) => {
                objTemp.url = imgSX;
            });
            dealImage(imgB, 800, (imgD) => {
                objTemp.urlB = imgD;
            });
            return objTemp;
        });
        this.setState({
            files,
            fileArr
        });
    }

    //原生图片选择
    addPictrue = () => {
        const {nativePicNum} = this.state;
        if (hybrid) {
            native('picCallback', {num: nativePicNum}).then(res => {
                const {fileArr} = this.state;
                const arr = fileArr;
                res.data.img.forEach((item, index) => {
                    arr.push({imgB: item[0], imgS: item[1], id: new Date()});
                });
                this.setState({
                    fileArr: arr,
                    nativePicNum: 9 - arr.length
                });
            });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        const {fileArr} = this.state;
        const arr = fileArr.filter(item => item.id !== id);
        this.setState({
            fileArr: [...arr],
            nativePicNum: 9 - arr.length
        });
    };

    //发表追评
    submit = () => {
        const {fileArr, textValue}  = this.state;
        if (!textValue) {
            showInfo(Form.No_Evaluate);
            return;
        }
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.publishAReview, {method: 'post', data: {pingjia_id: id, content: textValue, have_pic: fileArr.length > 0 ? 1 : ''}})
            .subscribe(res => {
                if (res.status === 0) {
                    if (fileArr.length > 0) {
                        fileArr.forEach((item, index) => {
                            if (index <= 9) {
                                this.fetch(urlCfg.pictureUploadBase,
                                    {method: 'post',
                                        data: {
                                            id: res.id,
                                            type: 1,
                                            ix: index,
                                            num: fileArr.length,
                                            file: encodeURIComponent(item.url),
                                            filex: encodeURIComponent(item.urlB)
                                        }
                                    }).subscribe(data => {
                                    if (data.status === 0) {
                                        showSuccess(Feedback.Evaluate_Success);
                                        dropByCacheKey('PossessEvaluate');
                                        appHistory.replace('/evaluationSuccess');
                                    }
                                });
                            }
                        });
                    } else {
                        showSuccess(Feedback.Evaluate_Success);
                        dropByCacheKey('PossessEvaluate');
                        appHistory.replace('/evaluationSuccess');
                    }
                }
            });
        // FIXME: 这个跟不返回是一样的效果
        //已优化
    }

    goToGoods = () => {
        appHistory.push(`/goodsDetail?id=${this.state.publishInfo.pr_id}`);
    }

    textValue = (value) => {
        this.setState({
            textValue: value
        });
    }

    render() {
        const {files, publishInfo, fileArr} = this.state;
        console.log(fileArr, '是地方个地方');
        return (
            <div data-component="publish-review" data-role="page" className="publish-review">
                <AppNavBar title="发表追评"/>
                <div className="shared-margin-box">
                    <div className="shared-margin">
                        <div className="commodity" onClick={this.goToGoods}>
                            <img src={publishInfo.picpath} alt=""/>
                            <div className="commodity-right">{publishInfo.pr_title}</div>
                        </div>
                        <List>
                            <TextareaItem
                                placeholder="已经用了一段时间了，有更多的惊喜发现？分享给想买的他们吧"
                                data-seed="logId"
                                autoHeight
                                onChange={this.textValue}
                                count={200}
                            />
                        </List>
                        <WingBlank>
                            {
                                hybrid ? (
                                    <div className="picture-area">
                                        <ul>
                                            {
                                                fileArr && fileArr.map((value, index) => index < 9 && (
                                                    <li id={value.id}>
                                                        <span onClick={() => this.deleteImg(value.id)}>×</span>
                                                        <img src={value.imgS}/>
                                                    </li>
                                                ))
                                            }
                                            {
                                                fileArr && fileArr.length < 9 && (
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
                                        onChange={this.onChange}
                                        selectable={files.length < 9}
                                        multiple
                                    />
                                )}
                        </WingBlank>
                    </div>
                </div>
                <div className="button-box">
                    <div className="button large-button important" onClick={this.submit}>
                        <span>发布追评</span>
                    </div>
                </div>
            </div>
        );
    }
}
