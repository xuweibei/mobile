import {Route, Redirect} from 'react-router-dom';

const HomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './Home'),
    loading: () => null
});

const searchPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './Search'),
    loading: () => null
});

const Home = () => {
    if (!process.env.NATIVE) {
        return (
            <React.Fragment>
                <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                <Route path="/home" component={HomePage}/>
                <Route path="/search" component={searchPage}/>
            </React.Fragment>
        );
    }
    return (
        <Route path="/search" component={searchPage}/>
    );
};

export default Home;
