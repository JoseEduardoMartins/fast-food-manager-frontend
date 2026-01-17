import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import OwnerRegister from './pages/OwnerRegister';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Careers from './pages/Careers';
import Platform from './pages/Platform';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { ROUTES } from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.OWNER_REGISTER} element={<OwnerRegister />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.CAREERS} element={<Careers />} />
        <Route path={ROUTES.PLATFORM} element={<Platform />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
