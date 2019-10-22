/**
 * Epics 文件.
 */
import {combineEpics} from 'redux-observable';
import * as myEpics from '../views/routes/my/actions/epics/index';
import * as baseEpic from './epics/index';

const epics = {
    ...myEpics,
    ...baseEpic

};
const epicsArray = [];
Object.keys(epics).forEach(epicName => {
    epicsArray.push(epics[epicName]);
});

const rootEpic = combineEpics(
    ...epicsArray
);

export {rootEpic};
