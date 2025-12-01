import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { Login } from './modules/User/pages/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Login /> } />
      </Routes>
    </Router>
  );
};

export { App };
