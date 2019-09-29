/*
* 省市县区域选择
* */

import React from 'react';
import {Picker, Toast} from 'antd-mobile';
import './Region.less';

const {urlCfg} = Configs;

class Region extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            provinceData: [],
            provinceIndex: 0,
            cityData: [],
            cityIndex: 0,
            countyData: [],
            countyIndex: 0,
            judge1: !!props.cityValue,
            judge2: !!props.countyValue
        };
    }

    componentDidMount() {
        const {provinceValue, cityValue, countyValue, provinceId, cityId} = this.props;
        this.getProvince();
        this.setState({
            provinceValue: provinceValue || '请选择所在地区',
            cityValue: cityValue || '请选择所在地区',
            countyValue: countyValue || '请选择所在地区'
        });
        //读取市数组
        if (provinceId) {
            this.getCity(provinceId);
        }
        //读取县数组
        if (cityId) {
            this.getCounty(cityId);
        }
    }

    //判断父级是否更新
    componentWillReceiveProps(nextProps) {
        const {provinceValue} = this.state;
        const {add, editStatus} = this.props;
        if (editStatus && !add && provinceValue !== nextProps.provinceValue) {
            this.setState({
                provinceValue: nextProps.provinceValue,
                countyValue: nextProps.countyValue,
                cityValue: nextProps.cityValue,
                judge1: true,
                judge2: true
            });
            if (nextProps.provinceId) {
                this.getCity(nextProps.provinceId);
            }
            if (nextProps.cityId) {
                this.getCounty(nextProps.cityId);
            }
            this.props.editStatusChange();
        }
    }

    //省
    getProvince() {
        const {provinceId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: 0}})
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            provinceData: res.data
                        });
                        if (provinceId) {
                            this.setState({
                                provinceIndex: this.getIndex(res.data[0], provinceId)
                            });
                        }
                    } if (res.status === 1) {
                        Toast.info(res.message);
                    }
                }
            });
    }

    provinceChange = (e) => {
        const {provinceData} = this.state;
        if (provinceData[0].length === 0) return;
        let provinceName = '';
        // let provinceId = '';
        for (let i = 0; i < provinceData[0].length; i++) {
            if (provinceData[0][i].value === e[0]) {
                provinceName = provinceData[0][i].label;
                // provinceId = provinceData[0][i].value;
            }
        }
        this.setState({
            provinceValue: provinceName,
            cityValue: '请选择所在地区',
            countyValue: '',
            cityIndex: 0,
            countyIndex: 0,
            cityData: [],
            countyData: []
        });
        this.props.onSetProvince(provinceName); //省名字
        // this.props.onSetCity('-请选择-');
        // this.props.onSetCounty('-请选择-');
        this.getCity(e[0]);
    };

    //市
    getCity(cityCode) {
        const {cityId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: cityCode}})
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            cityData: res.data
                        }, () => {
                            if (this.state.provinceValue === '请选择所在地区') {
                                this.setState({
                                    judge1: false
                                });
                            } else {
                                this.setState({
                                    judge1: true
                                });
                            }
                        });
                        if (cityId) {
                            this.setState({
                                cityIndex: this.getIndex(res.data[0], cityId)
                            });
                        }
                    }
                }
            });
    }

    cityChange = (e) => {
        const {cityData} = this.state;
        if (cityData[0].length === 0) return;
        let cityName = '';
        // let cityId = '';
        for (let i = 0; i < cityData[0].length; i++) {
            if (cityData[0][i].value === e[0]) {
                cityName = cityData[0][i].label;
                // cityId = cityData[0][i].value;
            }
        }
        this.setState({
            cityValue: cityName,
            countyValue: '请选择所在地区',
            countyIndex: 0,
            countyData: []
        });
        this.props.onSetCity(cityName); //市名字
        // this.props.onSetCounty('-请选择-');
        this.getCounty(e[0]);
    };

    //县
    getCounty(countyCode) {
        const {countyId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: countyCode}})
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            countyData: res.data
                        }, () => {
                            if (this.state.cityValue === '请选择所在地区') {
                                this.setState({
                                    judge2: false
                                });
                            } else {
                                this.setState({
                                    judge2: true
                                });
                            }
                        });
                        if (countyId) {
                            this.setState({
                                cityIndex: this.getIndex(res.data[0], countyId)
                            });
                        }
                    }
                }
            });
    }

    countyChange = (e) => {
        const {countyData} = this.state;
        const {onCountyId} = this.props;
        if (countyData[0].length === 0) return;
        let countyName = '';
        let countyId = '';
        for (let i = 0; i < countyData[0].length; i++) {
            if (countyData[0][i].value === e[0]) {
                countyName = countyData[0][i].label;
                countyId = countyData[0][i].value;
            }
        }
        this.setState({
            countyValue: countyName
        });
        if (onCountyId) {
            onCountyId(countyId); //县id
        }
        this.props.onSetCounty(countyName); //县名字
    };


    getIndex = (ary, id) => {
        for (let i = 0; i < ary.length; i++) {
            if (ary[i].code === id) {
                return i;
            }
        }
        return undefined;
    }

    render() {
        const {
            provinceData, provinceValue, provinceIndex,
            cityData, cityValue, cityIndex,
            countyData, countyValue, countyIndex,
            judge1, judge2
        } = this.state;
        return (
            <div className="regional">
                <div className={provinceValue === '请选择所在地区' ?  'picker-inline' : 'gray-3'}>
                    <Picker
                        onChange={this.provinceChange}
                        value={provinceIndex}
                        cascade={false}
                        data={provinceData}
                        cols={1}
                    >
                        <div>
                            {provinceValue}
                        </div>
                    </Picker>
                </div>
                {judge1 && (
                    <div className={cityValue === '请选择所在地区' ?  'picker-inline' : 'gray-3'}>
                        <Picker
                            onChange={this.cityChange}
                            value={cityIndex}
                            data={cityData}
                            cascade={false}
                        >
                            <div>
                                {cityValue}
                            </div>
                        </Picker>
                    </div>
                )}
                {judge2 && (
                    <div className={countyValue === '请选择所在地区' ? 'picker-inline' : 'gray-3'}>
                        <Picker
                            onChange={this.countyChange}
                            value={countyIndex}
                            cascade={false}
                            data={countyData}
                        >
                            <div>
                                {countyValue}
                            </div>
                        </Picker>
                    </div>
                )}
            </div>
        );
    }
}

export default Region;
