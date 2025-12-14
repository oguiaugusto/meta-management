import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { AuthRedirect } from './shared/components/AuthRedirect';
import { Home } from './modules/Home/pages/Home';
import { Login } from './modules/User/pages/Login';
import { Register } from './modules/User/pages/Register';
import { Databases } from './modules/Database/pages/Databases';
import { Database } from './modules/Database/pages/Database';
import { AuthProvider } from './shared/contexts/AuthContext';

const renderRouter = (
  path: string,
  element: React.ReactNode,
  isProtected?: boolean,
) => {
  const protectedElement = (
    <AuthRedirect isProtected={ isProtected }>{ element }</AuthRedirect>
  );

  return (
    <Route path={ path } element={ protectedElement } />
  );
}

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          { renderRouter('/login', <Login />) }
          { renderRouter('/register', <Register />) }
          { renderRouter('/', <Home />, true) }
          { renderRouter('/databases', <Databases />, true) }
          { renderRouter('/databases/:id', <Database />, true) }
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export { App };
