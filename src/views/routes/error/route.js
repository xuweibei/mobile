import {Route} from 'react-router-dom';
import ErrorPage from './Error';


const Error = () => (
    <Route path="/error" component={ErrorPage}/>
);

export default Error;
