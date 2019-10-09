/**发表评论 */
// FIXME: 需要优化
//已优化
import React from 'react';
import './MyEvaluate.less';
import {dropByCacheKey} from 'react-router-cache-route';
import {Radio, Flex, TextareaItem, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {appHistory, getUrlParam, dealImage, showInfo, showSuccess, native, setNavColor} = Utils;
const {MESSAGE: {Form, Feedback}, IMGSIZE, navColorF} = Constants;
//评价 好评 中评 差评
const evaluates = [
    {value: 1, title: '好评'},
    {value: 2, title: '中评'},
    {value: 3, title: '差评'}
];

//店铺评价、物流评分
const appraises = [
    {index: 1},
    {index: 2},
    {index: 3},
    {index: 4},
    {index: 5}
];
const hybird = process.env.NATIVE;

export default class MyEvaluate extends BaseComponent {
    state = {
        files: {}, //上传图片张数（最多）二维数组
        evaluate: [], //评价商品数量
        estimate: [], //不同商品评价状态、好评、中评、差评
        discuss: [], //获取评价内容
        anonymous: true, //是否匿名评价
        shop: 0, //店铺评分
        logistics: 0, //物流评分
        filerAll: [], //请求图片提交集合
        selfHelp: ''//判断是否是从自提页面过来评价 2 是
    };

    componentDidMount() {
        //获取订单ID
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const assess = decodeURI(getUrlParam('assess', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.orderAppraise, {data: {id}}).subscribe((res) => {
            if (res.status === 0) {
                const arrly = [];
                const array = [];
                const pic = [];
                for (let i = 0; i < res.list.length; i++) {
                    arrly.push(1);
                    array.push('');
                    pic.push([]);
                }
                res.list.forEach(item => {
                    item.nativePicNum = 9; //设置原生状态下，可以选择图片的数量
                });
                this.setState({
                    evaluate: res.list, //获取订单商品
                    estimate: arrly, //获取订单的 商品数量 不同商品评价状态先默认为1
                    discuss: array, //获取商品的评价内容数量 先以空字符串push进去相对应的数量
                    files: pic, //获取订单的商品数量，先以空数组push进去相对应的数量
                    selfHelp: assess //等于2 为是从自提过来的评价
                });
            }
        });
    }

    componentWillMount() {
        if (hybird) { //设置tab颜色
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    //获取商品评价状态、好评、中评、差评
    onChange = (data) => {
        const {estimate} = this.state;
        const array = estimate.concat([]);
        array.splice(data[1], 1, data[0]);
        this.setState({
            estimate: array
        });
    }

    //获取商品评价内容
    discuss = (index, data) => {
        const {discuss} = this.state;
        const array = discuss.concat([]);
        array.splice(index, 1, data);
        this.setState({
            discuss: array
        });
    }

    //获取商品上传图片
    increase = (index, filer) => {
        //限制图片上传大小
        filer = filer.filter(item => {
            if (item.file.size < IMGSIZE) {
                return item;
            }
            return showInfo(Feedback.DOT_TWOM);
        });
        const {filerAll} = this.state;
        const wxUrl = filer.map((imgB) => {
            const objTemp = {
                url: '',
                urlB: ''
            };
            dealImage(imgB, 100, (imgSX) => { //小图片压缩 图片信息 图片大下 返回压缩图片路径
                objTemp.url = imgSX;
            });
            dealImage(imgB, 800, (imgD) => { //大图片压缩 图片信息 图片大下 返回压缩图片路径
                objTemp.urlB = imgD;
            });
            return objTemp;
        });
        const {files} = this.state;
        //将原数组重新赋值给array 数组赋值问题
        const array = files.concat([]);
        //将对应的商品图片 替换到array相对应的位置
        array[index] = wxUrl;
        filerAll[index] = filer;
        this.setState({
            files: array,
            filerAll: filerAll
        });
    }

    //点击添加图片
    addPictrue = (data, index) => {
        if (hybird) {
            native('picCallback', {num: data.nativePicNum}).then(res => {
                const {files, evaluate} = this.state;
                const arr = [];
                res.data.img.forEach(item => {
                    arr.push({urlB: item[0], url: item[1], id: new Date(), nativePicNum: 9});
                });
                if (files[index]) {
                    files.forEach((item, num) => {
                        if (num === index) {
                            item.push(...arr);
                            evaluate.forEach((value, i) => {
                                if (i === index) {
                                    value.nativePicNum = 9 - item.length;//动态计算原生可选择图片的数量
                                }
                            });
                        }
                    });
                } else {
                    files[index] = arr;
                    evaluate[index].nativePicNum = 8;//动态计算原生可选择图片的数量
                }
                this.setState({
                    files: [...files],
                    evaluate
                });
            });
        }
    };

    //点击删除图片
    deleteImg = (id, index) => {
        const {files, evaluate} = this.state;
        const arr = [];
        files.forEach((item, num) => {
            item = item.filter(data => data.id !== id);
            item.forEach(data => {
                if (data.id !== id) {
                    evaluate[num].nativePicNum = 9 - item.length;//动态计算原生可选择图片的数量
                }
            });
            arr.push(item);
        });
        this.setState({
            files: [...arr],
            evaluate
        });
    };

    //是否匿名评价
    anonymous = () => {
        this.setState(prevState => ({
            anonymous: !prevState.anonymous
        }));
    }

    //店铺评分 星级
    grade = (index) => {
        this.setState({
            shop: index
        });
    }

    //物流评分 星级
    logistics = (index) => {
        this.setState({
            logistics: index
        });
    }

    //发布评价
    evaluationSuccess = () => {
        const {evaluate, estimate, discuss, anonymous, shop, logistics, files, selfHelp} = this.state;
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        //判断店铺 物流是否评分
        if (!shop) {
            showInfo(Form.No_EvaluateShop);
            return;
        }
        if ((!logistics && selfHelp !== '2')) {
            showInfo(Form.No_EvaluateLogistics);
            return;
        }
        for (let i = 0; i < evaluate.length; i++) {
            this.fetch(urlCfg.publishAssess, {data: {
                pr_id: evaluate[i].pr_id,
                order_id: id,
                mark_type: estimate[i],
                types: 0,
                content: discuss[i],
                pr_title: evaluate[i].pr_title,
                anonymous: anonymous ? '1' : '0',
                shop_mark: shop,
                logistics_mark: selfHelp === '2' ? '' : logistics,
                property_content: evaluate[i].property_content,
                have_pic: files[i].length > 0 ? 1 : ''
            }}).subscribe((res) => {
                if (res.status === 0) {
                    if (!files[i] || files[i].length === 0) {
                        showSuccess(Feedback.Evaluate_Success);
                        dropByCacheKey('OrderPage');
                        setTimeout(() => { appHistory.replace('/evaluationSuccess') }, 1000);
                    } else {
                        for (let r = 0; r < files[i].length; r++) {
                            this.fetch(urlCfg.picSave, {data: {
                                type: 1,
                                id: res.id,
                                ix: r,
                                num: files[i].length,
                                filex: encodeURIComponent(files[i][r].url),
                                file: encodeURIComponent(files[i][r].urlB)
                            }}).subscribe((resr) => {
                                if (resr.status === 0) {
                                    showSuccess(Feedback.Evaluate_Success);
                                    dropByCacheKey('OrderPage');
                                    setTimeout(() => { appHistory.replace('/evaluationSuccess') }, 1000);
                                }
                            });
                        }
                    }
                }
            });
        }
    };

    render() {
        const {estimate, filerAll, files, evaluate, anonymous, shop, logistics, selfHelp} = this.state;
        return (
            <div data-component="MyEvaluate" data-role="page" className="MyEvaluate">
                {/*评论头部*/}
                <AppNavBar title="发表评论"/>
                <div className="contents">
                    {evaluate.map((item, index) => (
                        <div className="appraise">
                            <div className="trade-box">
                                <div className="trade-name">
                                    <img src={item.picpath} alt=""/>
                                    <div className="choice">
                                        {evaluates.map(items => (
                                            <Flex>
                                                <Flex.Item style={{padding: '15px 0', color: '#333', flex: 'none'}}></Flex.Item>
                                                <Flex.Item>
                                                    <Radio checked={estimate[index] === items.value} onChange={this.onChange.bind(this, [items.value, index])}>{items.title}</Radio>
                                                </Flex.Item>
                                            </Flex>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="side-margin">
                                <div className="describes">
                                    <TextareaItem
                                        placeholder="请输入您对该商品的评价"
                                        rows="3"
                                        count={500}
                                        onChange={(data) => this.discuss(index, data)}
                                    />
                                    <div className="upload-img">
                                        <div className="img-list">
                                            {
                                                hybird ? (
                                                    <div className="picture-area">
                                                        <ul>
                                                            {
                                                                files[index] && files[index].map((value, num) => num < 9 && (
                                                                    <li id={value.id}>
                                                                        <span onClick={() => this.deleteImg(value.id, index)}>×</span>
                                                                        <img src={value.url}/>
                                                                    </li>
                                                                ))
                                                            }
                                                            {
                                                                (!files[index] || files[index].length < 9) && (
                                                                    <li className="imgAdd-button" onClick={() => this.addPictrue(item, index)}>
                                                                        <span>+</span>
                                                                    </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <ImagePicker
                                                        files={filerAll[index]}
                                                        onChange={(file) => this.increase(index, file)}
                                                        selectable={(filerAll[index] ? filerAll[index].length : 1) < 9}
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="Comment-content">
                        <div className="side-margin">
                            <div className="anonymous">
                                <Flex>
                                    <Flex.Item style={{padding: '15px 0', color: '#333', flex: 'none'}}></Flex.Item>
                                    <Flex.Item>
                                        <Radio checked={anonymous} onClick={this.anonymous}>匿名评价</Radio>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </div>
                        <div className="score-box">
                            <div className="side-margin">
                                <div className="score">
                                    <span className="score-left">店铺评价</span>
                                    <span className="score-right">
                                        {appraises.map((item) => (
                                            <span className={`icon ${shop >= item.index ? 'stars' : 'starsRight'}`} onClick={() => this.grade(item.index)}/>
                                        ))}
                                    </span>
                                </div>
                            </div>
                            {/*selfHelp 等于2为自提评价*/}
                            {selfHelp !== '2' && (
                                <div className="side-margin">
                                    <div className="score">
                                        <span className="score-left">物流评分</span>
                                        <span className="score-right">
                                            {appraises.map((item) => (
                                                <span className={`icon ${logistics >= item.index ? 'stars' : 'starsRight'}`} onClick={() => this.logistics(item.index)}/>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="Release">
                            <span className="Release-right" onClick={this.evaluationSuccess}>发布</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
