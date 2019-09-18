import CacheRoute from 'react-router-cache-route';
import Im from './index';

const ImModel = () => (
    <React.Fragment>
        <CacheRoute path="/im" component={Im} when="back"/>
    </React.Fragment>
);

export default ImModel;