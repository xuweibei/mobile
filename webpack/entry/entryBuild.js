/* eslint-disable */
const fs = require('fs');
const path = require('path');
const entry = require('./entry');
const deleteFile = require('./deleteFile');

const MULTI = '../../multi/'; // 入口目录
const entryBuildPath = path.resolve(__dirname, MULTI);

console.log('entryBuildPath', entryBuildPath);
deleteFile(entryBuildPath);
fs.mkdirSync(entryBuildPath);
console.log('entryBuildPath2', entryBuildPath);
const entryContent = (data) => {
    return (
`import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import dsBridge from 'dsbridge';
import {HashRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {baseActionCreator} from '../src/redux/baseAction';
import {syncHistoryWithStore} from 'react-router-redux';
import {store, hashHistory} from '../src/redux/store';
import BasePage from '../src/views/common/base/BasePage';
import {ViewRoutes} from '../src/views/${data.component}';
import '../src/views/${data.less}';


const {getAppUserToken, systemApi: {getValue,setValue}} = Utils;

const {LOCALSTORAGE} = Constants;
const usertoken = store.getState().get('base').get(LOCALSTORAGE.USER_TOKEN) || (getValue(LOCALSTORAGE.USER_TOKEN) === 'null' ? null : getValue(LOCALSTORAGE.USER_TOKEN));
const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
        return state.get('routing').toObject();
    }
});

history.listen((location, action) => {});
const HomePage = () => (
    <Provider store={store}>
        <Router hashHistory={history}>
            <Fragment>
                <BasePage/>
                <ViewRoutes/>
            </Fragment>
        </Router>
    </Provider>
);

//获取userToken
dsBridge.call('wxLoginCallback', (data) => {
    const str = new RegExp('"',"g");
    const userToken = data.replace(str,'').split(':')[1];
    window.localStorage.setItem('userToken',userToken);
    store.dispatch(baseActionCreator.setUserToken(userToken));
    ReactDOM.render(
        <HomePage/>,
        document.getElementById('root')
    );
});
`
    )
};

/*生成webpack entry 入口文件*/
entry.map((data) => {
    fs.writeFile(entryBuildPath + '/' + data.name + '.js', entryContent(data), 'utf8', function (err) {
        console.log('entryBuildPath3', entryBuildPath);
        if (err) {
            return console.log(err);
        }
    });
});
