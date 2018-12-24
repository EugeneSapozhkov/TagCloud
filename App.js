import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import T from 'prop-types';
import store from './store';
import Home from './src/containers/Home';
import Tag from './src/containers/Tag';
import NoMatch from './src/containers/NoMatch';

import './assets/styles.scss';

const Root = ({ store }) => (
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/tag" component={Tag} />
				<Route component={NoMatch} />
			</Switch>
		</Router>
	</Provider>
);

Root.propTypes = {
	store: T.object.isRequired
};

render(
	<Root store={store}/>,
	document.getElementById('app')
);