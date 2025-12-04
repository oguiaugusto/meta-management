import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { Home } from './modules/User/pages/Home';
import { Login } from './modules/User/pages/Login';
import { Register } from './modules/User/pages/Register';
import { Databases } from './modules/User/pages/Databases';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/databases" element={ <Databases /> } />
      </Routes>
    </Router>
  );
};

export { App };
