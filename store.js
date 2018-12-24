import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './src/modules';

const logger = createLogger({
	collapsed: true,
});

const enhancer = compose(
	applyMiddleware(thunk),
	applyMiddleware(logger),
);

const store = createStore(
	reducers,
	composeWithDevTools(enhancer),
);


export default store;
