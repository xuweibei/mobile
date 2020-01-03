/*
* 服务器错误组件
* */
import AppNavBar from '../../common/navbar/NavBar';
import Nothing from '../../common/nothing/Nothing';

const {native, goBackModal} = Utils;
const {FIELD, navColorF} = Constants;
const Error = () => (
    <React.Fragment>
        <AppNavBar title="服务器异常"/>
        <Nothing
            text={FIELD.Server_Error}
            title="返回"
            onClick={goBackModal}
        />
    </React.Fragment>
);

export default class ServerError extends React.PureComponent {
    componentWillMount() {
        if (process.env.NATIVE) {
            native('setNavColor', {color: navColorF});
        }
    }

    componentWillReceiveProps() {
        if (process.env.NATIVE) {
            native('setNavColor', {color: navColorF});
        }
    }

    render() {
        return <Error/>;
    }
}