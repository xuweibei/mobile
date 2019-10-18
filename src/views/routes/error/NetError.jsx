/*
* 网络错误组件
* */
import AppNavBar from '../../common/navbar/NavBar';
import Nothing from '../../common/nothing/Nothing';

const {appHistory, setNavColor} = Utils;
const {FIELD, navColorF} = Constants;
const hybird = process.env.NATIVE;
const Error = () => (
    <React.Fragment>
        <AppNavBar title="网络异常"/>
        <Nothing
            text={FIELD.Net_Error}
            title="返回"
            onClick={() => appHistory.goBack()}
        />
    </React.Fragment>
);

export default class NetError extends React.PureComponent {
    componentWillMount() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (hybird) {
            setNavColor('setNavColor', {color: navColorF});
        }
    }

    render() {
        return <Error/>;
    }
}
