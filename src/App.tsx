/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { memo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from 'src/pages/Dashboard';
import Auth from 'src/pages/Auth';
import AppSnackbar from 'src/components/Snackbar';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/auth" component={Auth} />
      </Switch>
      <AppSnackbar />
    </BrowserRouter>
  );
};

export default memo(App);
