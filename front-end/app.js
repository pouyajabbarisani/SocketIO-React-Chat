import React from 'react';
const ReactDOM = require('react-dom');
var { Provider } = require('react-redux');

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';


var store = require('configureStore').config();


import Login from './components/Login.js';
import Register from './components/Register.js';
import Chats from './components/Chats.js';
import AuthRoute from './components/AuthRoute.js'

// require('style-loader!css-loader!../public/styles/bundle.css');
// require('script-loader!../public/js/vendor/jquery.js');
// require('script-loader!../public/js/vendor/foundation.min.js');
// require('script-loader!../public/js/app.js');


const routes = (
    <Router>
        <div>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Switch>
                <AuthRoute path="/chat" component={Chats} />
            </Switch>
        </div>
    </Router>

);


ReactDOM.render(
    <Provider store={store}>
        {routes}
    </Provider>,
    document.getElementById('app')
);
