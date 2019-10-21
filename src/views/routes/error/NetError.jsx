/*
* 网络错误组件
* */
import AppNavBar from '../../common/navbar/NavBar';
import Nothing from '../../common/nothing/Nothing';

const {appHistory, native} = Utils;
const {FIELD} = Constants;
const hybird = process.env.NATIVE;
const Error = () => (
    <React.Fragment>
        <AppNavBar title="网络异常"/>
        <Nothing
            text={FIELD.Net_Error}
            title="返回"
            onClick={() => ((hybird && appHistory.length() === 0) ? native('goBack')  : appHistory.goBack())}
        />
    </React.Fragment>
);

export default class NetError extends React.PureComponent {
    render() {
        return <Error/>;
    }
}
