import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Chart from './components/Chart';
import Index from './components/Index'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={Index} />
        <Route path="/chart" component={Chart} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
