import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { Login } from './modules/User/pages/Login';
import { Register } from './modules/User/pages/Register';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
      </Routes>
    </Router>
  );
};

export { App };
