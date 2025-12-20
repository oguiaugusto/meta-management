import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthRedirect } from './shared/components/AuthRedirect';
import { Home } from './modules/Home/pages/Home';
import { Login } from './modules/Auth/pages/Login';
import { Register } from './modules/Auth/pages/Register';
import { Databases } from './modules/Database/pages/Databases';
import { Database } from './modules/Database/pages/Database';
import { AuthProvider } from './shared/contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={ queryClient }>
      <AuthProvider>
        <Toaster position="top-center" />
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
    </QueryClientProvider>
  );
};

export { App };
