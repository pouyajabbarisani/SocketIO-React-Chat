import { createStore, applyMiddleware, compose } from 'redux';
var thunk = require('redux-thunk').default;


import reducers from './../reducers';


export var config = (initialState = {}) => {
    var store = createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(thunk)
        )
    );
    return store;
}
