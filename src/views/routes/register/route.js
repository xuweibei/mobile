import {Route} from 'react-router-dom';
import RegisterPage from './Register';
import SetPassWordPage from './SetPassword';
// import BindPhone from './BindPhone';

const Register = () => (
    <React.Fragment>
        <Route path="/login" component={RegisterPage}/>
        <Route path="/setpassword" component={SetPassWordPage}/>
        {/* <Route path="/bindPhone" component={BindPhone}/> */}
    </React.Fragment>
);

export default Register;
